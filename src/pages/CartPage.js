import React, { useState, useEffect } from 'react';

const CartPage = (props) => {
  const [cart, setCart] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0.00);
  const [update, setUpdate] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    let cartLocal = localStorage.getItem('cart');

    if (cartLocal !== null) {
      cartLocal = JSON.parse(cartLocal);
    } else {
      cartLocal = [];
    }

    let grandTotal = 0;

    cartLocal.forEach(game => {
      grandTotal += parseFloat((game.amount * game.product.price).toFixed(2));
    });

    setCart(cartLocal);
    setFinalTotal(grandTotal.toFixed(2));
    setUpdate(false);
  }, [update])

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2>Cart</h2>
          {
            cart && cart.length > 0 ? 
            <div className="cart-items">
            <div className="item">
              <div className="item__image">
                <p>Image</p>
              </div>
              <div className="item__name">
                <p>Name</p>
              </div>
              <div className="item__price">
                <p>Price</p>
              </div>
              <div className="item__amount">
                <p>Amount</p>
              </div>
              <div className="item__total">
                <p>Total</p>
              </div>
              <div className="item__delete">
                
              </div>
            </div>
          {
            cart && cart.map(game => (
              <div key={game.product.id} className="item">
                <div className="item__image">
                <img src={game.product.image} alt={game.product.name} />
                </div>
                <div className="item__name">
                  <h3>{game.product.name}</h3>
                </div>
                <div className="item__price">
                  <p>€ {game.product.price}</p>
                </div>
                <div className="item__amount">
                  <p>{game.amount}</p>
                </div>
                <div className="item__total">
                  <p>€ {(game.product.price * game.amount).toFixed(2)}</p>
                </div>
                <div className="item__delete">
                  <button id={game.product.id} className="form__button form__button--delete" 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(e.target);
                      const id = e.target.id || e.target.parentNode.id;
                      console.log('doing it')
                      const restItems = cart.filter((item) => item.product.id !== id);
                      
                      let grandTotal = 0;

                      restItems.forEach(game => {
                        grandTotal += parseFloat((game.amount * game.product.price).toFixed(2));
                      });

                      setCart(restItems);
                      setFinalTotal(grandTotal.toFixed(2));
                      if (restItems.length > 0) {
                        localStorage.setItem('cart', JSON.stringify(restItems));
                      } else {
                        localStorage.removeItem('cart');
                      }
                      setUpdate(true);
                    }}
                  ><i className="fas fa-trash"></i></button>
                </div>
              </div>
            ))
          }
            <div className="item item__grandtotal">
              <div className="item__total">
                <p>€ {finalTotal}</p>
                <button className="form__button" 
                  onClick={(e) => {
                    e.preventDefault();
                    setPopUp(true);
                    setTimeout(() => {
                      setPopUp(false);
                      localStorage.removeItem('cart');
                      setCart([]);
                      setEnd(true);
                    }, 5000)
                  }}
                >Checkout</button>
              </div>
            </div>
          </div> : end ? <p className="no-cart">Thank you for your order</p> : <p className="no-cart">Did you put a game in here?</p>
          }
          {
            popUp ? 
              <div className="pop-up">
                <div className="pop-up__back"></div>
                <div className="pop-up__content">
                  <p><i className="fas fa-spinner"></i>Processing your order</p>
                </div>
              </div> : ''
          }
        </div>
      </div>
    </div>
  )
} 

export default CartPage;