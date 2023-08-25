import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js'
import React from 'react';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false),
  [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false),
  [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false),
  [isImageOpen, setImageOpen] = React.useState(false),
  [selectedCard, setSelectedCard] = React.useState({});

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
  }

  function handleListenerClose(e) {
    if(['popup_active', 'popup__image-container'].some(click=> e.target.classList.contains(click)
    || e.key === 'Escape')) closeAllPopups()
}

React.useEffect(()=> {
    if([
      isEditProfilePopupOpen,
      isEditAvatarPopupOpen,
      isAddPlacePopupOpen,
      isImageOpen
      ].some(change=> change === true)) {
      document.addEventListener('click', handleListenerClose)
      document.addEventListener('keydown', handleListenerClose)
    }

    return ()=> {
      document.removeEventListener('keydown', handleListenerClose)
      document.removeEventListener('click', handleListenerClose)
    }
    // eslint-disable-next-line
  }, [
    isEditProfilePopupOpen,
    isEditAvatarPopupOpen,
    isAddPlacePopupOpen,
    isImageOpen
  ])

  return (
    <div className="page">
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
        onClose={closeAllPopups} />
      <Footer />
    </div>
  );
}

export default App;