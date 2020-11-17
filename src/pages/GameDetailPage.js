import React, { useEffect, useState } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useError } from '../Hooks';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

// import { FRAGMENT_USER_EMAIL } from './gqlFragments';

const GAMES = gql`
  query game($id: ID) {
    game(id: $id) {
      id
      name
      price
      platform
      image
      description
    }
  }
`

const GamesPage = (props) => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [added, setAdded] = useState(false);
  const [amount, setAmount] = useState(1);
  const [handleGqlError] = useError();
  const { id } = useParams();
  const {  loading, error, data, networkStatus } = useQuery(GAMES, {
    onError: handleGqlError,
    fetchPolicy: "cache-first", // https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    notifyOnNetworkStatusChange: true,
    // pollInterval: 500,
    variables: {
      id
    }
  })

  useEffect(() => {
    if (data) {
      let cart = localStorage.getItem('cart');
      console.log(cart);

      if (cart !== null) {
        cart = JSON.parse(cart);
      } else {  
        cart = [];
      }

      console.log(cart);

      const cartItem = cart.find((item) => item.product.id === data.game.id);

      console.log(cartItem);

      if (cartItem) {
        setAdded(true);
      }
      
      setShoppingCart(cart);
    }
  }, [added, data]);

  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if(loading) return 'loading...';
  if(error) return `ERROR: ${error.message}`;

  return (
    <div className="container">
      <div className="row detail">
        <div className="col-7">
          <div className="detail__image">
            <img src={data.game.image} alt={data.game.name} />
          </div>
          <div className="detail__description">
            <h3>Description</h3>
            <p>{data.game.description}</p>
          </div>
        </div>
        <div className="col-5">
          <div className="detail">
            <div className="detail__content">
              <h2 className="detail__title">{data.game.name}</h2>
              <p className="detail__platform">{data.game.platform}</p>
              <p className="detail__price">€ {data.game.price}</p>
              <form className="detail-form">
                <div className="form__group">
                  <label className="form__label">Amount</label>
                  <select className="form__input" onChange={(e) => setAmount(parseInt(e.target.value))}>
                    <option disabled value="">Amount</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
                {
                  !added ? <button className="form__button" 
                  onClick={(e) => {
                    e.preventDefault();
                    shoppingCart.push({
                      product: {
                        id: data.game.id,
                        name: data.game.name,
                        price: data.game.price,
                        image: data.game.image
                      },
                      amount
                    });

                    localStorage.setItem('cart', JSON.stringify(shoppingCart));
                    setAdded(true);
                    setShoppingCart(shoppingCart);
                  }}
                >Add to cart</button> : <button disabled className="form__button form__button--disabled">Already added</button>
                }
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

export default GamesPage;