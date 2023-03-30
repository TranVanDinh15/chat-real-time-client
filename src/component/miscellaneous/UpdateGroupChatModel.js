import React, { useCallback, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react';
import { GetContext } from '../../Context/chatProvide';
import UserBadgeItem from './UserBadgeItem';
import { debounce } from 'lodash';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import UserListItem from '../../userListItem/userListItem';
import { AddIcon } from '@chakra-ui/icons';
import { decodeToken } from './decode';
const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
    const { user, selectedChat, setSelectedChat } = GetContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reNameLoading, setRenameLoading] = useState(false);
    const toast = useToast();
    const decode = decodeToken(user?.token);
    console.log(selectedChat);
    const handleRemove = async (userRemove) => {
        try {
            console.log(selectedChat);
            setLoading(true);
            const response = await axiosInstance(user?.token).put('/api/removeUserChat', {
                chatId: selectedChat._id,
                userId: userRemove._id,
            });
            if (response.status == 200) {
                setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                fetchMessage();
                setLoading(false);
            }
        } catch (error) {
            toast({
                description: 'Đã xảy ra lỗi',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };
    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true);
            const response = await axiosInstance(user?.token).put('/api/renameChat', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            });
            if (response.status == 200) {
                console.log(response);
                setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                setRenameLoading(false);
            }
        } catch (error) {
            toast({
                description: 'Đã có lỗi xảy ra',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            setRenameLoading(false);
            setGroupChatName('');
        }
    };
    console.log(searchResult);
    const handleAddUser = async (userAdd) => {
        if (
            selectedChat.user.find((u) => {
                return u._id == userAdd._id;
            })
        ) {
            toast({
                description: 'Người dùng đã có mặt trong nhóm ',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== decode._id) {
            toast({
                description: 'Bạn cần có quyền Admin để thêm thành viên',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance(user?.token).put('/api/addUserChat', {
                chatId: selectedChat._id,
                userId: userAdd._id,
            });
            if (response.status == 200) {
                setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                setLoading(false);
            }
        } catch (error) {
            toast({
                description: 'Đã xảy ra lỗi',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };
    const handleInputChange = async (event) => {
        try {
            setLoading(true);
            const response = await axiosInstance(user?.token).post(`/api/searchUser?search=${event.target.value}`);
            if (response.status == 200) {
                console.log(response);
                setSearchResult(response.data);
                setLoading(false);
            }
        } catch (error) {}
    };

    const debouncedHandleInputChange = useCallback(debounce(handleInputChange, 500), []);
    return (
        <>
            <Button onClick={onOpen}>Update</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={'35px'} display={'flex'} justifyContent={'center'}>
                        {selectedChat?.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={'flex'} flexWrap={'wrap'} p={3}>
                            {selectedChat?.user.map((item) => {
                                return (
                                    <UserBadgeItem
                                        key={item._id}
                                        user={item}
                                        handleFunction={() => handleRemove(item)}
                                    />
                                );
                            })}
                        </Box>
                        <FormControl display={'flex'}>
                            <Input
                                placeholder="Tên nhóm chat"
                                mb={3}
                                onChange={(event) => {
                                    setGroupChatName(event.target.value);
                                }}
                            />
                            <Button
                                variant={'solid'}
                                colorScheme={'teal'}
                                ml={1}
                                isLoading={reNameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Thêm người dùng " mb={3} onChange={debouncedHandleInputChange} />
                        </FormControl>
                        {loading ? (
                            <Spinner size={'lg'} />
                        ) : (
                            searchResult.map((item) => {
                                return (
                                    <Box>
                                        <UserListItem
                                            key={item._id}
                                            user={item}
                                            handleFunction={() => handleAddUser(item)}
                                        />
                                    </Box>
                                );
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme="red">Rời nhóm</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModel;
