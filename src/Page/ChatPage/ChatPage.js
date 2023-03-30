import { Box, Container } from '@chakra-ui/react';
import React, { useState } from 'react';
import ChatBox from '../../component/miscellaneous/ChatBox';
import MyChat from '../../component/miscellaneous/MyChat';
import SideDrawer from '../../component/miscellaneous/SideDrawer';
import { GetContext } from '../../Context/chatProvide';
const ChatPage = () => {
    const { user } = GetContext();
    const [fetchAgain, setFetchAgain] = useState(false);
    console.log(user);
    return (
        <>
            {user ? (
                <Box w={'100%'}>
                    <SideDrawer />
                    <Box display={'flex'} justifyContent={'space-between'} p={'0 20px 0 20px'}>
                        <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    </Box>
                </Box>
            ) : (
                ''
            )}
        </>
    );
};

export default ChatPage;
