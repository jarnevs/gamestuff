import React, { useState, useEffect } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useError } from '../Hooks';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import * as Routes from '../routes';

// import { FRAGMENT_USER_EMAIL } from './gqlFragments';

const GAMES = gql`
  {
    games {
      id
      name
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

const GamesPage = (props) => {
  const [handleGqlError] = useError();
  const [filteredGames, setFilteredGames] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

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
    // pollInterval: 500,
  });

  useEffect(() => {
    if (gamesData.data) {
      setFilteredGames(gamesData.data.games);
    }
  }, [gamesData.data])

  if (gamesData.networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (gamesData.loading) return 'loading...';
  if (gamesData.error) return `ERROR: ${gamesData.error.message}`;

  const filter = (platformFilter, categoryFilter) => {
    let games = [];

    if (platformFilter === 'all') {
      games = gamesData.data.games;
    } else {
      games = gamesData.data.games.filter(game => game.platform === platformFilter);
    }

    if (categoryFilter === 'all') {
      setFilteredGames(games);
    } else {
      games = games.filter(game => game.categories.some(category => category.id === categoryFilter));
      setFilteredGames(games);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-3">
          <h2>Filter</h2>
          <form className="form">
            <div className="form__group">
              <label className="form__label">Category</label>
              <select className="form__input" onChange={(e) => {
                filter(platformFilter, e.target.value);
                setCategoryFilter(e.target.value);
              }}>
                <option value="all">All</option>
                { !categoriesData.loading && categoriesData.data.categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
              </select>
            </div>
            <div className="form__group">
              <label className="form__label">Platform</label>
              <select className="form__input" onChange={(e) => {
                filter(e.target.value, categoryFilter);
                setPlatformFilter(e.target.value);
              }}>
                <option value="all">All</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="PC">PC</option>
              </select>
            </div>
          </form>
        </div>
        <div className="col-9">
          <div className="cards">
          {
            !!filteredGames && filteredGames.map(game => (
              <Link key={game.id} to={Routes.GAME_DETAIL.replace(':id', game.id)} className="card">
                <div className="card__image">
                  <img src={game.image} alt={game.name} />
                </div>
                <div className="card__content">
                  <h2 className="card__title">{game.name}</h2>
                  <p className="card__platform">{game.platform}</p>
                  <p className="card__price">€ {game.price}</p>
                </div>  
              </Link>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  )
} 

export default GamesPage;