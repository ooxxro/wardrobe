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
import userBgImg from '../images/userBgImg.jpg'; //Should be user's current bg img
import IOSSwitch from './IOSSwitch';
import { ReactComponent as UndoIcon } from '../images/undo.svg';
import { ReactComponent as LockIcon } from '../images/lock.svg';
import { ReactComponent as FilterIcon } from '../images/filter.svg';
import { ReactComponent as GoBackIcon } from '../images/goback.svg';
import { ReactComponent as EditPicIcon } from '../images/editpic.svg';
import firebase from '../firebase';
import { Tabs } from 'antd';
import { message } from 'antd';
import ButtonWithLoading from './ButtonWithLoading';

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
  .changeBackground {
    background-color: #e3ddff;
  }
`;
const ImgWrapper = styled.div`
  width: 300px;
  height: 400px;
  .bgImg {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
`;

const HatImageArea = styled.div`
  img {
    margin-left: 100px;
    position: absolute;
    width: 100px;
    height: 100px;
  }
`;
const ShirtImageArea = styled.div`
  img {
    margin-left: 100px;
    margin-top: 100px;
    position: absolute;
    width: 100px;
    height: 100px;
  }
`;
const PantsImageArea = styled.div`
  img {
    margin-left: 100px;
    margin-top: 200px;
    position: absolute;
    width: 100px;
    height: 100px;
  }
`;
const ShoesImageArea = styled.div`
  img {
    margin-left: 100px;
    margin-top: 300px;
    position: absolute;
    width: 100px;
    height: 100px;
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
    customtagdata: [],
    tagtoggled: [],
    // dialogs
    dialogOpen: false,
    goBackDialogOpen: false,
    //clothing ids + image paths + corresponding categories
    clothesids: [],
    clothesimages: [],
    clothescategories: [], //2D array of categories
    storageUrls: [], //URLs for the images from storage
    //Storage URls for selected clothing items, initially transparent images
    selectedHat: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    selectedShirt: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    selectedPants: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    selectedShoes: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    //Used for making outfit fields
    selectedHatID: null,
    selectedShirtID: null,
    selectedPantsID: null,
    selectedShoesID: null,
    //bg image
    bgImgEdit: false,
    bgImgLocation: null,
    bgImgUrl: null,
  };

  //Execute upon rendering the page
  componentDidMount() {
    this.getBg();
    this.getTagData();
    this.getClothesData();
  }

  getBg = () => {
    //Get Bg from firestore if there is one otherwise set img url to default
    let imageUrl = '';
    let db = firebase.firestore();
    let docRef = db
      .collection('users/' + firebase.auth().currentUser.uid + '/background')
      .doc('image');

    docRef.get().then(doc => {
      if (doc.exists) {
        imageUrl = doc.data().url;
        this.setState({ bgImgUrl: imageUrl });
      } else {
        imageUrl = userBgImg;
        this.setState({ bgImgUrl: imageUrl });
      }
    });
  };

  editBg = () => {
    this.setState({ bgImgEdit: !this.state.bgImgEdit });
  };

  cancelEditBg = () => {
    this.setState({ bgImgEdit: false });
  };

  changeBackground = () => {
    const { userStore } = this.context;
    const file = this.state.bgImgLocation;
    if (file) {
      let uploadPath;
      if (file['name']) {
        uploadPath = userStore.currentUser.uid + '/' + file['name'];
      } else {
        uploadPath =
          userStore.currentUser.uid + '/' + file.substring(12, file.size).replace('/', 'A');
      }
      this.setState({ bgImgLocation: uploadPath });

      let storageRef = firebase.storage().ref(uploadPath);
      storageRef
        .put(file)
        .then(snapshot => {
          return snapshot.ref.getDownloadURL();
        })
        .then(url => {
          firebase
            .firestore()
            .collection('users/' + firebase.auth().currentUser.uid + '/background')
            .doc('image')
            .set({
              url: url,
            });
          this.setState({ bgImgUrl: url });
        })
        .then(() => {
          message.success('Background updated successfully!');
          this.setState({ bgImgEdit: false, bgImgLocation: null });
        })
        .catch(error => {
          // Handle Errors here.
          message.error(error.message);
        });
    } else {
      alert('Image is required!');
    }
  };

  getClothesData = () => {
    let db = firebase.firestore();
    let storageRef = firebase.storage().ref();
    let images = [];
    let categories = [];
    let urls = [];
    let ids = [];

    const promises = [];
    let promise = db
      .collection('users/' + firebase.auth().currentUser.uid + '/clothes')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          categories.push(doc.data().categories);
          ids.push(doc.id);
          images.push(doc.data().imagePath);

          //Doesn't put in the URls in the same order as the paths.
          storageRef
            .child(doc.data().imagePath)
            .getDownloadURL()
            .then(function(url) {
              urls.push(url);
            });
        });
      });
    promises.push(promise);

    Promise.all(promises).then(() => {
      this.setState({
        clothesids: ids,
        clothesimages: images,
        clothescategories: categories,
        storageUrls: urls,
      });
    });
  };

  //creates a state array of tags using the docs specified
  //in the user's categories collection.
  getTagData = () => {
    let db = firebase.firestore();
    let tags = [];
    let customTags = [];
    let toggled = [];

    const promises = [];
    let promise = db
      .collection('users/' + firebase.auth().currentUser.uid + '/categories')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let tag = doc.data().name;

          if (tag != 'All') {
            if (tag == 'Hats' || tag == 'Pants' || tag == 'Shirts' || tag == 'Shoes') {
              tags.push(tag);
            } else {
              customTags.push(tag);
            }

            //Corresponding array that keeps track of
            //whether or not each tag is checked (toggled)
            toggled.push(false);
          }
        });
      });
    promises.push(promise);

    //Make sure order goes Hats Pants Shirts Shoes then custom tags
    //Firestore automatically puts tags in alphabetical order
    Promise.all(promises).then(() => {
      this.setState({ tagdata: tags, customtagdata: customTags, tagtoggled: toggled });
    });
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

    return <p>Test</p>;
  }

  onSave = () => {
    this.setState({ dialogOpen: true });
  };

  onSaveNewOutfit = () => {
    let hat = [this.state.selectedHatID, this.state.selectedHat];
    let shirt = [this.state.selectedShirtID, this.state.selectedShirt];
    let pants = [this.state.selectedPantsID, this.state.selectedPants];
    let shoes = [this.state.selectedShoesID, this.state.selectedShoes];
    let bgUrl = this.state.bgImgUrl;

    let db = firebase.firestore();
    db.collection('users/' + firebase.auth().currentUser.uid + '/outfits')
      .doc()
      .set({
        hat: hat,
        shirt: shirt,
        pants: pants,
        shoes: shoes,
        bgUrl: bgUrl,
      })
      .then(function() {
        message.success('Outfit saved!');
      });
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
        {
          text: 'Save to My Favorites',
          onClick: () => {
            this.onSaveNewOutfit();
          },
        },
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
            <img className="bgImg" src={this.state.bgImgUrl} />
            <HatImageArea>
              <img src={this.state.selectedHat} />
            </HatImageArea>
            <ShirtImageArea>
              <img src={this.state.selectedShirt} />
            </ShirtImageArea>
            <PantsImageArea>
              <img src={this.state.selectedPants} />
            </PantsImageArea>
            <ShoesImageArea>
              <img src={this.state.selectedShoes} />
            </ShoesImageArea>
          </ImgWrapper>
          <EditPic>
            <Tooltip arrow title="Change background" TransitionComponent={Zoom} placement="top">
              <IconButton className="editPic" size="small" onClick={() => this.editBg()}>
                <SvgIcon fontSize="inherit">
                  <EditPicIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <div className="changeBackground">
              <form
                className="editBgImgForm"
                style={{ display: this.state.bgImgEdit ? 'block' : 'none' }}
              >
                <br />
                <label>Upload New Background Image</label> <br></br>
                <input
                  type="file"
                  id="bgImgLocation"
                  name="bgImgLocation"
                  placeholder="New Background"
                  onChange={event => this.setState({ bgImgLocation: event.target.files[0] })}
                  value={this.state.image}
                ></input>
                <label htmlFor="file"></label>
              </form>
              {this.state.bgImgEdit && (
                <ButtonWithLoading
                  onClick={this.changeBackground}
                  className="card1Btn"
                  variant="contained"
                  color="primary"
                >
                  SAVE
                </ButtonWithLoading>
              )}

              {this.state.bgImgEdit && (
                <ButtonWithLoading
                  onClick={this.cancelEditBg}
                  className="card1Btn"
                  variant="contained"
                  color="primary"
                >
                  CANCEL
                </ButtonWithLoading>
              )}
            </div>
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
              {(this.state.tagdata.concat(this.state.customtagdata) || []).map((tag, index) => {
                if (index > 3) {
                  return (
                    <div className="filterItem" key={tag}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={tag}
                            color="primary"
                            checked={this.state.tagtoggled[index]}
                            onChange={() => this.onSelectTag(index)}
                          />
                        }
                        label={tag}
                      />
                    </div>
                  );
                }
              })}
            </CheckboxoxList>
          </Popover>

          <ClothesMenu>
            <Tabs defaultActiveKey="1" type="card" onChange={this.onSelectTab.bind(this)}>
              <TabPane tab="Hats" key="1">
                {(this.state.clothesimages || []).map((path, index) => {
                  if (!this.state.tagtoggled.includes(true)) {
                    return;
                  }
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata.concat(this.state.customtagdata)[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    //Get path from storageUrls and put it in src
                    for (let j = 0; j < this.state.storageUrls.length; j++) {
                      if (this.state.storageUrls[j].includes(path.split('/')[1])) {
                        return (
                          <img
                            className="clothingItem"
                            src={this.state.storageUrls[j]}
                            key={index}
                            onClick={() =>
                              this.setState({
                                selectedHat: this.state.storageUrls[j],
                                selectedHatID: this.state.clothesids[index],
                              })
                            }
                          />
                        );
                      }
                    }

                    return 'Should never see this message.';
                  }
                })}
              </TabPane>
              <TabPane tab="Pants" key="2">
                {(this.state.clothesimages || []).map((path, index) => {
                  if (!this.state.tagtoggled.includes(true)) {
                    return;
                  }
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata.concat(this.state.customtagdata)[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    //Get path from storageUrls and put it in src
                    for (let j = 0; j < this.state.storageUrls.length; j++) {
                      if (this.state.storageUrls[j].includes(path.split('/')[1])) {
                        return (
                          <img
                            className="clothingItem"
                            src={this.state.storageUrls[j]}
                            key={index}
                            onClick={() =>
                              this.setState({
                                selectedPants: this.state.storageUrls[j],
                                selectedPantsID: this.state.clothesids[index],
                              })
                            }
                          />
                        );
                      }
                    }

                    return 'Should never see this message.';
                  }
                })}
              </TabPane>
              <TabPane tab="Shirts" key="3">
                {(this.state.clothesimages || []).map((path, index) => {
                  if (!this.state.tagtoggled.includes(true)) {
                    return;
                  }
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata.concat(this.state.customtagdata)[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    //Get path from storageUrls and put it in src
                    for (let j = 0; j < this.state.storageUrls.length; j++) {
                      if (this.state.storageUrls[j].includes(path.split('/')[1])) {
                        return (
                          <img
                            className="clothingItem"
                            src={this.state.storageUrls[j]}
                            key={index}
                            onClick={() =>
                              this.setState({
                                selectedShirt: this.state.storageUrls[j],
                                selectedShirtID: this.state.clothesids[index],
                              })
                            }
                          />
                        );
                      }
                    }

                    return 'Should never see this message.';
                  }
                })}
              </TabPane>
              <TabPane tab="Shoes" key="4">
                {(this.state.clothesimages || []).map((path, index) => {
                  if (!this.state.tagtoggled.includes(true)) {
                    return;
                  }
                  let includesAllFilters = true;

                  for (let i = 0; i < this.state.tagtoggled.length; i++) {
                    if (this.state.tagtoggled[i]) {
                      if (
                        !this.state.clothescategories[index].includes(
                          this.state.tagdata.concat(this.state.customtagdata)[i].toLowerCase()
                        )
                      ) {
                        includesAllFilters = false;
                        break;
                      }
                    }
                  }

                  if (includesAllFilters) {
                    //Get path from storageUrls and put it in src
                    for (let j = 0; j < this.state.storageUrls.length; j++) {
                      if (this.state.storageUrls[j].includes(path.split('/')[1])) {
                        return (
                          <img
                            className="clothingItem"
                            src={this.state.storageUrls[j]}
                            key={index}
                            onClick={() =>
                              this.setState({
                                selectedShoes: this.state.storageUrls[j],
                                selectedShoesID: this.state.clothesids[index],
                              })
                            }
                          />
                        );
                      }
                    }

                    return 'Should never see this message.';
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
