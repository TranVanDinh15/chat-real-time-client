import { Box, Container, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../component/Authenticate/Login';
import SignUp from '../../component/Authenticate/SignUp';

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userInfor = JSON.parse(localStorage.getItem('userInfor'));
        if (userInfor) {
            navigate('/ChatPage');
        }
    }, []);
    return (
        <Container maxW={'xl'} centerContent d={'flex'} justifyContent={'center'}>
            <Box
                bg={'white'}
                margin={'40px 0px 15px 0'}
                d={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'lg'}
                borderWidth={'1px'}
                w={'100%'}
                p={3}
                textAlign={'center'}
            >
                <Text fontSize={'26px'} fontWeight={'300'}>
                    TALK-TIME
                </Text>
            </Box>
            <Box
                bg={'white'}
                margin={'40px 0px 15px 0'}
                d={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'lg'}
                borderWidth={'1px'}
                w={'100%'}
                p={3}
            >
                <Tabs variant="soft-rounded" colorScheme="green">
                    <TabList>
                        <Tab width={'50%'}>Login</Tab>
                        <Tab width={'50%'}>Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;
