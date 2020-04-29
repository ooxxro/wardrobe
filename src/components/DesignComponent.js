import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import intersection from 'lodash/intersection';
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
import { Tabs, message } from 'antd';

import { StoreContext } from '../stores';
import firebase from '../firebase';
import IOSSwitch from './IOSSwitch';
import SimpleDialog from './SimpleDialog';
import ButtonWithLoading from './ButtonWithLoading';

import { ReactComponent as UndoIcon } from '../images/undo.svg';
import { ReactComponent as LockIcon } from '../images/lock.svg';
import { ReactComponent as FilterIcon } from '../images/filter.svg';
import { ReactComponent as GoBackIcon } from '../images/goback.svg';
import { ReactComponent as EditPicIcon } from '../images/editpic.svg';
import designImg from '../images/design.svg';
import mannequinImg from '../images/mannequin.svg';
import ClothesFitter from './ClothesFitter';
import Loading from './Loading';
import { loadOneImg, downloadImg } from '../utils/image-processing';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: rgba(185, 185, 185, 0.2);
  position: relative;
  .content {
    display: flex;
    justify-content: center;
    padding: 50px 40px 55px;
  }
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

const Up = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 0 40px;
  margin-bottom: -30px;
  img {
    width: 44px;
    height: 44px;
  }
`;
const UpImgWrapper = styled.div``;
const Title = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 24px;
    font-weight: bold;
    color: #efefef;
    margin-left: 14px;
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
    margin-bottom: 40px;
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
  margin-bottom: 10px;
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
  position: relative;
  width: 300px;
  height: 400px;
  background: #e8dcdc;
  border-radius: 30px;
  overflow: hidden;
  padding: 60px 50px;
  .bgImg {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .mannequin {
    width: 100%;
    height: 100%;
  }
  .selected-clothes {
    position: absolute;
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
    margin-bottom: 40px;
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
  margin-top: 66px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  .undo {
    background: #f7d49e;
    margin-bottom: 12px;
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
  margin: 0 0 30px 25px;
  width: 380px;
  height: 500px;
  background: #cde6fe;
  border-radius: 20px;
  position: relative;
  padding-top: 60px;
  overflow: hidden;
  .filter {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #d8d0fc;
    border: 0.5px solid white;
    &:hover {
      background: #cbbfff;
    }
  }
`;
const CheckboxoxList = styled.div`
  padding: 6px;
  background: #d8d0fc;
  max-height: 300px;
  overflow: auto;
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
    display: flex;
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
  height: 100%;
  .ant-tabs-bar {
    padding-left: 14px;
    border-color: #fff;
  }
  .clothingItemWrapper {
    cursor: pointer;
    width: calc(50% - 20px);
    position: relative;
    margin: 10px;
    border: 2px solid #46a0fc;
    background: #fff;
    transition: all 0.3s ease;
    /* #fbe644; */
    &.selected {
      border: 2px solid #2962ff;
      box-shadow: 3px 3px 8px 1px #aabed1;
    }
    .clothingItem {
      padding-top: 100%;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
  .sc-pANHa {
    height: 100%;
  }
  .ant-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    .ant-tabs-tabpane {
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      /* padding: 0 8px 10px 10px; */
      padding: 16px;
      background: #fff;
    }
    .ant-tabs-content {
      overflow: auto;
      flex: 1;
      margin-top: -16px;
    }
  }
  .ant-tabs-tab {
    border-color: transparent;
    background: transparent;
  }
  /* .ant-tabs-tab-active {
    border-color: #fff;
    background: #fff;
  } */
  .ant-tabs-nav-container {
    margin: 0;
  }

  /* .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border:2px solid #55a8fc;
    &:hover { 
    }
  } */
`;

const categoryOrder = ['hats', 'shirts', 'pants', 'shoes'];
const categoryOrderReversed = categoryOrder.slice().reverse();
@withRouter
@observer
export default class DesignComponent extends React.Component {
  static contextType = StoreContext;

  state = {
    // UI state
    loading: false,
    lockPopoverOpen: false,
    filterPopoverOpen: false,
    dialogOpen: false,
    goBackDialogOpen: false,

    // data
    categories: {
      hats: [],
      shirts: [],
      pants: [],
      shoes: [],
    },
    filteredCategories: {
      hats: [],
      shirts: [],
      pants: [],
      shoes: [],
    },
    tags: [],
    filteredTags: [],
    selectedClothes: [],
    locked: {
      hats: false,
      shirts: false,
      pants: false,
      shoes: false,
    },
    undos: [],

    //bg image
    bgImgEdit: false,
    bgImgLocation: null,
    bgImgUrl: null,
  };

  //Execute upon rendering the page
  componentDidMount() {
    this.getBg();
    this.getClothesData();
  }

  getBg = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;

    // Get Bg from firestore if there is one otherwise set img url to default
    let imageUrl = '';
    let db = firebase.firestore();
    let docRef = db.collection('users/' + uid + '/background').doc('image');

    docRef.get().then(doc => {
      if (doc.exists) {
        imageUrl = doc.data().url;
        this.setState({ bgImgUrl: imageUrl });
      }
    });
  };

  getClothesData = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const db = firebase.firestore();

    db.collection('users')
      .doc(uid)
      .collection('clothes')
      .get()
      .then(querySnapshot => {
        const categories = {
          hats: [],
          shirts: [],
          pants: [],
          shoes: [],
        };
        const tagSet = new Set();
        querySnapshot.forEach(doc => {
          const c = doc.data();
          categories[c.category].push({
            id: doc.id,
            ...c,
          });
          // add tag to tags Set
          c.tags.forEach(tag => tagSet.add(tag));
        });

        const tags = [...tagSet];
        tags.sort();

        this.setState(
          {
            categories,
            tags,
          },
          () => {
            // also need to update filtered result
            this.updateFiltered();
          }
        );
      });
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

  deleteBackground = () => {
    const { userStore } = this.context;

    // TODO: delete old background file too
    // let storageRef = firebase.storage().ref();

    let db = firebase.firestore();
    let docRef = db.collection('users/' + userStore.currentUser.uid + '/background').doc('image');

    docRef
      .delete()
      .then(() => {
        message.success('Background deleted successfully!');
        this.setState({ bgImgEdit: false, bgImgLocation: null, bgImgUrl: null });
      })
      .catch(error => {
        // Handle Errors here.
        message.error(error.message);
      });
  };

  // apply filter to all clothes in categories and save to filteredCategories
  // call this method everytime filteredTags changes
  updateFiltered = () => {
    const { categories, filteredTags } = this.state;
    if (filteredTags.length === 0) {
      // no filters
      this.setState({ filteredCategories: categories });
    } else {
      const filteredCategories = {};
      Object.keys(categories).forEach(category => {
        // filter by all tags in filteredTags:
        // the intersection needs to be the same length
        filteredCategories[category] = categories[category].filter(
          c => intersection(c.tags, filteredTags).length === filteredTags.length
        );
      });

      this.setState({ filteredCategories });
    }
  };

  onSelectTag = (tag, checked) => {
    // shallow clone filteredTags array
    const filteredTags = [...this.state.filteredTags];
    if (checked) {
      filteredTags.push(tag);
    } else {
      const index = filteredTags.indexOf(tag);
      if (index >= 0) filteredTags.splice(index, 1);
    }

    this.setState({ filteredTags }, () => {
      this.updateFiltered();
    });
  };

  onSelectClothes = clothes => {
    // TODO set limit for undo list
    const clonedForUndo = [...this.state.selectedClothes];
    const selectedClothes = [...this.state.selectedClothes].filter(
      c => c.category !== clothes.category
    );

    if (!this.state.selectedClothes.some(c => c.id === clothes.id)) {
      // was not selected
      selectedClothes.push(clothes);
    }

    this.setState({ selectedClothes, undos: [...this.state.undos, clonedForUndo] });
  };

  onRandomClick = () => {
    const clonedForUndo = [...this.state.selectedClothes];
    const { selectedClothes, filteredCategories, locked } = this.state;
    // first remove all non-locked categories, becuase will be filled in new one
    const clonedSelectedClothes = [...selectedClothes].filter(c => locked[c.category]);

    // from shoes up to hat
    categoryOrderReversed.forEach(category => {
      if (locked[category] || filteredCategories[category].length === 0) return;

      const index = Math.floor(Math.random() * filteredCategories[category].length);
      clonedSelectedClothes.push(filteredCategories[category][index]);
    });

    this.setState({
      selectedClothes: clonedSelectedClothes,
      undos: [...this.state.undos, clonedForUndo],
    });
  };

  onUndo = () => {
    // TODO: disable button
    if (this.state.undos.length === 0) return;
    const undos = [...this.state.undos];
    const last = undos.pop();
    this.setState({ selectedClothes: last, undos });
  };

  /**
   * type can be 'file' or 'dataURL
   */
  generateImg = (type = 'dataURL') => {
    // TODO mannequin is svg, size is wrong
    const svgString = `
      <svg width="200" height="280" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.37 444.37">
        <defs/>
        <g fill="none" stroke="#707070" stroke-width="2">
          <g transform="translate(20.63)">
            <ellipse cx="43" cy="46" stroke="none" rx="43" ry="46"/>
            <ellipse cx="43" cy="46" rx="42" ry="45"/>
          </g>
          <path d="M50.27 91.72s2.69 6.52-11.56 10.48-15.57 3.54-22.98 8.51-12.85 15.23-14.34 33.8 2.87 57.77 3.45 62.64 5.46 47.12 6.93 58.53 2.97 15.1 4.45 18.96 4.54 6.48 7.42 6.3 4.41-5.49 4.41-5.49"/>
          <path d="M25.78 234.18l5.51 119.7 3.51 80.18s-.05 4.34 2.15 6.81 7.8 2.5 7.8 2.5a12.92 12.92 0 007.25-2.5c2.97-2.47 3.04-6.8 3.04-6.8l8.54-138.88M22.63 145.95c1.36 81.53-2.82 87.32 11.76 88.15s30.1 1 30.1 1M77.1 91.72s-2.69 6.52 11.56 10.48 15.57 3.54 22.98 8.51 12.85 15.23 14.34 33.8-2.87 57.77-3.45 62.64-5.46 47.12-6.93 58.53-2.97 15.1-4.45 18.96-4.54 6.48-7.43 6.3-4.4-5.49-4.4-5.49"/>
          <path d="M101.6 234.18l-5.52 119.7-3.51 80.18s.05 4.34-2.15 6.81-7.8 2.5-7.8 2.5a12.92 12.92 0 01-7.25-2.5c-2.97-2.47-3.04-6.8-3.04-6.8L63.8 295.18M104.74 145.95c-1.36 81.53 2.82 87.32-11.76 88.15s-28.81 1-28.81 1"/>
        </g>
      </svg>
    `;
    const svgDataURL = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgString);
    // const bgP = loadOneImg(`${location.protocol}//${location.host}${mannequinImg}`);
    const bgP = loadOneImg(svgDataURL);
    const imgsP = this.state.selectedClothes.map(c => loadOneImg(c.url));
    return Promise.all([bgP, ...imgsP]).then(([bg, ...imgs]) => {
      const canvas = document.createElement('canvas');
      canvas.width = ClothesFitter.WIDTH * 2;
      canvas.height = ClothesFitter.HEIGHT * 2;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#e8dcdc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw bg
      ctx.drawImage(
        bg,
        0,
        0,
        bg.width,
        bg.height,
        50 * 2,
        60 * 2,
        canvas.width - 50 * 2 * 2,
        canvas.height - 60 * 2 * 2
      );

      // draw imgs
      imgs.forEach((img, i) => {
        const { fit } = this.state.selectedClothes[i];
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          (fit.x * canvas.width) / 100,
          (fit.y * canvas.height) / 100,
          (fit.width * canvas.width) / 100,
          (fit.height * canvas.height) / 100
        );
      });

      // read from canvas to png image file
      let dataURL = canvas.toDataURL('image/png');
      if (type === 'dataURL') return dataURL;

      // https://stackoverflow.com/a/43358515/12017013
      let arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], 'wardrobe-download.png', { type: mime });
    });
  };

  onDownload = async () => {
    const dataURL = await this.generateImg('dataURL');

    downloadImg(dataURL, 'wardrobe-download.png');
  };

  saveToFavorites = async () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const { loading, selectedClothes } = this.state;
    const { history } = this.props;

    if (loading) return;

    this.setState({ loading: true });

    const file = await this.generateImg('file');

    const db = firebase.firestore();
    const timestamp = new Date();
    const userRef = db.collection('users').doc(uid);

    // we need to write clothes, categories, tags, etc. in "batch" atomically
    const batch = db.batch();

    // generate new ref id for clothes
    const outfitsRef = userRef.collection('outfits').doc();
    const outfitsId = outfitsRef.id;

    // upload image to storage at /<uid>/outfits/<outfitsId>.png
    const storagePath = `${uid}/outfits/${outfitsId}.png`;
    const task = firebase
      .storage()
      .ref(storagePath)
      .put(file);

    task
      .then(() => task.snapshot.ref.getDownloadURL())
      .then(url => {
        //merge tags
        let tags = new Set();
        selectedClothes.forEach(c => {
          c.tags.forEach(tag => tags.add(tag));
        });
        tags = [...tags];

        // firestore outfits data
        const outfitsData = {
          createdAt: timestamp,
          updatedAt: timestamp,
          tags,
          storagePath,
          url,
          clothes: selectedClothes.map(c => ({ id: c.id })),
        };

        batch.set(outfitsRef, outfitsData);

        // tags data
        tags.forEach(tag => {
          const tagsRef = userRef.collection('tags').doc(tag);
          batch.set(
            tagsRef,
            { outfits: firebase.firestore.FieldValue.arrayUnion({ id: outfitsId, url }) },
            { merge: true }
          );
        });

        return batch.commit();
      })
      .then(() => {
        // this.setState({ loading: false, dialogOpen: false });
        history.push(`/my-favorites/${outfitsId}`);
      })
      .catch(err => {
        this.setState({ loading: false, dialogOpen: false });
        message.error(`Error while saving outfit: ${err.message}`);
      });
  };

  render() {
    const { from } = this.props;
    const {
      loading,
      lockPopoverOpen,
      filterPopoverOpen,
      dialogOpen,
      goBackDialogOpen,
      tags,
      filteredTags,
      filteredCategories,
      locked,
      selectedClothes,
      bgImgEdit,
      bgImgUrl,
    } = this.state;

    let buttonsZone;
    if (from === 'design') {
      buttonsZone = [
        { text: 'Download', onClick: this.onDownload },
        { text: 'Save to My Favorites', onClick: this.saveToFavorites },
        { text: 'Exit without Saving', exit: true, onClick: () => this.props.history.push('/') },
      ];
    } else {
      buttonsZone = [
        { text: 'Download', onClick: this.onDownload },
        { text: 'Save to Current', onClick: () => {} },
        { text: 'Save as New', onClick: this.saveToFavorites },
        { text: 'Exit without Saving', exit: true, onClick: () => this.props.history.push('/') },
      ];
    }

    return (
      <Wrapper>
        <Loading loading={loading} />
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

        {from === 'design' && (
          <Up>
            <Title>
              <UpImgWrapper>
                <img src={designImg} />
              </UpImgWrapper>
              <span>Design</span>
            </Title>
          </Up>
        )}
        <div className="content">
          <Random>
            <Button className="random" variant="contained" onClick={this.onRandomClick}>
              Random
            </Button>
          </Random>
          <Picture>
            <ImgWrapper style={bgImgUrl ? { padding: 0 } : null}>
              {bgImgUrl ? (
                <img key="bgImg" className="bgImg" src={bgImgUrl} draggable={false} />
              ) : (
                <img key="mannequin" className="mannequin" src={mannequinImg} draggable={false} />
              )}
              {selectedClothes.map(clothes => (
                <img
                  key={clothes.id}
                  className="selected-clothes"
                  src={clothes.url}
                  style={{
                    top: `${clothes.fit.y}%`,
                    left: `${clothes.fit.x}%`,
                    width: `${clothes.fit.width}%`,
                    height: `${clothes.fit.height}%`,
                  }}
                />
              ))}
              <EditPic>
                <Tooltip arrow title="Change background" TransitionComponent={Zoom} placement="top">
                  <IconButton
                    className="editPic"
                    size="small"
                    onClick={() => this.setState(state => ({ bgImgEdit: !state.bgImgEdit }))}
                  >
                    <SvgIcon fontSize="inherit">
                      <EditPicIcon />
                    </SvgIcon>
                  </IconButton>
                </Tooltip>
                <div className="changeBackground">
                  <form className="editBgImgForm" style={{ display: bgImgEdit ? 'block' : 'none' }}>
                    <br />
                    <label>Upload New Background Image</label> <br></br>
                    <input
                      type="file"
                      accept="image/*"
                      id="bgImgLocation"
                      name="bgImgLocation"
                      placeholder="New Background"
                      onChange={event => this.setState({ bgImgLocation: event.target.files[0] })}
                      value={this.state.image}
                    ></input>
                    <label htmlFor="file"></label>
                  </form>
                  {bgImgEdit && (
                    <>
                      <ButtonWithLoading
                        onClick={this.changeBackground}
                        className="card1Btn"
                        variant="contained"
                        color="primary"
                      >
                        SAVE
                      </ButtonWithLoading>
                      <ButtonWithLoading
                        onClick={this.deleteBackground}
                        className="card1Btn"
                        variant="contained"
                        color="primary"
                        disabled={!bgImgUrl}
                      >
                        Delete
                      </ButtonWithLoading>
                      <ButtonWithLoading
                        onClick={() => this.setState({ bgImgEdit: false })}
                        className="card1Btn"
                        variant="contained"
                        color="primary"
                      >
                        CANCEL
                      </ButtonWithLoading>
                    </>
                  )}
                </div>
              </EditPic>
            </ImgWrapper>
          </Picture>
          <IconCol>
            <UpperIcon>
              <Tooltip arrow title="Undo" TransitionComponent={Zoom} placement="top">
                <IconButton className="undo" onClick={this.onUndo}>
                  <SvgIcon fontSize="small">
                    <UndoIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
              <Tooltip arrow title="Lock categories" TransitionComponent={Zoom} placement="top">
                <IconButton
                  ref={el => (this.lockBtnRef = el)}
                  className="lock"
                  onClick={() => this.setState({ lockPopoverOpen: true })}
                >
                  <SvgIcon fontSize="small">
                    <LockIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
              <Popover
                open={lockPopoverOpen}
                anchorEl={this.lockBtnRef}
                onClose={() => this.setState({ lockPopoverOpen: false })}
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
                  {categoryOrder.map(category => (
                    <div className="lockItem" key={category}>
                      <IOSSwitch
                        name={category}
                        checked={locked[category]}
                        onChange={e =>
                          this.setState({ locked: { ...locked, [category]: e.target.checked } })
                        }
                      />
                      {category}
                    </div>
                  ))}
                </Lock>
              </Popover>
            </UpperIcon>

            <Save>
              {from === 'design' ? (
                <Button
                  className="save"
                  variant="contained"
                  onClick={() => this.setState({ dialogOpen: true })}
                >
                  Save
                </Button>
              ) : (
                <Button
                  className="save"
                  variant="contained"
                  onClick={() => this.setState({ dialogOpen: true })}
                >
                  Done
                </Button>
              )}
            </Save>
          </IconCol>
          <ChooseClothes>
            <Tooltip arrow title="Filter tags" TransitionComponent={Zoom} placement="top">
              <IconButton
                className="filter"
                ref={el => (this.filterBtnRef = el)}
                onClick={() => {
                  this.setState({ filterPopoverOpen: true });
                }}
              >
                <SvgIcon fontSize="small">
                  <FilterIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Popover
              open={filterPopoverOpen}
              anchorEl={this.filterBtnRef}
              onClose={() => this.setState({ filterPopoverOpen: false })}
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
                {tags.map(tag => (
                  <div className="filterItem" key={tag}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={tag}
                          color="primary"
                          checked={filteredTags.includes(tag)}
                          onChange={e => this.onSelectTag(tag, e.target.checked)}
                        />
                      }
                      label={tag}
                    />
                  </div>
                ))}
              </CheckboxoxList>
            </Popover>

            <ClothesMenu>
              <Tabs defaultActiveKey="shirts" type="card">
                {/* loop over all categories to display tab */}
                {categoryOrder.map(category => (
                  <TabPane className="tabTitle" tab={category} key={category}>
                    {filteredCategories[category].map((clothes, i) => (
                      <div
                        className={`clothingItemWrapper ${
                          selectedClothes.some(c => clothes.id === c.id) ? 'selected' : ''
                        }`}
                        key={i}
                        onClick={() => this.onSelectClothes(clothes)}
                      >
                        <div className="clothingItem">
                          <img src={clothes.url} />
                        </div>
                      </div>
                    ))}
                  </TabPane>
                ))}
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
            buttons={[
              { text: 'Cancel, Continue Editing', onClick: () => {} },
              { text: 'Exit without Saving', exit: true, onClick: () => {} },
            ]}
            onClose={() => this.setState({ goBackDialogOpen: false })}
          />
        </div>
      </Wrapper>
    );
  }
}
