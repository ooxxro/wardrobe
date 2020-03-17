import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
export default class Login extends React.Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  onLogin = () => {
    const { userStore } = this.context;
    const { history } = this.props;

    //alert('Email: ' + this.state.email + '\n' + 'Password: ' + this.state.password);

    // this is fake login, should replace with firebase.auth
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

  render() {
    return (
      <div>
        <h2>hi I'm login</h2>
        <form id="loginForm">
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
          <Button onClick={this.onLogin} type="primary">
            LOGIN
          </Button>
        </form>
      </div>
    );
  }
}
