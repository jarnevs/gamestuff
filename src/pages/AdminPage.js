import React, { useState } from 'react';
import { useError } from '../Hooks';
import { gql, useQuery, useMutation } from '@apollo/client';
import * as Routes from '../routes';

const GAMES = gql`
  {
    games {
      id
      name
      description
      price
      image
      platform
      categories {
        id
      }
    }
  }
`

const CATEGORIES = gql`
  {
    categories {
      id
      name
    }
  }
`


const DELETE_GAME = gql`
  mutation deleteGame($id: ID!) {
    deleteGame(gameId: $id) {
      id
    }
  }
`

const ADD_GAME = gql`
  mutation addGame($name: String!, $description: String, $price: Float, $platform: Platform, $image: String, $categories: [CategoryIdInput]) {
      addGame(game:{
        name: $name,
        description: $description,
        price: $price,
        platform: $platform,
        image: $image
        categories: $categories
      }) {
        id,
    }
  }
`

const UPDATE_GAME = gql`
  mutation updateGame($name: String!, $description: String, $price: Float, $platform: Platform, $image: String, $categories: [CategoryIdInput], $gameId: ID) {
      updateGame(game:{
        name: $name,
        description: $description,
        price: $price,
        platform: $platform,
        image: $image
        categories: $categories
      }, gameId: $gameId) {
        id,
    }
  }
`

const DELETE_CATEGORY = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(categoryId: $id) {
      id
    }
  }
`

const ADD_CATEGORY = gql`
  mutation addCategory($name: String!) {
    addCategory(category: {name: $name}) {
      id
    }
  }
`

const UPDATE_CATEGORY = gql`
  mutation addCategory($name: String!, $categoryId: ID!) {
    updateCategory(category:{name: $name}, categoryId: $categoryId) {
      id
    }
  }
`

const AdminPage = (props) => {
  const [handleGqlError] = useError();
  const [newCategory, setNewCategory] = useState('');
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categories: [{id: ''}],
    platform: 'PlayStation',
  });
  const [categoryId, setCategoryId] = useState('');
  const [gameId, setGameId] = useState('');
  const [popUpCategory, setPopUpCategory] = useState(false);
  const [popUpGame, setPopUpGame] = useState(false);

  const gamesData = useQuery(GAMES, {
    onError: handleGqlError,
    fetchPolicy: "cache-first", // https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    notifyOnNetworkStatusChange: true,
    // pollInterval: 500,
  });

  const categoriesData = useQuery(CATEGORIES, {
    onError: handleGqlError,
    fetchPolicy: "cache-first", // https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    notifyOnNetworkStatusChange: true,
    // pollInterv0al: 500,
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [addCategory] = useMutation(ADD_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteGame] = useMutation(DELETE_GAME);
  const [addGame] = useMutation(ADD_GAME);
  const [updateGame] = useMutation(UPDATE_GAME);

  if (gamesData.loading) return 'loading...';
  if (gamesData.error) return `ERROR: ${gamesData.error.message}`;

  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <h2>Games</h2>
          <div className="form__group">
            <button className="form__button" onClick={
              () => {
                setPopUpGame(true);
              }
            }>Add new game</button>
          </div>
          <div className="cards">
          {
            gamesData.data && gamesData.data.games.map(game => (
              <div key={game.id} to={Routes.GAME_DETAIL.replace(':id', game.id)} className="card admin">
                <div className="admin__buttons">
                  <button className="form__button form__button--lessmargin form__button--grey"
                    onClick={
                      () => {
                        setGameId(game.id);
                        const {name, description, image, price, categories, platform } = game;
                        setNewGame({name, description, image, price, categories, platform});
                        setPopUpGame(true);
                      }
                    }
                  ><i className="fas fa-pen"></i></button>
                  <button className="form__button form__button--lessmargin"
                    onClick={
                      async (e) => {
                        try {
                          await deleteGame({variables: {id: game.id}});
                          gamesData.refetch();
                        } catch (e) {
                          console.log(e.message);
                        }
                      }
                    }
                  ><i className="fas fa-trash"></i></button>
                </div>
                <div className="card__image">
                  <img src={game.image} alt={game.name} />
                </div>
                <div className="card__content">
                  <h2 className="card__title">{game.name}</h2>
                  <p className="card__platform">{game.platform}</p>
                  <p className="card__price">€ {game.price}</p>
                </div>  
              </div>
            ))
          }
          </div>
        </div>
        <div className="col-4">
          <h2>Categories</h2>
          <form className="form"
            onSubmit={
              async (e) => {
                e.preventDefault();
                try {
                  await addCategory({variables: {name: newCategory}});
                  categoriesData.refetch();
                  setNewCategory('');
                } catch (e) {
                  console.log(e.message)
                }
              }
            }
          >
            <div className="form__group">
              <label className="form__label">New category</label>
              <input type="text" className="form__input" placeholder="name" onChange={(e) => setNewCategory(e.target.value)} value={newCategory}/>
            </div>
            <div className="form__group">
              <button type="submit" className="form__button form__button--lessmargin">Create</button>
            </div>
          </form>
          <div className="categories-list">
          {
            categoriesData.data && categoriesData.data.categories.map(category => (
              <div key={category.id} className="categories-list__item">
                <p>{category.name}</p>
                <div className="categories-list__buttons">
                  <button className="form__button form__button--grey"
                    onClick={(e) => {
                      setCategoryId(category.id);
                      setNewCategory(category.name);
                      setPopUpCategory(true);
                    }}
                  ><i className="fas fa-pen"></i></button>
                  <button className="form__button" 
                    onClick={async () => {
                      try {
                        await deleteCategory({variables: {id: category.id}});
                        categoriesData.refetch();
                      } catch (e) {
                        console.log(e.message);
                      }
                    }}
                  ><i className="fas fa-trash"></i></button>
                </div>
              </div>
            ))
          }
          </div>
          {
            popUpCategory ? 
              <div className="pop-up">
                <div className="pop-up__back"></div>
                <div className="pop-up__content pop-op__content--admin">
                  <form className="form"
                    onSubmit={
                      async (e) => {
                        e.preventDefault();
                        try {
                          await updateCategory({variables: {name: newCategory, categoryId }});
                          categoriesData.refetch();
                          setNewCategory('');
                          setPopUpCategory(false);
                        } catch (e) {
                          console.log(e.message)
                        }
                      }
                    }
                  >
                    <div className="form__group">
                      <label className="form__label">New category</label>
                      <input type="text" className="form__input" placeholder="name" onChange={(e) => setNewCategory(e.target.value)} value={newCategory}/>
                    </div>
                    <div className="form__group">
                      <button type="submit" className="form__button form__button--lessmargin">Update</button>
                    </div>
                    <div className="form__group">
                      <button className="form__button form__button--lessmargin form__button--grey"
                        onClick={() => {
                            setNewCategory('');
                            setPopUpCategory(false);
                          }
                        }
                      >Cancel</button>
                    </div>
                  </form>
                </div>
              </div> : ''
          }
          {
            popUpGame ? 
              <div className="pop-up">
                <div className="pop-up__back"></div>
                <div className="pop-up__content pop-op__content--admin">
                  <form className="form"
                    onSubmit={
                      async (e) => {
                        e.preventDefault();
                        try {
                          if (gameId === '') {
                            await addGame({variables: {...newGame, price: parseFloat(newGame.price)}});
                          } else {
                            await updateGame({variables: {...newGame, price: parseFloat(newGame.price), gameId}});
                          }
                          await gamesData.refetch();
                          setNewGame({
                            name: '',
                            description: '',
                            price: '',
                            image: '',
                            categories: [],
                            platform: '',
                          });
                          setPopUpGame(false);
                        } catch (e) {
                          console.log(e.message)
                        }
                      }
                    }
                  >
                    <div className="form__group">
                      <label className="form__label">Name</label>
                      <input type="text" className="form__input" placeholder="name" 
                      onChange={(e) => {
                        // newGame.name = e.target.value; 
                        setNewGame({...newGame, name: e.target.value});
                        console.log(newGame);
                      }} value={newGame.name}/>
                    </div>
                    <div className="form__group">
                      <label className="form__label">Description</label>
                      <textarea className="form__input" placeholder="description" 
                      onChange={(e) => {
                        setNewGame({...newGame, description: e.target.value});
                        console.log(newGame);
                      }} value={newGame.description}/>
                    </div>
                    <div className="form__group">
                      <label className="form__label">Price</label>
                      <input type="text" className="form__input" placeholder="price" 
                      onChange={(e) => {
                        setNewGame({...newGame, price: e.target.value});
                      }} value={newGame.price}/>
                    </div>
                    <div className="form__group">
                      <label className="form__label">Image</label>
                      <input type="text" className="form__input" placeholder="image" 
                      onChange={(e) => {
                        setNewGame({...newGame, image: e.target.value});
                      }} value={newGame.image}/>
                    </div>
                    <div className="form__group">
                      <label className="form__label">Categories</label>
                      <select multiple className="form__input" onChange={(e) => {
                        let options = [...e.target.selectedOptions];
                        options = options.map((option) => {
                          return {id: option.value};
                        });

                        setNewGame({...newGame, categories: options});
                      }}>
                        { !categoriesData.loading && categoriesData.data.categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                      </select>
                    </div>
                    <div className="form__group">
                      <label className="form__label">Platform</label>
                      <select className="form__input" onChange={(e) => {
                        setNewGame({...newGame, platform: e.target.value});
                      }}>
                        <option value="PlayStation">PlayStation</option>
                        <option value="Xbox">Xbox</option>
                        <option value="PC">PC</option>
                      </select>
                    </div>
                    <div className="form__group">
                      <button type="submit" className="form__button form__button--lessmargin">Update</button>
                    </div>
                    <div className="form__group">
                      <button className="form__button form__button--lessmargin form__button--grey"
                        onClick={() => {
                            setNewCategory('');
                            setPopUpGame(false);
                          }
                        }
                      >Cancel</button>
                    </div>
                  </form>
                </div>
              </div> : ''
          }
        </div>
      </div>
    </div>
  )
} 

export default AdminPage;