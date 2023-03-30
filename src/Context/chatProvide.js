import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();
const ChatProvide = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState('');
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    useEffect(() => {
        const userInfor = JSON.parse(localStorage.getItem('userInfor'));
        if (userInfor) {
            setUser(userInfor);
        }
        if (!userInfor) {
            navigate('/');
        }
    }, [navigate]);
    return (
        <ChatContext.Provider
            value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}
        >
            {children}
        </ChatContext.Provider>
    );
};
export const GetContext = () => {
    return useContext(ChatContext);
};
export default ChatProvide;
