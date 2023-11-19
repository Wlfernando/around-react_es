import { useState, useEffect, useRef } from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import api from '../utils/api.js';

function App() {
  const
    [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false),
    [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false),
    [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false),
    [isImageOpen, setImageOpen] = useState(false),
    [isDltPopupOpen, setDltPopupOpen] = useState(false),
    [selectedCard, setSelectedCard] = useState({}),
    [currentUser, setCurrentUser] = useState({}),
    [cards, setCards] = useState([]),

    cardIdRef = useRef('');

  useEffect(()=> {
    api.do('GET', api.me)
      .then(setCurrentUser)
      .catch(console.log)

    api.do('GET', api.cards)
      .then(setCards)
      .catch(console.log)
  }, [])

  useEffect(()=> {
    const hasOpened = [
      isEditProfilePopupOpen,
      isEditAvatarPopupOpen,
      isAddPlacePopupOpen,
      isImageOpen,
      isDltPopupOpen,
    ].some(Boolean);

    function handleListenerClose(e) {
      const
        hasClicked = ['popup_active', 'popup__image-container']
          .some(click => e.target.classList.contains(click)),
        escPressed = e.key === 'Escape';

      if(hasClicked || escPressed) closeAllPopups()
    }

    if(hasOpened) {
      document.addEventListener('click', handleListenerClose)
      document.addEventListener('keydown', handleListenerClose)
    }

    return ()=> {
      document.removeEventListener('keydown', handleListenerClose)
      document.removeEventListener('click', handleListenerClose)
    }
  }, [
    isEditProfilePopupOpen,
    isEditAvatarPopupOpen,
    isAddPlacePopupOpen,
    isImageOpen,
    isDltPopupOpen,
  ])

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setImageOpen(true)
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false)
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setImageOpen(false)
    setDltPopupOpen(false)
  }

  function handleUpdateUser(form) {
    api.send('PATCH', api.me, form)
      .then(setCurrentUser)
      .catch(console.log)
      .finally(closeAllPopups)
  }

  function handleUpdateAvatar(form) {
    api.send('PATCH', api.avatar, form, api.me)
      .then(setCurrentUser)
      .catch(console.log)
      .finally(closeAllPopups)
  }

  function handleCardLike(isLiked, cardId) {
    api.do(isLiked ? 'DELETE' : 'PUT', api.likes, cardId)
      .then(() => api.do('GET', api.cards))
      .then(newCard =>
        setCards(state => {
          const likedCard = state
            .findIndex(({ _id }) => _id === cardId);

          return state.with(likedCard, newCard.at(likedCard))
        })
      )
      .catch(console.log)
  }

  function handleCardDelete() {
    const theId = cardIdRef.current;

    api.do('DELETE', api.cards, theId)
      .then(() =>
        setCards(state => {
          const deletedCard = state
            .findIndex(({ _id }) => _id === theId);

          return state
            .slice(0, deletedCard)
            .concat(state.slice(deletedCard + 1));
        })
      )
      .catch(console.error)
      .finally(closeAllPopups)
  }

  function handleAddPlaceSubmit(form) {
    api.send('POST', api.cards, form)
      .then(setCards)
      .catch(console.log)
      .finally(closeAllPopups)
  }

  function willCardDelete(cardId) {
    cardIdRef.current = cardId;
    setDltPopupOpen(true)
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          onEditProfileClick={
            {isEditProfilePopupOpen, handleEditProfileClick}
          }
          onAddPlaceClick={
            {isAddPlacePopupOpen, handleAddPlaceClick}
          }
          onEditAvatarClick={
            {isEditAvatarPopupOpen, handleEditAvatarClick}
          }
          onCardClick={
            {selectedCard, isImageOpen, handleCardClick}
          }
          onDltClick={
            {isDltPopupOpen, willCardDelete}
          }
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onUpdateAvatar={handleUpdateAvatar}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          onCardSubmit={handleAddPlaceSubmit}
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;