import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiTheme } from './theme';
import Layout from './components/Layout';
import FourOhFour from './components/FourOhFour';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Setting from './components/Setting';
import MyWardrobe from './components/MyWardrobe';
import ClothesIndex from './components/ClothesIndex';
import ClothesDetail from './components/ClothesDetail';
import AddClothes from './components/AddClothes';
import Design from './components/Design';
import Random from './components/Random';
import MyFavorites from './components/MyFavorites';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ThemeProvider theme={MuiTheme}>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/setting" exact component={Setting} />

          <Route path="/my-wardrobe" exact component={MyWardrobe} />
          <Route path="/my-wardrobe/:type" component={ClothesIndex} />

          <Route path="/add-clothes" exact component={AddClothes} />
          <Route path="/clothes-detail" exact component={ClothesDetail} />

          <Route path="/design" exact component={Design} />

          <Route path="/random" exact component={Random} />

          <Route path="/my-favorites" exact component={MyFavorites} />
          <Route path="*" component={FourOhFour} />
        </Switch>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
