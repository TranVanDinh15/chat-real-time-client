import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    VStack,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const handleLogin = async () => {
        console.log('ok');
        if (!email || !password) {
            toast({
                title: 'Account created.',
                description: 'Vui lòng điền đầy đủ thông tin.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
        } else {
            console.log(process.env.REACT_APP_URL);
            const user = {
                email,
                password,
            };
            const response = await axios.post(`${process.env.REACT_APP_URL}/api/authUser`, user);
            console.log(response);
            if (response.status == 200) {
                toast({
                    // title: 'Account created.',
                    description: 'Đăng nhập thành công.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                localStorage.setItem('userInfor', JSON.stringify(response.data));
                navigate('/ChatPage');
            }
        }
    };
    return (
        <VStack spacing={4}>
            <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input
                    type="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <InputRightElement w={'4.5rem'}>
                        <Button
                            h={'1.75rem'}
                            size={'sm'}
                            onClick={() => {
                                if (show) {
                                    setShow(false);
                                } else {
                                    setShow(true);
                                }
                            }}
                        >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Wrap spacing={4}>
                <WrapItem width={'100%'}>
                    <Button
                        colorScheme="blue"
                        w={'lg'}
                        onClick={() => {
                            handleLogin();
                        }}
                    >
                        Login
                    </Button>
                </WrapItem>
                <WrapItem w={'100%'}>
                    <Button colorScheme="red" w={'lg'}>
                        Đăng nhập với tư cách khách
                    </Button>
                </WrapItem>
            </Wrap>
        </VStack>
    );
};

export default Login;
