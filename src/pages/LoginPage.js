import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import * as Routes from '../routes';

// import { FRAGMENT_USER_EMAIL } from './gqlFragments';

const LOGIN = gql`
  query ($email: String!, $password: String!) { 
    login(user: { email: $email, password: $password }) {
      userId,
      token
    }
  }
`

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState('');
  const [login, { data, error }] = useLazyQuery(LOGIN);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => { 
    if (error) {
      setError(error.message);
    } else if (data) {
      console.log(data);
      localStorage.setItem('token', JSON.stringify({
        token: data.login.token,
        expires: Date.now() + 3600000
      }));

      setRedirect(true);
    }
  }, [data, error]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-8">
          <div className="register">
            <h2 className="page-title">Login</h2>
            { err ? <p>{err}</p> : ''}
            <form className="form"
              onSubmit={
                async (e) => {
                  e.preventDefault();
                  await login({ variables: { email, password }});
                }
              }
            >
              <div className="form__group">
                <label className="form__label">Email</label>
                <input type="email" className="form__input" placeholder="Email" onChange={ e => setEmail(e.target.value)}/> 
              </div>
              <div className="form__group">
                <label className="form__label">Password</label>
                <input type="password" className="form__input" placeholder="Password" onChange={ e => setPassword(e.target.value)}/> 
              </div>
              <div className="form__group">
                <button type="submit" className="form__button">Login</button>
              </div>
            </form>
          </div>
        </div>
        {redirect ? <Redirect to={Routes.ADMIN} /> : ''}
      </div>
    </div>
  )
} 

export default LoginPage;