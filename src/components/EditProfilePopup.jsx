import { memo, useState, useRef, useContext, useEffect } from "react"
import PopupWithForm from "./PopupWithForm"
import { CurrentUserContext } from "../contexts/CurrentUserContext"

const EditProfilePopup = memo(({
  isOpen,
  onClose,
  onUpdate,
  onFieldChge
}) => {
  const
    [name, setName] = useState(''),
    [description, setDescription] = useState(''),
    [disabled, setDisabled] = useState(true),

    nameRef = useRef(null),
    aboutRef= useRef(null),

    {name: nameFromApi, about} = useContext(CurrentUserContext);

  useEffect(()=> {
    setName(nameFromApi ?? '')
    setDescription(about ?? '')
  }, [nameFromApi, about])

  function handleValidation(e) {
    onFieldChge(e, setDisabled)
  }

  function handleChange(e) {
    const input = e.target

    switch (input.name) {
      case 'name':
        setName(input.value)
        break
      case 'about':
        setDescription(input.value)
        break
      default:
      console.error('how do you arrive here?')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    onUpdate({
      name,
      about: description
    }, (delayTimer) => setTimeout(setDisabled, delayTimer, true))
    .handleUser()
  }

  return (
    <PopupWithForm
      title="Editar Perfil"
      name={'perfil'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isDisabled={disabled}
      onChange={handleValidation}
    >
      <input
        className="popup__item"
        type="text"
        id="profile-name"
        name="name"
        placeholder="Nombre"
        required
        value={name}
        minLength="2"
        maxLength="40"
        onChange={handleChange}
        ref={nameRef}
      />
      <span className="popup__item-error">
        {nameRef.current?.value && nameRef.current.validationMessage}
      </span>
      <input
        className="popup__item"
        type="text"
        id="about-me"
        name="about"
        placeholder="Acerca de mí"
        required
        value={description}
        minLength="2"
        maxLength="200"
        onChange={handleChange}
        ref={aboutRef}
      />
      <span className="popup__item-error">
        {aboutRef.current?.value && aboutRef.current.validationMessage}
      </span>
    </PopupWithForm>
  )
})

export default EditProfilePopup