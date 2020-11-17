import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout';

import * as Routes from './routes';

import './App.scss';
import { GamesPage, GameDetailPage, RegisterPage, LoginPage, HomePage, CartPage, AdminPage } from './pages';

function App() {


  return (
    <div className="App">
      <Router basename={'/2021-werkstuk-react-app-pgmgent-jarnvans/'}>
        <Switch>
          <Route exact path={Routes.LANDING}>
            <Header />
            <main>
              <HomePage />
            </main>
            <Footer />
          </Route>
          <Route exact path={Routes.GAMES}>
            <Header />
            <main>
              <GamesPage />
            </main>
            <Footer />
          </Route>
          <Route exact path={Routes.GAME_DETAIL}>
            <Header />
            <main>
              <GameDetailPage />
            </main>
            <Footer />
          </Route>
          <Route exact path={Routes.REGISTER}>
            <Header />
              <main>
                <RegisterPage />
              </main>
            <Footer />
          </Route>
          <Route exact path={Routes.LOGIN}>
            <Header />
            <main>
              <LoginPage />
            </main>
            <Footer />
          </Route>
          <Route exact path={Routes.CART}>
            <Header />
              <main>
                <CartPage />
              </main>
            <Footer />
          </Route>
          <Route exact path={Routes.ADMIN}>
            <Header />
              <main>
                <AdminPage />
              </main>
            <Footer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
