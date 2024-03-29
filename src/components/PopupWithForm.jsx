import React from "react";
import { CloseContext } from "../contexts/CloseContext";

const PopupWithForm = React.memo(({
  isOpen,
  name,
  title,
  children,
  textBtn,
  onSubmit,
  setDisabled,
  isDisabled,
}) => {
  const
    btnRef = React.useRef(null),

    handleClose = React.useContext(CloseContext),

    btnOff = isDisabled ? ' button_inactive' : '';

  function handleValidation(e) {
    const
    field = e.currentTarget.elements,
    hasValid = Array(...field).every(input =>
      input.validity.valid
    )

  setDisabled(hasValid ? false : true)
  }

  function handleSubmit(e) {
    const btn = btnRef.current

    e.preventDefault()
    btn.textContent = 'Guardando...'
    onSubmit(() => btn.textContent = textBtn)
  }

  return (
    <div className={'popup' + (isOpen ? ' popup_active' : '')}>
      <form
        className={`popup__container popup__container_type_${name}`}
        name={name}
        noValidate
        onSubmit={handleSubmit}
      >
        <fieldset
          className="popup__content"
          onChange={handleValidation}
        >
          <h3 className="popup__title">{title}</h3>
          {children}
          <button
            type="submit"
            className={"button button__submit" + btnOff}
            name="saveBtn"
            disabled={isDisabled}
            ref={btnRef}
          >
            {textBtn ??= 'Guardar'}
          </button>
        </fieldset>
        <button
          type="button"
          className="button button__close button__close_place_form"
          onClick={handleClose}
        ></button>
      </form>
    </div>
  )
})

export default PopupWithForm