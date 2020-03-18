import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';

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

    if (
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.verifypassword === '' ||
      this.state.displayname === ''
    ) {
      let errorString = 'Please enter the following fields:\n';

      if (this.state.email === '') {
        errorString += 'Email\n';
      }

      if (this.state.displayname === '') {
        errorString += 'Display Name\n';
      }

      if (this.state.password === '') {
        errorString += 'Password\n';
      }

      if (this.state.verifypassword === '') {
        errorString += 'Verification Password\n';
      }

      alert(errorString);
    } else if (this.state.password !== this.state.verifypassword) {
      alert('Your password and verification password do not match.');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
        });

      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // ...
        });

      userStore.currentUser = {
        displayName: this.state.displayname, //Should come from firestore document for this user
        email: firebase.auth().currentUser.email,
      };

      history.replace('/');
    }
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
