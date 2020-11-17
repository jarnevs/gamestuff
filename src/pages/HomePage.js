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
      createdOn
    }
  }
`

const HomePage = (props) => {
  const [handleGqlError] = useError();
  const [recent, setRecent] = useState([]);
  const [sale, setSale] = useState([]);
  const { loading, error, data, networkStatus } = useQuery(GAMES, {
    onError: handleGqlError,
    fetchPolicy: "cache-first", // https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    notifyOnNetworkStatusChange: true,
    // pollInterval: 500,
  })

  useEffect(() => {
    const sortGames = () => {
      console.log(data.games);
  
      let gamesData = [...data.games];
  
      gamesData.sort(
        (a, b) => {
          if (a.createdOn > b.createdOn) {
            return -1;
          }
  
          if (a.createdOn < b.createdOn) {
            return 1;
          }
  
          return 0;
        }
      );
      
      setRecent(gamesData.slice(0, 3));
    }
  
    const randomGames = () => {
      const randomGames = [];
      let prevIndex = '';
   
      while(randomGames.length < 3) {
        let randomIndex = Math.floor(Math.random() * data.games.length);
  
        if (prevIndex !== '') {
          if (randomIndex === prevIndex) {
            randomIndex += 1;
  
            if (randomIndex >= data.games.length) {
              randomIndex = 0;
            }
          }
        }
  
        randomGames.push(data.games[randomIndex]);
        prevIndex = randomIndex;
      }
  
      setSale(randomGames);
    }

    if (data) {
      sortGames();
      randomGames();
    }
  }, [data])

  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if(loading) return 'loading...';
  if(error) return `ERROR: ${error.message}`;

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2>Recently added</h2>
          <div className="cards">
          {
            recent && recent.map(game => (
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
      <div className="row">
        <div className="col-12">
          <h2>Sales</h2>
          <div className="cards">
          {
            sale && sale.map(game => (
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

export default HomePage;