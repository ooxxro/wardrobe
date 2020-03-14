import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react';

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

const LoginBtn = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
`;

const SignUpBtn = styled(Button)`
  background: linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
`;

@observer
export default class Header extends React.Component {
  render() {
    return (
      <Wrapper>
        <Logo to="/">Wardrobe</Logo>

        <Right>
          <LoginBtn component={Link} to="/login" variant="contained" color="primary">
            LOGIN
          </LoginBtn>
          <SignUpBtn component={Link} to="/signup" variant="contained" color="primary">
            SIGN UP
          </SignUpBtn>
        </Right>
      </Wrapper>
    );
  }
}
