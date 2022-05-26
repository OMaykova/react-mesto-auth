import React, { useState } from 'react';

const Login = (props) => {
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

    props.handleLogin({ password: formValues.password, email: formValues.email })
      .catch(err => {
        console.log(err)
      });
  }
  return(
    <div className='sign'>
      <h3 className='sign__title'>Вход</h3>
      <form onSubmit={handleSubmit} className='sign__form' name='login' noValidate>
        <input value={formValues.email} onChange={handleChange} className="sign__input" type="email" name="email" placeholder="Email" required />
        <input value={formValues.password} onChange={handleChange} className="sign__input" type="text" name="password" placeholder="Пароль" required />
        <button className="sign__save-button" type="submit" title='Войти' aria-label='Кнопка Войти'>Войти</button>
      </form>
    </div>
  )
}
export default Login;