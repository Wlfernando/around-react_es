import {useContext, memo} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

const Card = memo(({
  data,
  onCardClick,
  onCardLike,
  onDelete
})=> {

  const
    {_id: ID} = useContext(CurrentUserContext),

    {name, likes, link, owner} = data,

    hasDustbin = owner._id === ID,
    isLiked = likes.some(like=> like._id === ID)

  function handleClick() {
    onCardClick({name, link})
  }

  function handleLikeClick() {
    onCardLike(data)
  }

  function handleDelete() {
    onDelete(data)
  }

  return(
    <li className="card">
      <img onClick={handleClick} className="card__image" src={link} alt={name} />
      {hasDustbin && <button onClick={handleDelete} className="button card__trash-button" />}
      <h2 className="card__place-name">{name}</h2>
      <div className="card__likes">
        <button onClick={handleLikeClick} className={'button card__like-button ' + (isLiked && 'card__like-button_active')} />
        <p className="card__likes-count">{likes.length || undefined}</p>
      </div>
    </li>
  )
})

export default Card