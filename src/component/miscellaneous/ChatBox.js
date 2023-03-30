import { Box } from '@chakra-ui/react';
import React from 'react';
import { GetContext } from '../../Context/chatProvide';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = GetContext();

    return (
        <Box
            display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
            alignItems={'center'}
            flexDir={'column'}
            p={3}
            bg={'white'}
            w={{ base: '100%', md: '67%' }}
            borderRadius={'lg'}
            borderWidth={'1px'}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox;
