import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { message } from 'antd';
import { Button, TextField } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { StoreContext } from '../stores';
import firebase from '../firebase';
import loginImg from '../images/login.png';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 50px auto 100px;
`;
const Card = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  align-content: stretch;
  background: #fff;
  box-shadow: 4px 4px 8px 0.5px #5d4381;
`;
const Left = styled.div`
  background-color: #dfeaf5;
  flex: 1 0 0;
  position: relative;
  h2 {
    font-weight: bold;
    font-size: 22px;
    color: #212121;
    padding: 26px 34px;
    line-height: 26px;
    margin-bottom: 320px;
  }
  img {
    width: 250px;
    opacity: 0.9;
    position: absolute;
    bottom: -20px;
    left: 0;
  }
`;
const Right = styled.div`
  flex: 1 0 0;
  text-align: center;
`;

const RightContent = styled.div`
  padding: 70px 40px;
  display: flex;
  flex-direction: column;

  /* style material-ui TextField */
  .MuiFormControl-root {
    margin: 0 40px 24px;
    .MuiOutlinedInput-root {
      overflow: hidden;
      &:hover {
        .MuiOutlinedInput-notchedOutline {
          border-color: #7d64e1;
        }
      }
    }
    .MuiOutlinedInput-input {
      background: #ecf0f7;
    }
  }
`;
const ForgetPW = styled.div`
  text-align: right;
  margin: -18px 40px 40px 0;
  .forgetPW {
    font-size: 10px;
    color: #22b3cc;
    &:hover {
      color: #22b3cc;
      text-decoration: none;
    }
  }
`;

const LoginBTN = styled.div`
  .loginbutton {
    border-radius: 19px;
    padding: 7px 28px;
    background: #7d64e1;
    margin-bottom: 20px;
    &:hover {
      color: #fff;
      background-color: #775ce3;
    }
  }
`;

const ToSignUp = styled.div`
  .toSignUp {
    margin-left: 5px;
    font-size: 14px;
    color: #22b3cc;
    &:hover {
      color: #22b3cc;
      text-decoration: none;
    }
  }
`;

@withRouter
@observer
export default class Login extends React.Component {
  static contextType = StoreContext;

  state = {
    email: '',
    password: '',
  };

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
      .then(() => {
        message.success('Password reset email sent.');
      })
      .catch(error => {
        // An error happened.
        message.error(error.message);
      });
  };

  canSubmit = () => {
    const { email, password } = this.state;
    return email && password && email.trim() && password.trim();
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
              <TextField
                id="login-email"
                label="Email"
                type="email"
                autoComplete="email"
                variant="outlined"
                size="small"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
                onKeyPress={e => {
                  if (e.key === 'Enter' && this.canSubmit()) this.onLogin();
                }}
              />
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                size="small"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
                onKeyPress={e => {
                  if (e.key === 'Enter' && this.canSubmit()) this.onLogin();
                }}
              />
              <ForgetPW>
                <Link to="#" className="forgetPW" onClick={this.sendPasswordReset}>
                  Forgot password?
                </Link>
              </ForgetPW>

              <LoginBTN>
                <Button
                  className="loginbutton"
                  onClick={this.onLogin}
                  variant="contained"
                  color="primary"
                >
                  LOGIN
                </Button>
              </LoginBTN>

              <ToSignUp>
                <span>Don&apos;t have an account?</span>
                <Link to="/signup" className="toSignUp">
                  Sign Up
                </Link>
              </ToSignUp>
            </RightContent>
          </Right>
        </Card>
      </Wrapper>
    );
  }
}
