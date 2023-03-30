import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router';
import HomePage from './Page/Home/HomePage';
import ChatPage from './Page/ChatPage/ChatPage';
import ChatProvide from './Context/chatProvide';

function App() {
    return (
        <ChatProvide>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ChatPage" element={<ChatPage />} />
                </Routes>
            </div>
        </ChatProvide>
    );
}

export default App;
