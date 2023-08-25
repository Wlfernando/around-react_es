export default function PopupWithForm({isOpen, name, title, children, btn, onClose}) {
  return (
    <div className={'popup ' + (isOpen && 'popup_active')}>
      <form
        className={`popup__container popup__container_type_${name}`}
        name={name}
        noValidate
      >
        <fieldset className="popup__content">
          <h3 className="popup__title">{title}</h3>
          {children}
          <button
            type="submit"
            className="button button__submit"
            name="saveBtn"
          >
            {btn ?? 'Guardar'}
            <div className="button__submit_processing">Guardando...</div>
          </button>
        </fieldset>
        <button
          type="button"
          className="button button__close button__close_place_form"
          onClick={onClose}
        ></button>
      </form>
    </div>
  )
}