import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
export default class Login extends React.Component {
  static contextType = StoreContext;

  onLogin = () => {
    const { userStore } = this.context;
    const { history } = this.props;

    // this is fake login, should replace with firebase.auth
    userStore.currentUser = {
      displayName: 'Bucky Badger',
      email: 'bucky.badger@wisc.edu',
    };

    history.replace('/');
  };

  render() {
    return (
      <div>
        <h2>hi I'm login</h2>
        <form id="loginForm">
          <label for="email">Email: </label>
          <input type="text" id="email" name="email" placeholder="Email" />
          <br />
          <label for="password">Password: </label>
          <input type="password" id="password" name="password" placeholder="Password" />
          <br />
          <Button onClick={this.onLogin} type="primary">
            LOGIN
          </Button>
        </form>
      </div>
    );
  }
}
