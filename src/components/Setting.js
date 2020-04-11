import React from 'react';
import { StoreContext } from '../stores';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { UserOutlined } from '@ant-design/icons'; //Should be User's current avatar
import { TextField } from '@material-ui/core';
import { Avatar, message } from 'antd';
import firebase from '../firebase';
import ButtonWithLoading from './ButtonWithLoading';

const Wrapper = styled.div`
  max-width: 800px;
  margin: 50px auto 100px;
  border-radius: 4px;
  opacity: 1;
  overflow: hidden;
  h3 {
    text-align: center;
    font-size: 24px;
    margin: 0 auto 50px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
  }
  h4 {
    margin-top: 40px;
    padding-top: 20px;
    font-size: 16px;
    border-top: 1px solid #ddd;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
`;

const Card1 = styled.div`
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  padding: 60px 50px 86px;
  .avatar {
    margin-top: 10px;
  }
  .MuiFormControl-root {
    flex: 1;
    margin-right: 20px;
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

const Card1Content = styled.div`
  .card1Btn {
    border-radius: 3px;
    padding: 8px 20px;
    background: #7d64e1;
    &:hover {
      color: #fff;
      background-color: #775ce3;
    }
  }

  .editAvatarForm input {
    border-radius: 4px;
    background-color: #ecf0f7;
    border: 1px solid #c3c4c8;
    width: 42.5%;
    margin-bottom: 20px;
    margin-right: 3%;
  }

  .editAvatarButton {
    width: 10%;
    background: #6247ce;
    &:hover {
      color: #fff;
      background-color: #775ce3;
    }
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  .displayName {
    margin-left: 20px;
  }
  .MuiFormControl-root {
    flex: auto;
  }
`;

const ChangeEmail = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 30px;
`;

const ChangePW = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 30px;
`;

const Card2 = styled.div`
  background: #d1c7ff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  padding: 60px 50px 80px;
  margin-top: 50px;
  h4 {
    border-top: 1px solid #eee;
  }
`;

const DeleteAccount = styled.div`
  display: flex;
  align-items: flex-end;
  .MuiFormControl-root {
    margin: 20px 30px 0 0;
    .MuiInput-underline {
      &:hover {
        &::before {
          border-color: #7d64e1;
        }
      }
    }
    .MuiOutlinedInput-input {
      background: #ecf0f7;
    }
    .deleteAccountButton {
      border-radius: 3px;
      padding: 7px 20px;
      background: #7d64e1;
      margin-bottom: 25px;
      &:hover {
        color: #fff;
        background-color: #775ce3;
      }
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
`;

@observer
export default class Setting extends React.Component {
  static contextType = StoreContext;

  state = {
    // displayName: '',
    // displayNameLoading: false,
    email: '',
    emailPassword: '',
    emailLoading: false,
    newPassword: '',
    verifyNewPassword: '',
    changeCurrentPW: '',
    deleteAccountPW: '',
    avatarEdit: false,
    avatarLocation: null,
  };

  componentDidMount() {
    const {
      userStore: { currentUser },
    } = this.context;

    this.setState({
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
    });
  }

  editAvatar = () => {
    this.setState({ avatarEdit: !this.state.avatarEdit });
  };

  cancelEditAvatar = () => {
    this.setState({ avatarEdit: false });
  };

  onChangeDisplayName = () => {
    const {
      userStore,
      userStore: { currentUser },
    } = this.context;
    const { displayName, displayNameLoading } = this.state;

    if (!displayName.trim() || displayNameLoading || displayName.trim() === currentUser.displayName)
      return;

    this.setState({ displayNameLoading: true });

    const user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: this.state.displayName.trim(),
      })
      .then(() => {
        // Update successful.
        return user.reload();
      })
      .then(() => {
        userStore.setUser(firebase.auth().currentUser);

        this.setState({ displayNameLoading: false });
        message.success('Display Name updated successfully!');
      })
      .catch(error => {
        // An error happened.
        this.setState({ displayNameLoading: false });
        message.error(error.message);
      });
  };

  onChangeEmail = () => {
    const {
      userStore: { currentUser },
    } = this.context;
    const { email, emailPassword, emailLoading } = this.state;

    if (!email.trim() || !emailPassword || emailLoading || email.trim() === currentUser.email)
      return;

    this.setState({ emailLoading: true });

    let user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      this.state.emailPassword
    );
    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        return user.updateEmail(email);
      })
      .then(() => {
        this.setState({ emailLoading: false, emailPassword: '' });
        message.success('Email updated successfully!');
      })
      .catch(error => {
        // Handle Errors here.
        this.setState({ emailLoading: false });
        message.error(error.message);
      });
  };

  onChangePassword = () => {
    const { changeCurrentPW, newPassword, verifyNewPassword, passwordLoading } = this.state;

    if (!changeCurrentPW || !newPassword || !verifyNewPassword || passwordLoading) return;

    this.setState({ passwordLoading: true });

    if (newPassword !== verifyNewPassword) {
      message.error('Your new password and new password verification do not match.');
    } else {
      let user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.state.changeCurrentPW
      );
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          return user.updatePassword(newPassword);
        })
        .then(() => {
          this.setState({ passwordLoading: false });
          message.success('Password updated successfully!');
        })
        .catch(error => {
          // Handle Errors here.
          this.setState({ passwordLoading: false });
          message.error(error.message);
        });
    }
  };

  // TODO
  onDeleteAccount = () => {
    const { deleteAccountPW, deleteAccountLoading } = this.state;
    if (!deleteAccountPW || deleteAccountLoading) return;

    this.setState({ deleteAccountLoading: true });

    const { history } = this.props;

    let user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      this.state.deleteAccountPW
    );
    const reauthPromise = user.reauthenticateWithCredential(credential);

    // Remove user doc from Firestore
    let db = firebase.firestore();
    const dbPromise = db
      .collection('users')
      .doc(user.uid)
      .delete();
    Promise.all([reauthPromise, dbPromise])
      .then(() => {
        // TODO: Remove folder for user in storage - impossible?
        // Finally delete user from Auth
        return user.delete();
      })
      .then(() => {
        message.success('Account deleted successfully.');
        this.setState({ deleteAccountLoading: false });
        history.push('/');
      })
      .catch(error => {
        // Handle Errors here.
        this.setState({ deleteAccountLoading: false });
        message.error(error.message);
      });
  };

  render() {
    const {
      userStore: { currentUser },
    } = this.context;
    const {
      displayName,
      displayNameLoading,
      email,
      emailPassword,
      emailLoading,
      changeCurrentPW,
      newPassword,
      verifyNewPassword,
      passwordLoading,
      deleteAccountPW,
      deleteAccountLoading,
    } = this.state;

  handChange = () => {
    const { userStore } = this.context;
    const file = this.state.avatarLocation;
    if (file) {
      let uploadPath;
      if (file['name']) {
        uploadPath = userStore.currentUser.uid + '/' + file['name'];
      } else {
        uploadPath =
          userStore.currentUser.uid + '/' + file.substring(12, file.size).replace('/', 'A');
      }
      this.setState({ avatarLocation: uploadPath });
      let user = firebase.auth().currentUser;

      let storageRef = firebase.storage().ref(uploadPath);
      storageRef
        .put(file)
        .then(snapshot => {
          return snapshot.ref.getDownloadURL();
        })
        .then(url => {
          return user.updateProfile({ photoURL: url });
        })
        .then(() => {
          message.success('Avatar updated successfully!');
          this.setState({ avatarEdit: false, avatarLocation: null });
        })
        .catch(error => {
          // Handle Errors here.
          message.error(error.message);
        });
    } else {
      alert('Image is required!');
    }
  };

    return (
      <Wrapper>
        <Card1>
          <h3>Account Settings</h3>
          <Card1Content>
            <h4 />
            <User>
              <StyledAvatar className="avatar" size={120} icon={<UserOutlined />} />
              <TextField
                className="displayName"
                id="diaplay-name"
                label="Display Name"
            <StyledAvatar
              size="large"
              icon={<UserOutlined />}
              onClick={this.editAvatar}
              src={photoURL}
            ></StyledAvatar>
            <form
              className="editAvatarForm"
              style={{ display: this.state.avatarEdit ? 'block' : 'none' }}
              onSubmit={this.onSubmit}
            >
              <label>Upload New Avatar</label> <br></br>
              <input
                type="file"
                id="avatarLocation"
                name="avatarLocation"
                placeholder="New Avi"
                onChange={this.onImgChange}
                value={this.state.image}
              ></input>
              <label htmlFor="file"></label>
            </form>
            {this.state.avatarEdit && <Button onClick={this.handChange}>SAVE</Button>}
            {this.state.avatarEdit && <Button onClick={this.cancelEditAvatar}>CANCEL</Button>}
                type="text"
                autoComplete="name"
                variant="outlined"
                size="small"
                value={displayName}
                onChange={e => this.setState({ displayName: e.target.value })}
                onKeyPress={e => {
                  if (e.key === 'Enter') this.onChangeDisplayName();
                }}
              />
              <ButtonWithLoading
                className="card1Btn"
                variant="contained"
                color="primary"
                loading={displayNameLoading}
                disabled={
                  !displayName.trim() ||
                  displayNameLoading ||
                  displayName.trim() === currentUser.displayName
                }
                onClick={this.onChangeDisplayName}
              >
                SAVE
              </ButtonWithLoading>
            </User>

            <h4>Change Email</h4>
            <ChangeEmail>
              <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                variant="outlined"
                size="small"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <TextField
                id="email-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                size="small"
                value={emailPassword}
                onChange={e => this.setState({ emailPassword: e.target.value })}
                onKeyPress={e => {
                  if (e.key === 'Enter') this.onChangeEmail();
                }}
              />
              <ButtonWithLoading
                className="card1Btn"
                variant="contained"
                color="primary"
                onClick={this.onChangeEmail}
                loading={emailLoading}
                disabled={
                  !email.trim() ||
                  emailLoading ||
                  email.trim() === currentUser.email ||
                  !emailPassword
                }
              >
                SAVE
              </ButtonWithLoading>
            </ChangeEmail>

            <h4>Change Password</h4>
            <ChangePW>
              <TextField
                id="current-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                size="small"
                value={changeCurrentPW}
                onChange={e => this.setState({ changeCurrentPW: e.target.value })}
              />
              <TextField
                id="new-password"
                label="New Password"
                type="password"
                autoComplete="new-password"
                variant="outlined"
                size="small"
                value={newPassword}
                onChange={e => this.setState({ newPassword: e.target.value })}
              />
              <TextField
                error={!!verifyNewPassword && newPassword !== verifyNewPassword}
                id="password-verified"
                label="Verify Password"
                type="password"
                autoComplete="new-password"
                variant="outlined"
                size="small"
                value={verifyNewPassword}
                onChange={e => this.setState({ verifyNewPassword: e.target.value })}
                onKeyPress={e => {
                  if (e.key === 'Enter') this.onChangePassword();
                }}
              />
              <ButtonWithLoading
                className="card1Btn"
                variant="contained"
                color="primary"
                onClick={this.onChangePassword}
                loading={passwordLoading}
                disabled={
                  !changeCurrentPW || !newPassword || !verifyNewPassword || !passwordLoading
                }
              >
                SAVE
              </ButtonWithLoading>
            </ChangePW>
          </Card1Content>
        </Card1>

        <Card2>
          <h3>Delete Account</h3>
          <h4>
            Once you delete, it will clear all of your data.
            <br />
            Are you sure you want to delete your account?
          </h4>
          <DeleteAccount>
            <TextField
              id="delete-account-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="primary"
              size="small"
              value={deleteAccountPW}
              onChange={e => this.setState({ deleteAccountPW: e.target.value })}
              onKeyPress={e => {
                if (e.key === 'Enter') this.onDeleteAccount();
              }}
            />
            <ButtonWithLoading
              className="deleteAccountButton"
              variant="contained"
              color="primary"
              onClick={this.onDeleteAccount}
              loading={deleteAccountLoading}
              disabled={!deleteAccountPW || !deleteAccountLoading}
            >
              DELETE MY ACCOUNT
            </ButtonWithLoading>
          </DeleteAccount>
        </Card2>
      </Wrapper>
    );
  }
}
