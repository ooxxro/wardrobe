import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons'; //Should be User's current avatar
import { Avatar } from 'antd';

const Wrapper = styled.div`
  width: 50%;
  margin-left: auto;
  margin-right: auto;
`;

const Card1 = styled.div`
  background-color: #ffffff;
  box-shadow: 3px 3px 8px 0.5px #444444;
  margin: 30px auto;
  width: 90%;
  h2 {
    text-align: center;
    font-weight: bold;
    padding: 2rem 2rem;
  }
  hr {
    color: #e2e1e1;
  }
`;

const Card1Content = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 2rem;
  .emailForm input {
    border-radius: 4px;
    background-color: #ecf0f7;
    border: 1px solid #c3c4c8;
    width: 34.5%;
    margin-bottom: 20px;
    margin-right: 3%;
  }

  .passwordForm input {
    border-radius: 4px;
    background-color: #ecf0f7;
    border: 1px solid #c3c4c8;
    width: 22%;
    margin-bottom: 20px;
    margin-right: 3%;
  }

  .saveEmailButton {
    width: 10%;
    background: #6247ce;
    &:hover {
      color: #fff;
      background-color: #6247ce;
    }
  }

  .savePasswordButton {
    width: 10%;
    background: #6247ce;
    &:hover {
      color: #fff;
      background-color: #6247ce;
    }
  }
`;

const Card2 = styled.div`
  background-color: #d1c7ff;
  box-shadow: 3px 3px 8px 0.5px #444444;
  margin: 30px auto;
  width: 90%;
  hr {
    width: 90%;
    color: #948eab;
  }
  h2 {
    text-align: center;
    font-weight: bold;
    padding: 2rem 2rem;
  }
  .card2Content {
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 2rem;
    width: 90%;

    input {
      border-radius: 4px;
      background-color: #ecf0f7;
      border: 1px solid #c3c4c8;
      margin-bottom: 20px;
      margin-right: 3%;
    }

    .deleteAccountButton {
      background: #6247ce;
      &:hover {
        color: #fff;
        background-color: #6247ce;
      }
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  margin-bottom: 20px;
`;

export default class Setting extends React.Component {
  render() {
    return (
      <Wrapper>
        <Card1>
          <h2>Account Settings</h2>
          <Card1Content>
            <hr></hr>
            <label>Avatar</label>
            <br></br>
            <StyledAvatar size="large" icon={<UserOutlined />} />
            <hr></hr>
            <form className="emailForm">
              <label>ChangeEmail</label>
              <br />
              <input type="text" id="email" name="email" placeholder="New Email" />
              <input
                type="password"
                id="currentpassword1"
                name="currentpassword1"
                placeholder="Current Password"
              />
              <Button
                className="saveEmailButton"
                component={Link}
                type="primary"
                variant="contained"
                color="primary"
              >
                SAVE
              </Button>
            </form>
            <hr></hr>
            <form className="passwordForm">
              <label>Change Password</label>
              <br />
              <input
                type="password"
                id="newpassword"
                name="newpassword"
                placeholder="New Password"
              />
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirm New Password"
              />
              <input
                type="password"
                id="currentpassword2"
                name="currentpassword2"
                placeholder="Current Password"
              />
              <Button
                className="savePasswordButton"
                component={Link}
                type="primary"
                variant="contained"
                color="primary"
              >
                SAVE
              </Button>
            </form>
          </Card1Content>
        </Card1>
        <Card2>
          <h2>Delete Account</h2>
          <hr></hr>
          <div className="card2Content">
            <p>Once you delete, it will clear all of your data.</p>
            <p>Are you sure you want to delete your account?</p>
            <form id="deleteAccountForm">
              <input
                type="password"
                id="currentpassword3"
                name="currentpassword3"
                placeholder="Current Password"
              />
              <Button
                className="deleteAccountButton"
                component={Link}
                type="primary"
                variant="contained"
                color="primary"
              >
                DELETE MY ACCOUNT
              </Button>
            </form>
          </div>
        </Card2>
      </Wrapper>
    );
  }
}
