import React from 'react';
import headerLogo from '../images/logoMesto.svg';
import { Link } from "react-router-dom";

function Header({location, handleSignOut, email}) {
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип сайта с названием Место Россия" />
      {location === 'register' &&
        <Link to="/signin" className='header__link'>Войти</Link>}
      {location === 'login' &&
        <Link to = '/signup' className='header__link'>Регистрация</Link>}
      {location === 'main' &&
        <ul className='header__link-container'>
          <li><Link to = '/' className='header__link'>{email}</Link></li>
          <li><button onClick={handleSignOut} className='header__link header__button'>Выйти</button></li>
        </ul>}
    </header>
  );
}

export default Header;