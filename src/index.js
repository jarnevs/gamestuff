import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  ApolloProvider,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client';

import reportWebVitals from './reportWebVitals';

const httpLink = new HttpLink({
  uri: 
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : 'https://gamestuff1.herokuapp.com/'
})

console.log(httpLink);

const authLink = new ApolloLink((operation, forward) => {
  let token = '';
  let tokenLocal = localStorage.getItem('token');

  if (tokenLocal !== null) {
    tokenLocal = JSON.parse(tokenLocal);
    token = tokenLocal.expires >= Date.now() ? tokenLocal.token : '';
  } else {
    token = '';
  }


  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    }
  })

  return forward(operation);
})

console.log(authLink);


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
