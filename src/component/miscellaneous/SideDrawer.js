import { ChevronDownIcon, Search2Icon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Text,
    Tooltip,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Wrap,
    WrapItem,
    Avatar,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerContent,
    useDisclosure,
    Input,
    useToast,
    Spinner,
    Stack,
    Skeleton,
} from '@chakra-ui/react';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
// import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import { useNavigate } from 'react-router';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import { getSender } from '../../config/ChatLogics';
import { GetContext } from '../../Context/chatProvide';
import UserListItem from '../../userListItem/userListItem';
import ProfileModel from './ProfileModel';
const SideDrawer = () => {
    const { selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = GetContext();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState('');
    const [loadingChat, setLoadingChat] = useState('');
    const [resultSearch, setResultSearch] = useState([]);
    const [userId, setUserId] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const user = JSON.parse(localStorage.getItem('userInfor')).user;
    const token = JSON.parse(localStorage.getItem('userInfor')).token;
    const handleLogout = () => {
        localStorage.removeItem('userInfor');
        setChats([]);
        navigate('/');
    };
    console.log(resultSearch);
    const handleSearch = async () => {
        try {
            setLoading(true);
            if (!search) {
                toast({
                    description: 'Vui lòng nhập người dùng cần tìm kiếm.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
                setLoading(false);
                return;
            }
            const response = await axiosInstance(token).post(`/api/searchUser?search=${search}`);
            if (response.status == 200) {
                console.log('ok');
                setResultSearch(response.data);
                setLoading(false);
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
    const handleAcessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const response = await axiosInstance(token).post(`/api/chat`, {
                userId,
            });
            if (response.status == 200) {
                console.log(response);
                if (!chats.find((c) => c._id == response.data._id)) {
                    setChats([response.data, ...chats]);
                }
                onClose();
                selectedChat(response.data);
                setLoadingChat(false);
            }
        } catch (error) {
            toast({
                description: 'Đã có lỗi xảy ra.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };
    return (
        <>
            <Box
                width={'100%'}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                padding={'10px 10px 10px 10px'}
                marginBottom={'20px'}
            >
                <Tooltip label={'Tìm kiếm người dùng'} hasArrow placement="bottom-end">
                    <Button variant={'ghost'} onClick={onOpen}>
                        <Icon as={Search2Icon} />
                        <Text d={{ base: 'none', md: 'flex' }} px={'10px'} className={'text_search'}>
                            Tìm kiếm
                        </Text>
                    </Button>
                </Tooltip>
                <Text
                    fontSize={'xl'}
                    fontFamily={'work sans'}
                    fontWeight={500}
                    color={'facebook.900'}
                    className={'textLogo'}
                >
                    TVD CHAT 😄
                </Text>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box marginRight={'10px'}>
                        <Menu>
                            <MenuButton p={1}>
                                <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                                <FontAwesomeIcon
                                    icon={faBell}
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        marginTop: '10px',
                                        marginRight: '10px',
                                        // color: 'red',
                                    }}
                                    className={'bell_icon'}
                                />
                            </MenuButton>
                            <MenuList pl={2}>
                                {!notification.length && 'No new Message'}
                                {notification.map((item, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            onClick={() => {
                                                setSelectedChat(item.chat);
                                                setNotification(notification.filter((n) => n !== item));
                                            }}
                                        >
                                            {item.chat.isGroupChat
                                                ? `Tin nhắn mới từ ${item.chat.chatName}`
                                                : `Tin nhắn mới từ ${getSender(user?.user, item.chat.user)}`}
                                        </MenuItem>
                                    );
                                })}
                            </MenuList>
                        </Menu>
                    </Box>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Wrap>
                                <WrapItem>
                                    <Avatar name={user?.name} src={user?.pic} size={'xs'} className={'avatar_header'} />
                                </WrapItem>
                            </Wrap>
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>Hồ sơ</MenuItem>
                            </ProfileModel>
                            <MenuItem
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Log out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Tìm kiếm</DrawerHeader>

                        <DrawerBody>
                            <Box display={'flex'}>
                                <Input
                                    placeholder="Nhập tên người dùng..."
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                    }}
                                />
                                <Button
                                    marginLeft={'10px'}
                                    onClick={() => {
                                        handleSearch();
                                    }}
                                >
                                    Search
                                </Button>
                            </Box>
                            {loading ? (
                                <Stack marginTop={'10px'}>
                                    <Skeleton height="40px" />
                                    <Skeleton height="40px" />
                                    <Skeleton height="40px" />
                                    <Skeleton height="40px" />
                                    <Skeleton height="40px" />
                                    <Skeleton height="40px" />
                                    <Skeleton height="40px" />
                                </Stack>
                            ) : resultSearch ? (
                                resultSearch.map((item, index) => {
                                    return (
                                        <UserListItem
                                            user={item}
                                            handleFunction={() => handleAcessChat(item._id)}
                                            key={index}
                                        />
                                    );
                                })
                            ) : (
                                ''
                            )}
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    );
};

export default SideDrawer;
