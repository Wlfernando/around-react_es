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
    [currentUser, setCurrentUser] = useState({}),
    [cards, setCards] = useState([]),

    cardDisplayRef = useRef({}),
    cardIdRef = useRef(''),

    delayTimer = 250;

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
    cardDisplayRef.current = card;
    setImageOpen(true)
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false)
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setImageOpen(false)
    setDltPopupOpen(false)
  }

  function handleUpdateUser(form, setDisabled) {
    api.send('PATCH', api.me, form)
      .then(setCurrentUser)
      .catch(console.log)
      .finally(() => {
        closeAllPopups()
        setTimeout(setDisabled, delayTimer, true)
      })
  }

  function handleUpdateAvatar(form, setDelay) {
    api.send('PATCH', api.avatar, form, api.me)
      .then(setCurrentUser)
      .catch(console.error)
      .finally(() => {
        closeAllPopups()
        setDelay(delayTimer)
      })
  }

  async function handleCardLike(isLiked, cardId) {
    const
      getApiCards = await api.do(isLiked ? 'DELETE' : 'PUT', api.likes, cardId)
        .then(() => api.do('GET', api.cards))
        .catch(console.error),
      updatedCards = await Promise
        .all([
          Promise
            .resolve()
            .then(() => cards.findIndex(getTheCard)),
          Promise
            .resolve()
            .then(() => getApiCards.find(getTheCard)),
          ])
        .then(theCard => cards.with(...theCard));

    function getTheCard({ _id }) {
      return _id === cardId
    }

    setCards(updatedCards)
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

  function handleAddPlaceSubmit(form, setDelay) {
    api.send('POST', api.cards, form)
      .then(setCards)
      .catch(console.error)
      .finally(() => {
        closeAllPopups()
        setDelay(delayTimer)
      })
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
            {clickedCard: cardDisplayRef.current, isImageOpen, handleCardClick}
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