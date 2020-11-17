import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';

import * as Routes from '../routes';

// import { FRAGMENT_USER_EMAIL } from './gqlFragments';

const REGISTER = gql`
  mutation register($email: String!, $password: String!) {
    register(user: { email: $email, password: $password }) {
      id
    }
  }
`

const RegisterPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { data }] = useMutation(REGISTER);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) console.log(data);
  }, [data]);

  if (data) return <Redirect to={Routes.LOGIN} />

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-8">
          <div className="register">
            <h2 className="page-title">Register</h2>
            { error ? <p>{error}</p> : ''}
            <form className="form"
              onSubmit={
                async (e) => {
                  e.preventDefault();
                  try {
                    await register({ variables: { email, password }});
                  } 
                  catch (err) {
                    setError(err.message);
                  }
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
                <button type="submit" className="form__button">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 

export default RegisterPage;