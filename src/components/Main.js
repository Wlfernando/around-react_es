import React from 'react';
import ImagePopup from './ImagePopup.jsx';
import Card from './Card.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.jsx';
import Profile from './Profile.jsx';
import DeletePopup from './DeletePopup.jsx';

const Main = React.memo((props)=> {
  const
    {isEditProfilePopupOpen, handleEditProfileClick} = props.onEditProfileClick,
    {isAddPlacePopupOpen, handleAddPlaceClick} = props.onAddPlaceClick,
    {isEditAvatarPopupOpen, handleEditAvatarClick} = props.onEditAvatarClick,
    {isDltPopupOpen, willCardDelete} = props.onDltClick,
    handleCardClick = props.onCardClick.handleCardClick,
    {onUpdateUser, onClose, onUpdateAvatar, cards, onCardLike, onCardDelete, onCardSubmit} = props;

  function handleValidation(e, setDisabled) {
    const
      field = e.currentTarget.elements,
      hasValid = Array(...field).every(input=>
        input.validity.valid
      )

    setDisabled(hasValid ? false : true)
  }

  return(
    <main className="content">
      <Profile
        onEditAvatarClick={handleEditAvatarClick}
        onEditProfileClick={handleEditProfileClick}
        onAddPlaceClick={handleAddPlaceClick}
      />
      <ul className="cards">
        {cards.map(card=>
          <Card
            key={card._id}
            data={card}
            onCardClick={handleCardClick}
            onCardLike={onCardLike}
            onDelete={willCardDelete}
          />
        )}
      </ul>
      <ImagePopup
        onOpen={props.onCardClick}
        onClose={onClose}
      />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={onClose}
        onUpdateUser={onUpdateUser}
        onFieldChge={handleValidation}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={onClose}
        onCardSubmit={onCardSubmit}
        onFieldChge={handleValidation}
      />
      <DeletePopup
        isOpen={isDltPopupOpen}
        onDelete={onCardDelete}
        onClose={onClose}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={onClose}
        onUpdateAvatar={onUpdateAvatar}
        onFieldChge={handleValidation}
      />
      <div className="popup">
        <div className="popup__container popup__error">
          <p className="popup__text-error"></p>
          <button
            type="button"
            className="button button__close button__close_place_form"
          ></button>
        </div>
      </div>
    </main>
  )
})

export default Main