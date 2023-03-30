import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import { GetContext } from '../../Context/chatProvide';
import { debounce } from 'lodash';
import UserListItem from '../../userListItem/userListItem';
import UserBadgeItem from './UserBadgeItem';
import { decodeToken } from './decode';

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = GetContext();
    const decode = decodeToken(user?.token);
    console.log(decode);
    const handleInputChange = async (event) => {
        let query = event.target.value;
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance(user?.token).post(`/api/searchUser?search=${query}`);
            console.log(response);
            if (response.status == 200) {
                setSearchResult(response.data);
                setLoading(false);
            }
        } catch (error) {
            toast({
                description: 'Đã có lỗi xảy ra',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const debouncedHandleInputChange = useCallback(debounce(handleInputChange, 500), []);
    const handleGroup = (user) => {
        if (selectedUser.includes(user)) {
            toast({
                description: 'Người dùng đã sẵn sàng thêm',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        setSelectedUser([...selectedUser, user]);
    };
    const handleDelete = (user) => {
        setSelectedUser(selectedUser.filter((item) => item._id != user._id));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!groupChatName || !selectedUser) {
            toast({
                description: 'Vui lòng điền đầy đủ thông tin',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        try {
            // setLoading()

            const response = await axiosInstance(user?.token).post('/api/createGroupChat', {
                name: groupChatName,
                user: JSON.stringify(selectedUser.map((u) => u._id)),
            });
            if (response.status == 200) {
                setChats([...chats, response.data]);
                onClose();
                toast({
                    description: 'Tạo nhóm chat thành công ',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }
            console.log(response);
        } catch (error) {
            toast({
                description: 'Đã có lỗi xảy ra',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
                        <FormControl>
                            <Input
                                placeholder="Tên nhóm chat"
                                mb={3}
                                onChange={(event) => {
                                    setGroupChatName(event.target.value);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Thêm người dùng: vd: Trần Văn Định, Trần Văn A.... "
                                mb={3}
                                onChange={debouncedHandleInputChange}
                            />
                        </FormControl>
                        <Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {selectedUser.map((item, index) => {
                                return (
                                    <UserBadgeItem
                                        key={item._id}
                                        user={item}
                                        handleFunction={() => handleDelete(item)}
                                    />
                                );
                            })}
                        </Box>
                        {loading ? (
                            <span>Loading...</span>
                        ) : (
                            searchResult?.slice(0, 4).map((item, index) => {
                                return <UserListItem user={item} handleFunction={() => handleGroup(item)} />;
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme="green" mr={3} onClick={handleSubmit}>
                            Tạo nhóm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModel;
