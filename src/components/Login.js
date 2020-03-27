import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import firebase from '../firebase';
import styled from 'styled-components';
import loginImg from '../images/login.png';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { message } from 'antd';

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
  }

  onLogin = () => {
    const { history } = this.props;

    if (this.state.email === '' || this.state.password === '') {
      let errorString = 'Please enter the following fields:\n';

      if (this.state.email === '') {
        errorString += 'Email\n';
      }

      if (this.state.password === '') {
        errorString += 'Password\n';
      }

      message.error(errorString);
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          history.replace('/');
        })
        .catch(error => {
          // Handle Errors here.
          message.error(error.message);
        });
    }
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  sendPasswordReset = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(function() {
        message.success('Password reset email sent.');
      })
      .catch(error => {
        // An error happened.
        message.error(error.message);
      });
  };

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
                <a onClick={this.sendPasswordReset}>Forgot password?</a>
              </p>

              <Button
                className="loginbutton"
                onClick={this.onLogin}
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button>

              <p>
                Don&apos;t have an account? <Link to="/signup"> Sign Up</Link>
              </p>
            </RightContent>
          </Right>
        </Card>
      </Wrapper>
    );
  }
}
