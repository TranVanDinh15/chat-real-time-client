import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import { getSender } from '../../config/ChatLogics';
import { GetContext } from '../../Context/chatProvide';
import GroupChatModel from './GroupChatModel';

const MyChat = ({ fetchAgain }) => {
    const [loggerUser, setLoggerUser] = useState();
    const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = GetContext();
    const toast = useToast();
    const fetchChat = async () => {
        try {
            // setLoadingChat(true);

            const response = await axiosInstance(user?.token).post(`/api/fetchChat`);
            if (response.status == 200) {
                console.log(response);
                setChats(response.data);
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
    useEffect(() => {
        setLoggerUser(JSON.parse(localStorage.getItem('userInfor')));
        fetchChat();
    }, [fetchAgain]);
    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir={'column'}
            alignItems={'center'}
            p={3}
            bg={'white'}
            w={{ base: '100%', md: '31%' }}
            borderRadius={'lg'}
            borderWidth={'1px'}
            height={'83vh'}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '20px', md: '20px' }}
                display={'flex'}
                width={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                My Chat
                <GroupChatModel>
                    <Button
                        display={'flex'}
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        Tạo Group Chat
                    </Button>
                </GroupChatModel>
            </Box>
            <Box
                display={'flex'}
                flexDir={'column'}
                p={3}
                bg={'F8F8F8'}
                width={'100%'}
                height={'100%'}
                borderRadius={'lg'}
                overflow={'hidden'}
            >
                {chats ? (
                    <Stack overflowY={'scroll'}>
                        {chats.map((item, index) => {
                            console.log(!item.isGroupChat);
                            return (
                                <Box
                                    onClick={() => setSelectedChat(item)}
                                    cursor={'pointer'}
                                    bg={selectedChat === item ? '#38B2AC' : '#E8E8E8'}
                                    color={selectedChat == item ? 'white' : 'black'}
                                    px={3}
                                    py={2}
                                    borderRadius={'lg'}
                                    key={item._id}
                                    _hover={{
                                        background: '#38B2AC',
                                        color: 'white',
                                    }}
                                >
                                    <Text>{!item.isGroupChat ? getSender(loggerUser, item.user) : item.chatName}</Text>
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    ''
                )}
            </Box>
        </Box>
    );
};

export default MyChat;
