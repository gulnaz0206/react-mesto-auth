import { useEffect, useState, useContext } from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import Main from './Main.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import { api } from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';

function MainPage({userEmail}) {

    const [currentUser, setCurrentUser] = useState(null);
    const [cards, setCards] = useState([]);

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        api.getInitialCards()
            .then((result) => setCards(result))
            .catch((error) => alert(error));
    }, []);

    const handleCardLike = (card) => {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                // Обновляем стейт
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
        api.getUserInfo()
            .then((response) => setCurrentUser(response))
            .catch((error) => alert(error));
    }, []);

    const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
    const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
    const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);

    const closeAllPopups = () => {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
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
        <>

            <CurrentUserContext.Provider value={currentUser}>

                <Header>
                    {userEmail}
                </Header>

                <Main
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                />

                <Footer />

                {/* Попап редактирования профиля */}
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

                {/* Попап добавления карточки */}
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

                {/* Попап большой картинки */}
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />

                {/* Попап удаления картинки */}
                <PopupWithForm title={'Вы уверены?'} buttonText={'Да'} name={'delete-picture'} isOpen={false} onClose={closeAllPopups} />

                {/* Попап смены аватара */}
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

            </CurrentUserContext.Provider>

        </>
    )
}

export default MainPage;