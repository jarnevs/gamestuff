import React, { useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';

import * as Routes from '../../routes';

const Header = () => {
  const [token, setToken] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    let tokenLocal = localStorage.getItem('token');

    console.log(tokenLocal);

    if (tokenLocal === null) {
      setToken('');
    } else {
      tokenLocal = JSON.parse(tokenLocal);
      tokenLocal.expires >= Date.now() ? setToken(tokenLocal.token) : setToken('');
    }
  }, []);  
  
  return (
    <header className="header">
      <nav className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <h1>GAMESTUFF</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12 main-nav">
            <ul className="main-nav__list d-flex justify-content-center">
              <li className="main-nav__item"><NavLink className="main-nav__link" activeClassName="main-nav__link--active" to={Routes.LANDING}>Home</NavLink></li>
              <li className="main-nav__item"><NavLink className="main-nav__link" activeClassName="main-nav__link--active" to={Routes.GAMES}>Games</NavLink></li>
              { !token ? 
                (
                  <>
                    <li className="main-nav__item"><NavLink className="main-nav__link" activeClassName="main-nav__link--active" to={Routes.REGISTER}>Register</NavLink></li>
                    <li className="main-nav__item"><NavLink className="main-nav__link" activeClassName="main-nav__link--active" to={Routes.LOGIN}>Login</NavLink></li>
                  </>
                ) :
                (
                  <>
                    <li className="main-nav__item"><NavLink className="main-nav__link" activeClassName="main-nav__link--active" to={Routes.ADMIN}>Admin</NavLink></li>
                    <li className="main-nav__item"><button className="main-nav__link"
                      onClick={
                        () => {
                          localStorage.removeItem('token');
                          setRedirect(true);
                        }
                      }
                    >Logout</button></li>
                  </>
                )
              }
              
              <li className="main-nav__item"><NavLink className="main-nav__link" activeClassName="main-nav__link--active" to={Routes.CART}><i className="fas fa-shopping-cart"></i> Cart</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>
      {redirect ? <Redirect to={Routes.LOGIN} /> : ''}
    </header>
  )
} 

export default Header;