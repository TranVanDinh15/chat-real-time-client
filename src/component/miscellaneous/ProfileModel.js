import { ViewIcon } from '@chakra-ui/icons';
import {
    Button,
    IconButton,
    Image,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={'center'} fontFamily={'monospace'}>
                        PROFILE USER
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Image
                            borderRadius={'full'}
                            boxSize={'150px'}
                            src={user?.pic || user?.picture}
                            alt={user?.name}
                        />
                        <Text fontSize={{ base: '28px', md: '30px' }}>Email: {user?.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModel;
