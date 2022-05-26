import React, {useState, useEffect} from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import {api} from '../utils/api.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {CardsContext} from '../contexts/CardsContext';
import AddPlacePopup from './AddPlacePopup'
import ImageDeleteConfirmPopup from './ImageDeleteConfirmPopup'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import * as mestoAuth from '../mestoAuth'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    isImageOpen: false,
    link: '',
    name: '',
  });
  const [selectedDeleteCard, setSelectedDeletedCard] = useState({
    isImageOpen: false,
    card: {}
  });
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    avatar: '',
  });
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [tooltipStatus, setTooltipStatus] = useState(null)

  useEffect(() =>{
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([res, card]) => {
        setCurrentUser({
          name: res.name,
          about: res.about,
          avatar: res.avatar,
          _id: res._id
        })
        setCards(card)
      })
      .catch(console.log)
  }, [])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({
      isOpen: false,
      link: '',
      name: '',
    });
    setSelectedDeletedCard({      
      isImageOpen: false,
      card: {}
    });
    setTooltipStatus(null)
  }

  function handleCardClick(card) {
    setSelectedCard({ isOpen: true, link: card.link, name: card.name });
  }

  function handleUpdateUser({name, about}) {
    setIsLoading(true)
    api.editProfile(name, about)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setIsLoading(false))
  }
  
  function handleUpdateAvatar(avatar) {
    setIsLoading(true)
    api.changeAvatar(avatar)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setIsLoading(false))
  }
    
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    const request = isLiked ?
      api.removeLike(card._id) : api.setLike(card._id);
    request.then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch(console.log)
  }

  function handleCardDelete(card) {
    setSelectedDeletedCard({ isOpen: true, card: card });
  }

  function ImageDeleteConfirmSubmit(card) {
    setIsLoading(true)
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id))
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setIsLoading(false))
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true)
    api.addUserCard(data)
      .then((newCard) => {setCards([newCard, ...cards])
      closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setIsLoading(false))
  }
  function handleLogin({password, email}) {
    return mestoAuth.authorize(password, email)
    .then((data) => {
      if (data) {
        localStorage.setItem('jwt', data.token);

        tokenCheck();
      } else {
        setTooltipStatus('fail')
      }
    })
  }
  function handleRegister({password, email}) {
    return mestoAuth.register(password, email)
    .then((res) => {
      if(res) {
        setTooltipStatus('success')
        setTimeout(() => {history.push('/signin')}, 3000);
        } else {
          setTooltipStatus('fail')}
      setTimeout(() => {closeAllPopups()}, 3000)
    });
  }
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail(null);
    history.push('/signup');
  }

  function tokenCheck() {
    if (localStorage.getItem('jwt')){
      let jwt = localStorage.getItem('jwt');
      mestoAuth.getContent(jwt)
      .then((res) => {
        if (res){
          console.log(res)
          let userData = res.data.email
          setLoggedIn(true);
          setEmail(userData);
        }
      });
    }
  }
  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
      if (loggedIn) {
          history.push("/");
      }
  }, [loggedIn]);
  return (
    <CurrentUserContext.Provider value ={currentUser}>
      <CardsContext.Provider value = {cards}>
        <div className="page">
          <Switch>
            <Route exact path='/signup'>
              <Header location = {'register'} />
            </Route>
            <Route exact path='/signin'>
              <Header location = {'login'} />
            </Route>
          </Switch>
          
          <Switch>
            <ProtectedRoute exact path='/' loggedIn={loggedIn}>
              <Header location = {'main'} email={email} handleSignOut={handleSignOut}/>
              <Main 
              onEditProfile={handleEditProfileClick} 
              onAddPlace={handleAddPlaceClick} 
              onEditAvatar={handleEditAvatarClick} 
              onCardClick={handleCardClick} 
              cards={cards} 
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <Footer />
            <EditProfilePopup 
              currentUser={currentUser}
              isOpen={isEditProfilePopupOpen} 
              onClose={closeAllPopups} 
              onUpdateUser={handleUpdateUser}
              isLoading={isLoading}
            />
            <AddPlacePopup 
              isOpen={isAddPlacePopupOpen} 
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
              isLoading={isLoading}
            />
            <ImageDeleteConfirmPopup 
              isOpen={selectedDeleteCard.isOpen}
              onClose={closeAllPopups}
              isLoading={isLoading}
              onConfirm={ImageDeleteConfirmSubmit}
              card={selectedDeleteCard.card} 
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen} 
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              isLoading={isLoading}
              currentUser={currentUser}
            />
            <ImagePopup 
              onClose={closeAllPopups} 
              name={selectedCard.name} 
              link={selectedCard.link} 
              isOpen={selectedCard.isOpen}/>
            </ProtectedRoute>
            <Route exact path='/signup'>
              <Register 
                handleRegister={handleRegister} />
              <InfoTooltip 
                tooltipStatus={tooltipStatus}
                onClose={closeAllPopups} 
                name={'infoTooltip'}
              />
            </Route>
            <Route exact path='/signin'>
              <Login handleLogin={handleLogin} />
              <InfoTooltip 
                tooltipStatus={tooltipStatus}
                onClose={closeAllPopups} 
                name={'infoTooltip'}
              />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
            {/* <Route exact path='*'>
              <PageNotFound/>
            </Route> */}
          </Switch>
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;