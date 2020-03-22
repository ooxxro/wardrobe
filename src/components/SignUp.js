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
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleVerifyPasswordChange = this.handleVerifyPasswordChange.bind(this);
    this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this);
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

      alert(errorString);
    } else if (this.state.password !== this.state.verifypassword) {
      alert('Your password and verification password do not match.');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          history.replace('/');
        })
        .catch(error => {
          // Handle Errors here.
          message.error(error.message);
        });
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
                component={Link}
                onClick={this.onSignup}
                type="primary"
                variant="contained"
                color="primary"
              >
                SIGN UP
              </Button>

              <p>
                Or go back to <a href="/login">login</a>
              </p>
            </RightContent>
          </Right>
        </Card>
      </Wrapper>
    );
  }
}
