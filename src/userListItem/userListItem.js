import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserListItem = ({ user, handleFunction }) => {
    console.log(user);
    return (
        <Box
            onClick={handleFunction}
            bg={'#E8E8E8'}
            _hover={{
                background: '#38B2AC',
                color: 'white',
            }}
            width={'100%'}
            display={'flex'}
            alignItems={'center'}
            color={'black'}
            px={3}
            py={2}
            mb={2}
            borderRadius={'lg'}
            marginTop={'20px'}
            cursor={'pointer'}
        >
            <Avatar mr={2} size={'sm'} cursor={'pointer'} name={user?.name} src={user?.picture} />
            <Box>
                <Text>{user?.name}</Text>
                <Text fontSize={'xs'}>Email: {user?.email}</Text>
            </Box>
        </Box>
    );
};

export default UserListItem;
