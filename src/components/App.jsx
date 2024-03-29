import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './Header.js';
import Main from './Main.jsx';
import Footer from './Footer.js'
import api from '../utils/api.js';
import Context from './Context.jsx';
import useModal from '../customHook/useModal.js'

function App() {
  const
    [isPopupOpen, openPopup, closeAllPopups] = useModal(
      'avatar',
      'edit',
      'add',
      'image',
      'remove',
      'error',
    ),

    [currentUser, setCurrentUser] = useState({}),
    [cards, setCards] = useState([]),

    cardDisplayRef = useRef({}),
    cardIdRef = useRef(''),
    errRef = useRef(''),

    handleError = useCallback(function (err) {
      errRef.current = err.message
      openPopup('error')
    }, [openPopup]);

  useEffect(() => {
    api.do('GET', api.me)
      .then(setCurrentUser)
      .catch(handleError)

    api.do('GET', api.cards)
      .then(setCards)
      .catch(handleError)
  }, [handleError])

  useEffect(() => {
    const hasOpened = Object
      .values(isPopupOpen)
      .some(Boolean);

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
  }, [isPopupOpen, closeAllPopups])

  function openPopupCard(card) {
    if (typeof card === 'object') {
      cardDisplayRef.current = card
      openPopup('image')
    } else {
      cardIdRef.current = card
      openPopup('remove')
    }
  }

  function updateContent(setDelay) {
    function setFinally() {
      closeAllPopups()
      setDelay(250)
    }

    function handleAvatar(form) {
      api.send('PATCH', api.avatar, form, api.me)
        .then(setCurrentUser)
        .catch(handleError)
        .finally(setFinally)
    }

    function handleUser(form) {
      api.send('PATCH', api.me, form)
        .then(setCurrentUser)
        .catch(handleError)
        .finally(setFinally)
    }

    function handleAddSubmit(form) {
      api.send('POST', api.cards, form)
        .then(setCards)
        .catch(handleError)
        .finally(setFinally)
    }

    async function handleLike(isLiked, cardId) {
      const
        index = Promise
          .resolve()
          .then(() => cards.findIndex(getTheCard)),
        aCard = api.do(isLiked ? 'DELETE' : 'PUT', api.likes, cardId)
          .then(() => api.do('GET', api.cards))
          .then(cardsFromApi => cardsFromApi.find(getTheCard)),
        updatedCards = await Promise
          .all([index, aCard])
          .then(theCard => cards.with(...theCard))
          .catch(handleError);

      function getTheCard({ _id }) {
        return _id === cardId
      }

      setCards(updatedCards)
    }

    function handleDelete() {
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
        .catch(handleError)
        .finally(setFinally)
    }

    return {
      handleAvatar,
      handleUser,
      handleAddSubmit,
      handleLike,
      handleDelete,
    }
  }

  return (
    <div className="page">
      <Context
        currentUser={currentUser}
        isOpen={isPopupOpen}
        onClose={closeAllPopups}
      >
        <Header />
        <Main
          onOpenPopup={openPopup}
          clickedCard={cardDisplayRef.current}
          cards={cards}
          errMssg={errRef.current}
          openPopupCard={openPopupCard}
          onUpdate={updateContent}
        />
        <Footer />
      </Context>
    </div>
  );
}

export default App;