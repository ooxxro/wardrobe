import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
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

import MyWardrobe from './components/MyWardrobe';
import ClothesIndex from './components/ClothesIndex';
import ClothesDetail from './components/ClothesDetail';
import AddClothes from './components/AddClothes';
import 'bootstrap/dist/css/bootstrap.min.css';
const myTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primary,
    },
    // secondary: '',
    // error: '',
    // warning: '',
    // info: '',
    // success: '',
  },
});

function App() {
  return (
    <ThemeProvider theme={myTheme}>
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

          <Route path="*" component={FourOhFour} />
        </Switch>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
