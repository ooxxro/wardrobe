import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
export default class SignUp extends React.Component {
  static contextType = StoreContext;

  onSignup = () => {
    const { userStore } = this.context;
    const { history } = this.props;

    // this is fake signup, should replace with firebase.auth
    userStore.currentUser = {
      displayName: 'Bucky Badger',
      email: 'bucky.badger@wisc.edu',
    };

    history.replace('/');
  };

  render() {
    return (
      <div>
        <h2>hi I'm Signup</h2>
        <form id="signUpForm">
          <label for="email">Email: </label>
          <input type="text" id="email" name="email" placeholder="Email" />
          <br />
          <label for="displayname">Display Name: </label>
          <input type="text" id="displayname" name="displayname" placeholder="Display Name" />
          <br />
          <label for="password">Password: </label>
          <input type="password" id="password" name="password" placeholder="Password" />
          <br />
          <label for="verifypassword">Verify Password: </label>
          <input type="password" id="verifypassword" name="verifypassword" placeholder="Password" />
          <br />
          <Button onClick={this.onSignup} type="primary">
            SIGN UP
          </Button>
        </form>
      </div>
    );
  }
}
