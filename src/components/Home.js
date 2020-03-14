import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import HomeMain from './HomeMain';
import HomeWelcome from './HomeWelcome';

/**
 * This component detects if user is logged in.
 *
 * If logged in, render HomeMain
 * If not, render HomeWelcome
 */
@observer
export default class Home extends React.Component {
  static contextType = StoreContext;

  render() {
    const { userStore } = this.context;

    return userStore.isLoggedIn ? <HomeMain /> : <HomeWelcome />;
  }
}
