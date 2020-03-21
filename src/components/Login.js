import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import styled from 'styled-components';
import loginImg from '../images/login.png';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
`;
const Card = styled.div`
  display: table;
  background: #fff;
  box-shadow: 3px 3px 8px 0.5px #444444;
  margin: 75px auto;
  width: 90%;
`;
const Left = styled.div`
  background-color: #dfeaf5;
  float: left;
  width: 50%;
  h2 {
    font-weight: bold;
    font-size: 30px;
    padding: 2rem 2rem;
  }
  img {
    width: 50%;
  }
`;
const Right = styled.div`
  float: left;
  width: 50%;
  text-align: center;
`;

const RightContent = styled.div`
  display: table;
  width: 80%;
  font-size: 15px;

  margin: 0px auto;
  padding-top: 20%;
  form {
    text-align: left;
  }

  label {
    display: inline-block;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  input {
    border-radius: 4px;
    background-color: #ecf0f7;
    border: 1px solid rgba(0, 0, 0, 0.65);
    padding: 5px;
    width: 100%;
  }

  .loginbutton {
    display: inline-block;
    margin-bottom: 10px;
    border-radius: 19px;
    padding: 7px 28px;
    background: #6247ce;
    width: auto;
    &:hover {
      color: #fff;
      background-color: #6247ce;
    }
  }

  .forgotLink {
    text-align: right;
    margin-top: 10px;
    width: auto;
  }
`;

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

    if (this.state.email === '' || this.state.password === '') {
      let errorString = 'Please enter the following fields:\n';

      if (this.state.email === '') {
        errorString += 'Email\n';
      }

      if (this.state.password === '') {
        errorString += 'Password\n';
      }

      alert(errorString);
    } else {
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
        displayName: 'Bucky Badger', //Should come from firestore doc for this user
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

  render() {
    return (
      <Wrapper>
        <Card>
          <Left>
            <h2>Login to Wardrobe</h2>
            <img src={loginImg} />
          </Left>
          <Right>
            <RightContent>
              <form id="loginForm">
                <label>Email </label>
                <br />
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
                <br />
                <label>Password </label>
                <br />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
                <br />
              </form>

              <p className="forgotLink">
                <a href="">Forgot password?</a>
              </p>

              <Button
                className="loginbutton"
                component={Link}
                onClick={this.onLogin}
                type="primary"
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button>

              <p>
                Don't have an account? <a href="/signup"> Sign Up</a>
              </p>
            </RightContent>
          </Right>
        </Card>
      </Wrapper>
    );
  }
}
