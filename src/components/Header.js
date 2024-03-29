import React from 'react';
import logo from '../images/Logo/Vector.svg';

const Header = React.memo(()=> {
  return (
    <header className="header">
      <h1 className="header__title">Around the U.S.</h1>
      <img
        src={logo}
        alt="Logo"
        className="header__logo"
      />
      <hr className="header__horizontal" />
    </header>
  )
})

export default Header