import React from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Dropdown, message } from 'antd';
import { StoreContext } from '../stores';
import firebase from '../firebase';

const Wrapper = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  &:hover {
    color: #fff;
  }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  > * {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
`;

const LoginBtn = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  &:hover {
    color: #fff;
  }
`;

const SignUpBtn = styled(Button)`
  background: linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
  &:hover {
    color: #fff;
  }
`;

@withRouter
@observer
export default class Header extends React.Component {
  static contextType = StoreContext;

  onLogout = () => {
    const { history } = this.props;

    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        history.push('/');
      })
      .catch(error => {
        // An error happened.
        message.error(
          'Oops, something went wrong. Please try again later. Error: ' + error.message
        );
      });
  };

  render() {
    const { userStore } = this.context;

    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/setting">Setting</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={this.onLogout}>Logout</Menu.Item>
      </Menu>
    );

    return (
      <Wrapper>
        <Logo to="/">Wardrobe</Logo>

        {userStore.isLoggedIn ? (
          <Right>
            <Dropdown overlay={menu} placement="bottomRight">
              <div className="user">
                <span className="display-name">{userStore.currentUser.displayName}</span>
                <StyledAvatar
                  size="large"
                  icon={<UserOutlined />}
                  src={userStore.currentUser.photoURL}
                />
              </div>
            </Dropdown>
          </Right>
        ) : (
          <Right>
            <LoginBtn component={Link} to="/login" variant="contained" color="primary">
              LOGIN
            </LoginBtn>
            <SignUpBtn component={Link} to="/signup" variant="contained" color="primary">
              SIGN UP
            </SignUpBtn>
          </Right>
        )}
      </Wrapper>
    );
  }
}
