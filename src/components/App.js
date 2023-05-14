import { Routes, Route, navigate, useNavigate } from 'react-router-dom';
import Login from '../components/Login.js'
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import MainPage from './MainPage.js';
import { useEffect, useState } from 'react';
import { authApi } from '../utils/authApi.js';

function App() {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const handleRegisterSubmit = (email, password) => {
        authApi.signUp(email, password)
            .then(() => { 
                alert('пользователь успешно зарегистрирован')
                navigate('/sign-in')
            })
            .catch((error) => alert(`ошибка регистрации: ${error}`))
    }

    const handleLoginSubmit = (email, password) => {
        authApi.signIn(email, password)
            .then((response) => {
                localStorage.setItem('token', response);
                setLoggedIn(true);
                setUserEmail(email);
            })
            .catch((error) => alert(`ошибка логина: ${error}`))
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authApi.checkUser(token)
                .then((response) => {
                    setLoggedIn(true);
                    setUserEmail(response.email);
                })
                .catch((error) => alert(`ошибка логина: ${error}`))
        }
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<ProtectedRoute element={<MainPage userEmail={userEmail} />} loggedIn={loggedIn} />} />
                <Route path="/sign-up" element={<Register handleRegisterSubmit={handleRegisterSubmit} />} />
                <Route path="/sign-in" element={<Login handleLoginSubmit={handleLoginSubmit} />} />
            </Routes>
        </div>
    );
}

export default App;
