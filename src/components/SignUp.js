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

      let db = firebase.firestore();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(cred => {
          const promises = [];

          // update displayName
          let promise = firebase.auth().currentUser.updateProfile({
            displayName: this.state.displayName.trim(),
          });
          promises.push(promise);

          //Create user in firestore - auth uid matches db id
          promise = db
            .collection('users')
            .doc(cred.user.uid)
            .set({
              //Set display name, note that we already have user email and id by this point
              displayName: this.state.displayName,
            });
          promises.push(promise);

          //Iniitialize categories collection for this user
          //Note: ID of the category is also the name of the category in lowercase
          promise = db
            .collection('users/' + cred.user.uid + '/categories')
            .doc('all')
            .set({
              name: 'All',
              clothes: [],
            });
          promises.push(promise);
          promise = db
            .collection('users/' + cred.user.uid + '/categories')
            .doc('hats')
            .set({
              name: 'Hats',
              clothes: [],
            });
          promises.push(promise);
          promise = db
            .collection('users/' + cred.user.uid + '/categories')
            .doc('shirts')
            .set({
              name: 'Shirts',
              clothes: [],
            });
          promises.push(promise);
          promise = db
            .collection('users/' + cred.user.uid + '/categories')
            .doc('pants')
            .set({
              name: 'Pants',
              clothes: [],
            });
          promises.push(promise);
          promise = db
            .collection('users/' + cred.user.uid + '/categories')
            .doc('shoes')
            .set({
              name: 'Shoes',
              clothes: [],
            });
          promises.push(promise);

          //Initialize empty backgrounds collection for this user, should contain default image
          promise = db
            .collection('users/' + cred.user.uid + '/backgrounds')
            .doc('Default')
            .set({
              url: 'defaultBackgroundImageUrl',
            });
          promises.push(promise);

          /*Note, outfits the user creates will have name,
           *clothes ID array, and image url initialized.
           *Also maybe a "favorite" boolean field?
           *The outfit collection is initialized when the user first makes an outfit.*/

          /*Note, clothes the user creates will have name,
           *category ID array, image url, created timestamp,
           *and last updated timestamp initialized.
           *The clothes collection is initialized when the user first makes a clothing item.*/

          return Promise.all(promises);
        })
        .then(() => {
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
    const { loading, password, verifyPassword } = this.state;
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
                value={this.state.email}
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
                value={this.state.displayName}
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
