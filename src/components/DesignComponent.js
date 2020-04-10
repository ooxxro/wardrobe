import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SimpleDialog from './SimpleDialog';
import {
  Button,
  SvgIcon,
  IconButton,
  Zoom,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Popover,
} from '@material-ui/core';
import userBgImg from '../images/userBgImg.jpg';
import IOSSwitch from './IOSSwitch';
import { ReactComponent as UndoIcon } from '../images/undo.svg';
import { ReactComponent as LockIcon } from '../images/lock.svg';
import { ReactComponent as FilterIcon } from '../images/filter.svg';
import { ReactComponent as GoBackIcon } from '../images/goback.svg';
import { ReactComponent as EditPicIcon } from '../images/editpic.svg';
import firebase from '../firebase';
import { Tabs } from 'antd';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: rgba(185, 185, 185, 0.2);
  display: flex;
  justify-content: center;
  padding: 50px 40px 55px;
  position: relative;
`;

const GoBack = styled.div`
  position: absolute;
  top: 25px;
  left: 25px;
  .goBack {
    background: #e3ddff;
    &:hover {
      background: #d7cffc;
    }
  }
`;

const Random = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 25px;
  .random {
    padding: 0;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #8ff2b8;
    border-radius: 50%;
    /* padding: 44px 20px; */
    width: 70px;
    height: 70px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    line-height: 70px;
    color: #212121;
    &:hover {
      background: #75eda7;
      color: #212121;
    }
  }
`;
const Picture = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  &:hover {
    .editPic {
      transition: 0.4s;
      opacity: 1;
    }
  }
`;

const EditPic = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  .editPic {
    opacity: 0;
    transition: 0.4s;
    background: #e3ddff;
    font-size: 16px;
    padding: 5px;
    &:hover {
      background: #d7cffc;
    }
  }
`;
const ImgWrapper = styled.div`
  width: 300px;
  height: 400px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
`;
const IconCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-left: 25px;
`;

const Save = styled.div`
  .save {
    width: 60px;
    height: 60px;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #aef0f7;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    border-radius: 50%;
    color: #212121;
    padding: 0;
    min-width: 60px;
    &:hover {
      background: #95f5ff;
      color: #212121;
    }
  }
`;
const UpperIcon = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  .undo {
    background: #f7d49e;
    margin-bottom: 10px;
    &:hover {
      background: #fcce88;
    }
  }
  .lock {
    margin-left: 10px;
    background: #fecdda;
    &:hover {
      background: #fcbbcc;
    }
  }
`;

const Lock = styled.div`
  background: #fecdda;
  padding: 6px;
  .lockItem {
    padding: 5px 10px;
    font-size: 14px;
    &:not(:last-child) {
      border-bottom: 0.5px solid #ff7298;
    }
    .MuiSwitch-root {
      margin: 0;
      margin-right: 10px;
    }
  }
`;

const ChooseClothes = styled.div`
  margin-left: 25px;
  width: 250px;
  height: 400px;
  background: #cde6fe;
  border-radius: 20px;
  .filter {
    background: #d8d0fc;
    border: 0.5px solid white;
    &:hover {
      background: #cbbfff;
    }
  }
`;
const CheckboxoxList = styled.div`
  padding: 0 6px;
  background: #d8d0fc;
  .filterItem {
    padding-right: 11px;
    font-size: 14px;
    &:not(:last-child) {
      border-bottom: 0.5px solid #8c72ff;
    }
    span {
      font-size: 14px;
    }
  }
  .MuiFormControlLabel-root {
    margin: 0;
  }
  .MuiSvgIcon-root {
    color: #7d64e1;
  }
  svg {
    width: 22px;
    height: 22px;
  }
`;

const { TabPane } = Tabs;
const ClothesMenu = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  .clothingItem {
    width: 48%;
    margin: 1%;
    border: 2px solid #fbe644;
    height: 100px;
  }
`;

@withRouter
@observer
export default class DesignComponent extends React.Component {
  static contextType = StoreContext;

  state = {
    open: false,
    // filter
    turnon: false,
    tagdata: [],
    tagtoggled: [],
    // dialogs
    dialogOpen: false,
    goBackDialogOpen: false,
    //clothing image paths + corresponding categories
    clothesimages: [],
    clothescategories: [], //2D array of categories
    storageUrls: [], //URLs for the images from storage
  };

  //Execute upon rendering the page
  componentDidMount() {
    this.getTagData();
    this.getClothesData();
  }

  getClothesData = () => {
    let db = firebase.firestore();
    let storageRef = firebase.storage().ref();
    let images = [];
    let categories = [];
    let urls = [];

    db.collection('users/' + firebase.auth().currentUser.uid + '/clothes')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          categories.push(doc.data().categories);
          images.push(doc.data().imagePath);
          storageRef
            .child(doc.data().imagePath)
            .getDownloadURL()
            .then(function(url) {
              urls.push(url);
            });
        });
      });

    this.setState({ clothesimages: images, clothescategories: categories, storageUrls: urls });
  };

  //creates a state array of tags using the docs specified
  //in the user's categories collection.
  getTagData = () => {
    let db = firebase.firestore();
    let tags = [];
    let toggled = [];

    db.collection('users/' + firebase.auth().currentUser.uid + '/categories')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let tag = doc.data().name;

          //When it's possible to add new categories,
          //we'll also suppress Hats, Pants, Shirts, Shoes
          if (tag != 'All') {
            tags.push(tag);

            //Corresponding array that keeps track of
            //whether or not each tag is checked (toggled)
            toggled.push(false);
          }
        });
      });

    this.setState({ tagdata: tags, tagtoggled: toggled });
  };

  onSelectTag = i => {
    this.setState(state => {
      const tagtoggled = state.tagtoggled.map((item, j) => {
        if (j === i) {
          return !item;
        } else {
          return item;
        }
      });
      return {
        tagtoggled,
      };
    });
  };

  onSelectTab(key) {
    this.setState(state => {
      const tagtoggled = state.tagtoggled.map((item, j) => {
        if (j === key - 1) {
          return (item = true);
        } else {
          return (item = false);
        }
      });
      return {
        tagtoggled,
      };
    });
  }

  onSave = () => {
    this.setState({ dialogOpen: true });
  };

  onEditDone = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    const { from } = this.props;
    const { dialogOpen, goBackDialogOpen } = this.state;
    let buttonsZone;
    let goBackButtonsZone = [
      { text: 'Cancel, Continue Editing', onClick: () => {} },
      { text: 'Exit without Saving', exit: true, onClick: () => {} },
    ];
    // let description;

    if (from === 'design') {
      buttonsZone = [
        { text: 'Download', onClick: () => {} },
        { text: 'Save to My Favorites', onClick: () => {} },
        { text: 'Exit without Saving', exit: true, onClick: () => {} },
      ];
    } else {
      buttonsZone = [
        { text: 'Download', onClick: () => {} },
        { text: 'Save to Current', onClick: () => {} },
        { text: 'Save as New', onClick: () => {} },
        { text: 'Exit without Saving', exit: true, onClick: () => {} },
      ];
    }
    return (
      <Wrapper>
        {from === 'edit' && (
          <GoBack>
            <Tooltip arrow title="Go back" TransitionComponent={Zoom} placement="top">
              <IconButton
                className="goBack"
                onClick={() => this.setState({ goBackDialogOpen: true })}
              >
                <SvgIcon fontSize="small">
                  <GoBackIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </GoBack>
        )}
        <Random>
          <Button className="random" variant="contained">
            Random
          </Button>
        </Random>
        <Picture>
          <ImgWrapper>
            <img src={userBgImg} />
          </ImgWrapper>
          <EditPic>
            <Tooltip arrow title="Change background" TransitionComponent={Zoom} placement="top">
              <IconButton className="editPic" size="small">
                <SvgIcon fontSize="inherit">
                  <EditPicIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </EditPic>
        </Picture>
        <IconCol>
          <UpperIcon>
            <Tooltip arrow title="Undo" TransitionComponent={Zoom} placement="top">
              <IconButton className="undo">
                <SvgIcon fontSize="small">
                  <UndoIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Lock categories" TransitionComponent={Zoom} placement="top">
              <IconButton
                ref={el => (this.lockBtnRef = el)}
                className="lock"
                onClick={() => this.setState({ open: true })}
              >
                <SvgIcon fontSize="small">
                  <LockIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Popover
              open={this.state.open}
              anchorEl={this.lockBtnRef}
              onClose={() => this.setState({ open: false })}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Lock>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Hat
                </div>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Shirt
                </div>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Pants
                </div>
                <div className="lockItem">
                  <IOSSwitch name="checkedB" />
                  Shoes
                </div>
              </Lock>
            </Popover>
          </UpperIcon>

          <Save>
            {from === 'design' ? (
              <Button className="save" variant="contained" onClick={this.onSave}>
                Save
              </Button>
            ) : (
              <Button className="save" variant="contained" onClick={this.onEditDone}>
                Done
              </Button>
            )}
          </Save>
        </IconCol>
        <ChooseClothes>
          <Tooltip arrow title="Filter categories" TransitionComponent={Zoom} placement="top">
            <IconButton
              className="filter"
              ref={el => (this.filterBtnRef = el)}
              onClick={() => {
                this.setState({ turnon: true });
              }}
            >
              <SvgIcon fontSize="small">
                <FilterIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
          <Popover
            open={this.state.turnon}
            anchorEl={this.filterBtnRef}
            onClose={() => this.setState({ turnon: false })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {/* show all user defined tags */}
            <CheckboxoxList>
              {(this.state.tagdata || []).map((tag, index) => (
                <div className="filterItem" key={tag}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={tag}
                        color="primary"
                        onChange={() => this.onSelectTag(index)}
                      />
                    }
                    label={tag}
                  />
                </div>
              ))}
            </CheckboxoxList>
          </Popover>

          <ClothesMenu>
            <Tabs defaultActiveKey="0" type="card" onChange={this.onSelectTab.bind(this)}>
              <TabPane tab="All" key="0">
                {(this.state.storageUrls || []).map((url, index) => {
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    return <img className="clothingItem" src={url} key={index} />;
                  }
                })}
              </TabPane>
              <TabPane tab="Hats" key="1">
                {(this.state.storageUrls || []).map((url, index) => {
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    return <img className="clothingItem" src={url} key={index} />;
                  }
                })}
              </TabPane>
              <TabPane tab="Pants" key="2">
                {(this.state.storageUrls || []).map((url, index) => {
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    return <img className="clothingItem" src={url} key={index} />;
                  }
                })}
              </TabPane>
              <TabPane tab="Shirts" key="3">
                {(this.state.storageUrls || []).map((url, index) => {
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    return <img className="clothingItem" src={url} key={index} />;
                  }
                })}
              </TabPane>
              <TabPane tab="Shoes" key="4">
                {(this.state.storageUrls || []).map((url, index) => {
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    return <img className="clothingItem" src={url} key={index} />;
                  }
                })}
              </TabPane>
            </Tabs>
          </ClothesMenu>
        </ChooseClothes>

        <SimpleDialog
          open={dialogOpen}
          type="success"
          buttons={buttonsZone}
          onClose={() => this.setState({ dialogOpen: false })}
        />
        <SimpleDialog
          open={goBackDialogOpen}
          type="warning"
          description={
            <span>
              Are you sure
              <br />
              you want to exit without saving?
            </span>
          }
          buttons={goBackButtonsZone}
          onClose={() => this.setState({ goBackDialogOpen: false })}
        />
      </Wrapper>
    );
  }
}
