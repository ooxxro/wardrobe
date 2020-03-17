import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
export default class SignUp extends React.Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', verifypassword: '', displayname: '' };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleVerifyPasswordChange = this.handleVerifyPasswordChange.bind(this);
    this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this);
  }

  onSignup = () => {
    const { userStore } = this.context;
    const { history } = this.props;

    /*alert(
      'Email: ' +
        this.state.email +
        '\n' +
        'Password: ' +
        this.state.password +
        '\n' +
        'Verify Password: ' +
        this.state.verifypassword +
        '\n' +
        'Display Name: ' +
        this.state.displayname
    );*/

    // this is fake signup, should replace with firebase.auth
    userStore.currentUser = {
      displayName: 'Bucky Badger',
      email: 'bucky.badger@wisc.edu',
    };

    history.replace('/');
  };

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleVerifyPasswordChange(event) {
    this.setState({ verifypassword: event.target.value });
  }

  handleDisplayNameChange(event) {
    this.setState({ displayname: event.target.value });
  }

  render() {
    return (
      <div>
        <h2>hi I'm Signup</h2>
        <form id="signUpForm">
          <label>Email: </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          <br />
          <label>Display Name: </label>
          <input
            type="text"
            id="displayname"
            name="displayname"
            placeholder="Display Name"
            value={this.state.displayname}
            onChange={this.handleDisplayNameChange}
          />
          <br />
          <label>Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <br />
          <label>Verify Password: </label>
          <input
            type="password"
            id="verifypassword"
            name="verifypassword"
            placeholder="Verify Password"
            value={this.state.verifypassword}
            onChange={this.handleVerifyPasswordChange}
          />
          <br />
          <Button onClick={this.onSignup} type="primary">
            SIGN UP
          </Button>
        </form>
      </div>
    );
  }
}
