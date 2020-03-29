import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import firebase from '../firebase';
import styled from 'styled-components';
import signupImg from '../images/signup.png';
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

  .signupbutton {
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
`;

@withRouter
@observer
export default class SignUp extends React.Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', verifypassword: '', displayname: '' };
  }

  onSignup = () => {
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

      message.error(errorString);
    } else if (this.state.password !== this.state.verifypassword) {
      message.error('Your password and verification password do not match.');
    } else {
      let db = firebase.firestore();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(cred => {
          //Create user in firestore - auth uid matches db id
          db.collection('users')
            .doc(cred.user.uid)
            .set({
              //Set display name, note that we already have user email and id by this point
              displayName: this.state.displayname,
            });

          //Iniitialize categories collection for this user
          //Note: ID of the category is also the name of the category in lowercase
          db.collection('users/' + cred.user.uid + '/categories')
            .doc('all')
            .set({
              name: 'All',
              clothes: [],
            });
          db.collection('users/' + cred.user.uid + '/categories')
            .doc('hats')
            .set({
              name: 'Hats',
              clothes: [],
            });
          db.collection('users/' + cred.user.uid + '/categories')
            .doc('shirts')
            .set({
              name: 'Shirts',
              clothes: [],
            });
          db.collection('users/' + cred.user.uid + '/categories')
            .doc('pants')
            .set({
              name: 'Pants',
              clothes: [],
            });
          db.collection('users/' + cred.user.uid + '/categories')
            .doc('shoes')
            .set({
              name: 'Shoes',
              clothes: [],
            });

          //Initialize empty backgrounds collection for this user, should contain default image
          db.collection('users/' + cred.user.uid + '/backgrounds')
            .doc('Default')
            .set({
              url: 'defaultBackgroundImageUrl',
            });

          /*Note, outfits the user creates will have name,
           *clothes ID array, and image url initialized.
           *Also maybe a "favorite" boolean field?
           *The outfit collection is initialized when the user first makes an outfit.*/

          /*Note, clothes the user creates will have name,
           *category ID array, image url, created timestamp,
           *and last updated timestamp initialized.
           *The clothes collection is initialized when the user first makes a clothing item.*/

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

  handleVerifyPasswordChange = event => {
    this.setState({ verifypassword: event.target.value });
  };

  handleDisplayNameChange = event => {
    this.setState({ displayname: event.target.value });
  };

  render() {
    return (
      <Wrapper>
        <Card>
          <Left>
            <h2>Sign up to Wardrobe</h2>
            <img src={signupImg} />
          </Left>
          <Right>
            <RightContent>
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
              </form>

              <br />
              <Button
                className="signupbutton"
                onClick={this.onSignup}
                variant="contained"
                color="primary"
              >
                SIGN UP
              </Button>

              <p>
                Or go back to <Link to="/login">login</Link>
              </p>
            </RightContent>
          </Right>
        </Card>
      </Wrapper>
    );
  }
}
