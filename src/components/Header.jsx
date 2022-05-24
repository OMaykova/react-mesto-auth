import React from 'react';
import headerLogo from '../images/logoMesto.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип сайта с названием Место Россия" />
    </header>
  );
}

export default Header;