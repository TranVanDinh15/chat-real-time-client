import { ArrowBackIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, FormControl, IconButton, Image, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import { getSender, getSenderAvarta, getSenderFull } from '../../config/ChatLogics';
import { GetContext } from '../../Context/chatProvide';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import '../styles.css';
import ScrollAbleChat from './ScrollAbleChat';
import { decodeToken } from './decode';
const { io } = require('socket.io-client');
// import { io } from 'socket.io-client';
const ENPOINT = process.env.REACT_APP_URL;
let socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = GetContext();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [clickButton, setClickButton] = useState(false);
    // const userId = decodeToken(user?.token);
    const decodeId = decodeToken(user?.token);
    const toast = useToast();
    console.log(selectedChat);
    const sendMessage = async (event) => {
        if (newMessages) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const response = await axiosInstance(user?.token).post('/api/sendMessage', {
                    content: newMessages,
                    chatId: selectedChat._id,
                });
                if (response.status == 200) {
                    // setNewMessages('');
                    // console.log(response);
                    await socket.emit('newMessage', response.data);
                    setMessages([...messages, response.data]);
                }
            } catch (error) {
                toast({
                    description: 'Đã có lỗi xảy ra',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
                console.log(error);
            }
        }
    };
    const typingHandle = (event) => {
        setNewMessages(event.target.value);
        // if (!socketConnected) {
        //     return;
        // }
        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastestPingTime = new Date().getTime();
        const timeLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastestPingTime;
            if (timeDiff >= timeLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timeLength);
    };
    const getAllMessage = async () => {
        if (!selectedChat._id) return;
        try {
            setLoading(true);
            const response = await axiosInstance(user?.token).get(`/api/getChat/${selectedChat._id}`);
            if (response.status == 200) {
                setMessages(response.data);
                setLoading(false);
                socket.emit('join chat', selectedChat._id);
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
    useEffect(() => {
        socket = io(ENPOINT);
        // socket.emit('setup', userId);
        // socket.on('connection', () => setSocketConnected(false));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);
    useEffect(() => {
        getAllMessage();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);
    // useEffect(() => {
    socket?.on('newMessage', (newMessageRecieved) => {
        if (selectedChatCompare._id !== newMessageRecieved.chat._id) {
            // give notification
            if (!notification.includes(newMessageRecieved)) {
                setNotification([newMessageRecieved, ...notification]);
                setFetchAgain(!fetchAgain);
            }
        } else {
            console.log(newMessageRecieved);
            if (decodeId === newMessageRecieved.sender._id) {
                return;
            }
            setMessages([...messages, newMessageRecieved]);
        }
    });
    // }, []);
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w={'100%'}
                        fontFamily={'work sans'}
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat('')}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                <Text fontSize={'xl'} display={'flex'} alignItems={'center'}>
                                    <Avatar
                                        size="xs"
                                        name={getSender(user, selectedChat.user)}
                                        src={getSenderAvarta(user, selectedChat.user)}
                                    />
                                    <Text fontSize={'xl'} marginLeft={'10px'}>
                                        {getSender(user, selectedChat.user)}
                                    </Text>
                                </Text>
                                <ProfileModel user={getSenderFull(user, selectedChat.user)} />
                            </>
                        ) : (
                            <Text fontSize={'xl'} display={'flex'} justifyContent={'space-between'} w={'100%'}>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessage={getAllMessage}
                                />
                            </Text>
                        )}
                    </Text>
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'flex-end'}
                        p={3}
                        bg={'#E8E8E8'}
                        w={'100%'}
                        h={'70vh'}
                        borderRadius={'lg'}
                        overflowY={'hidden'}
                    >
                        {loading == true ? (
                            <Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'} />
                        ) : (
                            <div className="messages">
                                <ScrollAbleChat messages={messages} />
                            </div>
                        )}
                        <FormControl
                            onKeyDown={(event) => {
                                if (event.key == 'Enter') {
                                    sendMessage();
                                }
                            }}
                            isRequired
                            mt={3}
                        >
                            {isTyping ? (
                                <img
                                    src="https://cdn.dribbble.com/users/8424/screenshots/1036999/dots_2.gif"
                                    style={{
                                        width: '40px',
                                        borderRadius: '40px',
                                        marginBottom: '20px',
                                    }}
                                ></img>
                            ) : (
                                ''
                            )}
                            <Box display={'flex'} alignItems={'center'}>
                                <Input
                                    variant={'filled'}
                                    bg={'E0E0E0'}
                                    placeholder={'Viết tin nhắn...'}
                                    onChange={typingHandle}
                                    marginRight={'10px'}
                                />
                                <Button
                                    colorScheme="teal"
                                    size="sm"
                                    display={'flex'}
                                    alignItems={'center'}
                                    // w={'40px'}
                                    height={'38px'}
                                    onClick={(event) => {
                                        sendMessage(event);
                                    }}
                                >
                                    Gửi
                                </Button>
                            </Box>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} h={'100%'}>
                    <Text fontSize={'2xl'} pb={3} fontFamily={'work sans'} fontWeight={400}>
                        Chọn một người dùng bất kì để bắt đầu chat
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
