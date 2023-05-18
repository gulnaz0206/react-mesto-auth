import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login.js'
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import MainPage from './MainPage.js';
import { useEffect, useState } from 'react';
import { authApi } from '../utils/authApi.js';
import { api } from '../utils/api.js';

function App() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const [isRegisterSuccessPopupOpened, setIsRegisterSuccessPopupOpened] = useState(false);
    const [isRegisterErrorPopupOpened, setIsRegisterErrorPopupOpened] = useState(false);

    const [isLoginErrorPopupOpened, setIsLoginErrorPopupOpened] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [cards, setCards] = useState([]);

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

    const [selectedCard, setSelectedCard] = useState(null);

    const handleRegisterSubmit = (email, password) => {
        authApi.signUp(email, password)
            .then(() => {
                setIsRegisterSuccessPopupOpened(true);
            })
            .catch(() => setIsRegisterErrorPopupOpened(true))
    }

    const handleLoginSubmit = (email, password) => {
        authApi.signIn(email, password)
            .then((response) => {
                localStorage.setItem('token', response);
                setLoggedIn(true);
                setUserEmail(email);
            })
            .catch(() => isLoginErrorPopupOpened(true))
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

    const handleCardLike = (card) => {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((prevCards) => prevCards.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((error) => alert(error));
    }

    const handleCardDelete = (card) => {
        api.deleteCard(card._id)
            .then(() => {
                setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
            })
            .catch((error) => alert(error));
    };

    useEffect(() => {
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then((response) => {
                    setCurrentUser(response[0]);
                    setCards(response[1]);
                })
                .catch((error) => alert(error));
        }
    }, [loggedIn]);

    const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
    const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
    const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);

    const closeAllPopups = () => {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
        setIsRegisterErrorPopupOpened(false);
        setIsRegisterSuccessPopupOpened(false);
        setIsLoginErrorPopupOpened(false);
    }

    const handleCardClick = (card) => { setSelectedCard(card) };

    const handleUpdateUser = ({ name, about }) => {
        api.editUserInfo(name, about)
            .then((result) => {
                setCurrentUser(result);
                closeAllPopups();
            })
            .catch((error) => alert(error));
    }

    const handleUpdateAvatar = ({ avatar }) => {
        api.editUserAvatar(avatar)
            .then((result) => {
                setCurrentUser(result);
                closeAllPopups();
            })
            .catch((error) => alert(error));
    }

    const handleAddPlaceSubmit = ({ name, link }) => {
        api.addNewCard(name, link)
            .then((response) => {
                setCards([response, ...cards]);
                closeAllPopups();
            })
            .catch((error) => alert(error));
    }

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={<ProtectedRoute element={<MainPage
                        userEmail={userEmail}
                        isEditAvatarPopupOpen={isEditAvatarPopupOpen}
                        isEditProfilePopupOpen={isEditProfilePopupOpen}
                        isAddPlacePopupOpen={isAddPlacePopupOpen}
                        selectedCard={selectedCard}
                        handleCardLike={handleCardLike}
                        handleCardDelete={handleCardDelete}
                        handleEditAvatarClick={handleEditAvatarClick}
                        handleEditProfileClick={handleEditProfileClick}
                        handleAddPlaceClick={handleAddPlaceClick}
                        handleCardClick={handleCardClick}
                        handleUpdateUser={handleUpdateUser}
                        handleUpdateAvatar={handleUpdateAvatar}
                        handleAddPlaceSubmit={handleAddPlaceSubmit}
                        cards={cards}
                        currentUser={currentUser}
                        closeAllPopups={closeAllPopups}
                    />}
                    />}
                />
                <Route
                    path="/sign-up"
                    element={<Register handleRegisterSubmit={handleRegisterSubmit}
                        isOpenErrorPopup={isRegisterErrorPopupOpened}
                        isOpenSuccessPopup={isRegisterSuccessPopupOpened}
                        closeRegisterPopups={closeAllPopups} />}
                />
                <Route
                    path="/sign-in"
                    element={<Login
                        handleLoginSubmit={handleLoginSubmit}
                        isOpenErrorPopup={isLoginErrorPopupOpened}
                        closeLoginErrorPopup={closeAllPopups}
                    />} />
            </Routes>
        </div>
    );
}

export default App;
