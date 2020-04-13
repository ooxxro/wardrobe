import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { message } from 'antd';
import { Button, TextField } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { StoreContext } from '../stores';
import firebase from '../firebase';
import signupImg from '../images/signup.png';
import Loading from './Loading';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 50px auto 70px;
  .MuiBackdrop-root {
    z-index: 1;
  }
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
    font-size: 22px;
    font-weight: bold;
    line-height: 26px;
    color: #212121;
    padding: 26px 34px;
    margin-bottom: 320px;
  }
  img {
    width: 220px;
    opacity: 0.9;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;
const Right = styled.div`
  flex: 1 0 0;
  text-align: center;
`;

const RightContent = styled.div`
  padding: 50px 40px 38px;
  display: flex;
  flex-direction: column;

  /* style material-ui TextField */
  .MuiFormControl-root {
    margin: 0 40px 18px;
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

const SignUpBTN = styled.div`
  .signUpButton {
    border-radius: 19px;
    padding: 7px 28px;
    background: #7d64e1;
    margin: 10px 0 14px;
    &:hover {
      color: #fff;
      background-color: #775ce3;
    }
  }
`;

const ToLogin = styled.div`
  .toLogin {
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
export default class SignUp extends React.Component {
  static contextType = StoreContext;

  state = {
    email: '',
    password: '',
    verifyPassword: '',
    displayName: '',
    loading: false,
  };

  onSignup = () => {
    const { history } = this.props;

    if (this.state.loading) return;

    if (
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.verifyPassword === '' ||
      this.state.displayName === ''
    ) {
      let errorString = 'Please enter the following fields:\n';

      if (this.state.email === '') {
        errorString += 'Email\n';
      }

      if (this.state.displayName === '') {
        errorString += 'Display Name\n';
      }

      if (this.state.password === '') {
        errorString += 'Password\n';
      }

      if (this.state.verifyPassword === '') {
        errorString += 'Verification Password\n';
      }

      message.error(errorString);
    } else if (this.state.password !== this.state.verifyPassword) {
      message.error('Your password and verification password do not match.');
    } else {
      this.setState({ loading: true });

      const user = firebase.auth().currentUser;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          // update displayName
          return firebase.auth().currentUser.updateProfile({
            displayName: this.state.displayName.trim(),
          });
        })
        .then(() => {
          // Update successful.
          return user.reload();
        })
        .then(() => {
          this.context.userStore.setUser(firebase.auth().currentUser);
          this.setState({ loading: false });
          history.replace('/');
        })
        .catch(error => {
          // Handle Errors here.
          this.setState({ loading: false });
          message.error(error.message);
        });
    }
  };

  render() {
    const { loading, email, displayName, password, verifyPassword } = this.state;
    return (
      <Wrapper>
        <Loading loading={loading} />

        <Card>
          <Left>
            <h2>Sign up to Wardrobe</h2>
            <img src={signupImg} />
          </Left>
          <Right>
            <RightContent>
              <TextField
                required
                id="login-email"
                label="Email"
                type="email"
                autoComplete="email"
                variant="outlined"
                size="small"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <TextField
                required
                id="display-name"
                label="Display Name"
                type="text"
                autoComplete="name"
                variant="outlined"
                size="small"
                value={displayName}
                onChange={e => this.setState({ displayName: e.target.value })}
              />

              <TextField
                required
                id="password-input"
                label="Password"
                type="password"
                autoComplete="new-password"
                variant="outlined"
                size="small"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />

              <TextField
                required
                error={!!verifyPassword && password !== verifyPassword}
                helperText={
                  verifyPassword && password !== verifyPassword ? 'Password does not match' : ' '
                }
                id="password-verified"
                label="Verify Password"
                type="password"
                autoComplete="new-password"
                variant="outlined"
                size="small"
                value={verifyPassword}
                onChange={e => this.setState({ verifyPassword: e.target.value })}
                onKeyPress={e => {
                  if (e.key === 'Enter') this.onSignup();
                }}
              />

              <SignUpBTN>
                <Button
                  className="signUpButton"
                  onClick={this.onSignup}
                  variant="contained"
                  color="primary"
                >
                  SIGN UP
                </Button>
              </SignUpBTN>

              <ToLogin>
                <span>Or go back to</span>
                <Link to="/login" className="toLogin">
                  Login
                </Link>
              </ToLogin>
            </RightContent>
          </Right>
        </Card>
      </Wrapper>
    );
  }
}
