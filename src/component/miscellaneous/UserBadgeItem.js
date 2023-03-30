import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ key, user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={'lg'}
            m={1}
            mb={2}
            variant="solid"
            fontSize={'13px'}
            backgroundColor={'green'}
            color={'white'}
            cursor={'pointer'}
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon fontSize={12} marginLeft={2} />
        </Box>
    );
};

export default UserBadgeItem;
