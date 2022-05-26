import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Register = (props) => {
  const [formValues, setFormValues] = useState({email:'', password:''})

  function handleChange(e) {
    const {name, value} = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  function handleSubmit(e) {
    e.preventDefault(e);
    if (!formValues.email || !formValues.password){
      return;
    }
    props.handleRegister({ password: formValues.password, email: formValues.email })
      .catch((err) => {
        console.log(err)
      });
  }
  return(
    <div className='sign'>
      <h3 className='sign__title'>Регистрация</h3>
      <form onSubmit={handleSubmit} className='sign__form' name='register' noValidate>
        <input value={formValues.email} onChange={handleChange} className="sign__input" type="email" name="email" placeholder="Email" required />
        <input value={formValues.password} onChange={handleChange} className="sign__input" type="text" name="password" placeholder="Пароль" required />
        <button className="sign__save-button" type="submit" title='Зарегистрироваться' aria-label='Кнопка Зарегистрироваться'>Зарегистрироваться</button>
      </form>
      <div className="register__signin">
          <p>Уже зарегистрированы?</p>
          <Link to="/signin" className="sign__login-link">Войти</Link>
        </div>
    </div>
  )
}
export default Register;