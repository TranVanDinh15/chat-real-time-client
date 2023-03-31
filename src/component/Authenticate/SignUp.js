import React, { useState } from 'react';

import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    useToast,
    VStack,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import axios from 'axios';
import axiosInstance from '../../AxiosConfig/AxiosConfig';

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pics, setPics] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const handleSubmit = async () => {
        if (!email || !password || !name || !confirmPassword) {
            toast({
                title: 'Account created.',
                description: 'Vui lòng điền đầy đủ thông tin.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
        } else {
            if (password != confirmPassword) {
                toast({
                    title: 'Account created.',
                    description: 'Xác thực password không trùng khớp.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                const form = new FormData();
                form.append('name', name);
                form.append('email', email);
                form.append('password', password);
                form.append('pic', pics);
                const userRegister = {
                    name,
                    email,
                    password,
                    pic: pics,
                };
                setLoading(true);
                const response = await axiosInstance().post('/api/createUser', form);
                if (response) {
                    console.log(response);
                    if (response.status == 201) {
                        toast({
                            title: 'Account created.',
                            description: 'Đăng kí thành công :))',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                            position: 'top',
                        });
                        setLoading(false);
                    }
                }
            }
        }
    };
    return (
        <VStack spacing={4}>
            <FormControl>
                <FormLabel>Tên của bạn</FormLabel>
                <Input
                    type="text"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
            </FormControl>
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
                <FormLabel>Mật khẩu</FormLabel>
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
            <FormControl>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <InputGroup>
                    <Input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                    />
                    <InputRightElement w={'4.5rem'}>
                        <Button
                            h={'1.75rem'}
                            size={'sm'}
                            onClick={() => {
                                if (showConfirm) {
                                    setShowConfirm(false);
                                } else {
                                    setShowConfirm(true);
                                }
                            }}
                        >
                            {showConfirm ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Ảnh đại diện</FormLabel>
                <Input
                    type="file"
                    // value={pics}
                    onChange={(event) => {
                        setPics(event.target.files[0]);
                    }}
                />
            </FormControl>
            <Wrap spacing={4} w={'100%'} display={'flex'} justifyContent={'center'}>
                <WrapItem width={'100%'}>
                    <Button
                        colorScheme="blue"
                        w={'lg'}
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Đăng ký
                    </Button>
                </WrapItem>
            </Wrap>
            {loading == true ? (
                <Box
                    position={'fixed'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    top={'-5'}
                    left={'0'}
                    right={'0'}
                    bottom={'0'}
                    backgroundColor={'#00800033'}
                    marginTop={'0'}
                >
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Box>
            ) : (
                ''
            )}
        </VStack>
    );
};

export default SignUp;
