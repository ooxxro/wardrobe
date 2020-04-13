import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import intersection from 'lodash/intersection';

import { Button, Popover, FormControlLabel, Checkbox, Tooltip, Zoom } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import firebase from '../firebase';
import IOSSwitch from './IOSSwitch';
import SimpleDialog from './SimpleDialog';
import ProgressBar from './ProgressBar';
import ClothesFitter from './ClothesFitter';

import filterImg from '../images/filter.svg';
import mannequinImg from '../images/mannequin.svg';
import lockImg from '../images/lock.svg';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: rgba(185, 185, 185, 0.2);
  padding: 0px 40px;
`;
const Up = styled.div`
  padding-top: 20px;
  font-size: 30px;
  font-family: 'Gaegu', cursive;
  color: #fff;
`;

const Down = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 35px;
  /* overflow: hidden; */
`;
const Left = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 80px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .filter {
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #cbbfff;
    border-radius: 19px;
    padding: 7px 16px;
    font-size: 14px;
    color: #212121;
    &:hover {
      background: #c0b2ff;
      color: #212121;
    }
  }
  .random {
    padding: 0;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #8ff2b8;
    border-radius: 50%;
    /* padding: 44px 20px; */
    width: 100px;
    height: 100px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    line-height: 100px;
    color: #212121;
    &:hover {
      background: #75eda7;
      color: #212121;
    }
  }
`;

const CheckboxoxList = styled.div`
  padding: 0 6px;
  background: #d8d0fc;
  position: relative;
  .filterIcon {
    display: flex;
    justify-content: center;
    padding: 11px 0 5px;
    img {
      width: 22px;
      height: 22px;
    }
  }
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
  .help {
    cursor: pointer;
    padding: 3px;
    width: 22px;
    height: 22px;
    color: #656565;
    position: absolute;
    top: 2px;
    right: 2px;
  }
`;

const Middle = styled.div`
  padding-bottom: 10px;
`;
const ImgWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
  background: #e8dcdc;
  border-radius: 30px;
  overflow: hidden;
  padding: 60px 50px;
  .mannequin {
    width: 100%;
    height: 100%;
  }
  .selected-clothes {
    position: absolute;
  }
`;
const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  margin-left: 80px;
  .done {
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #aef0f7;
    border-radius: 21px;
    padding: 7px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #212121;
    &:hover {
      background: #95f5ff;
      color: #212121;
    }
  }
`;
const Lock = styled.div`
  background: #fecdda;
  padding: 6px;
  border-radius: 10px;
  margin-bottom: 86px;
  .lock {
    text-align: center;
    padding: 5px;
    img {
      width: 20px;
      height: 20px;
    }
  }
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

const categoryOrder = ['hats', 'shirts', 'pants', 'shoes'];
const categoryOrderReversed = categoryOrder.slice().reverse();
@withRouter
@observer
export default class Random extends React.Component {
  static contextType = StoreContext;

  state = {
    timer: 0,
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
    // filter
    filterPopoverOpen: false,

    // dialogs
    doneDialogOpen: false,
  };

  componentDidMount() {
    this.getClothesData();
    // setup timer
    this.setTimer();
  }

  componentWillUnmount() {
    // destroy timer
    this.clearTimer();
  }

  setTimer = () => {
    this.clearTimer();
    this.setState({ timer: 0 });
    this.interval = setInterval(() => {
      if (this.state.timer >= 180) {
        this.clearTimer();
        this.setState({ doneDialogOpen: true });
      } else {
        this.setState(state => ({ timer: state.timer + 1 }));
      }
    }, 1000);
  };

  clearTimer = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
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

  onRandomClick = () => {
    const { selectedClothes, filteredCategories, locked } = this.state;
    // first remove all non-locked categories, becuase will be filled in new one
    const clonedSelectedClothes = [...selectedClothes].filter(c => locked[c.category]);

    // from shoes up to hat
    categoryOrderReversed.forEach(category => {
      if (locked[category] || filteredCategories[category].length === 0) return;

      const index = Math.floor(Math.random() * filteredCategories[category].length);
      clonedSelectedClothes.push(filteredCategories[category][index]);
    });

    this.setState({ selectedClothes: clonedSelectedClothes });
  };

  loadOneImg = src => {
    return new Promise((resolve, reject) => {
      // load original image
      let img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        resolve(img);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = src;
    });
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
    // const bgP = this.loadOneImg(`${location.protocol}//${location.host}${mannequinImg}`);
    const bgP = this.loadOneImg(svgDataURL);
    const imgsP = this.state.selectedClothes.map(c => this.loadOneImg(c.url));
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
    const link = document.createElement('a');
    link.download = 'wardrobe-download.png';
    link.href = dataURL;
    link.click();
  };

  render() {
    const {
      filterPopoverOpen,
      tags,
      filteredTags,
      locked,
      selectedClothes,
      doneDialogOpen,
    } = this.state;

    let buttonsZone = [
      { text: 'Download', onClick: this.onDownload },
      { text: 'Save to My Favorites', onClick: () => {} },
      // { text: 'Go to Design', onClick: () => {} }, // TODO
      { text: 'Exit without Saving', exit: true, onClick: () => this.props.history.push('/') },
    ];

    return (
      <Wrapper>
        <Up>
          <span>Create your outfit within 3 mins! Go Go!</span>
          <ProgressBar percent={(this.state.timer / 180) * 100} />
        </Up>
        <Down>
          <Left>
            <Button
              className="filter"
              variant="contained"
              ref={el => (this.filterBtnRef = el)}
              onClick={() => this.setState({ filterPopoverOpen: true })}
            >
              <img src={filterImg} />
              Filter
            </Button>
            <Popover
              open={filterPopoverOpen}
              anchorEl={this.filterBtnRef}
              onClose={() => this.setState({ filterPopoverOpen: false })}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              style={{
                maxHeight: 300,
              }}
            >
              {/* show all user defined tags */}
              <CheckboxoxList>
                <div className="filterIcon">
                  <img src={filterImg} />
                </div>
                <Tooltip
                  arrow
                  title="Toggle filters to restrict Random from choosing in these categories."
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <HelpOutlineIcon className="help" />
                </Tooltip>
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

            <Button className="random" variant="contained" onClick={this.onRandomClick}>
              Random
            </Button>
          </Left>
          <Middle>
            <ImgWrapper>
              <img key="mannequin" className="mannequin" src={mannequinImg} draggable={false} />
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
            </ImgWrapper>
          </Middle>
          <Right>
            <Lock>
              <div className="lock">
                <img src={lockImg} />
              </div>

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
            <Button
              className="done"
              variant="contained"
              onClick={() => this.setState({ doneDialogOpen: true })}
            >
              Done
            </Button>
          </Right>
        </Down>

        <SimpleDialog
          open={doneDialogOpen}
          type="success"
          buttons={buttonsZone}
          onClose={() => this.setState({ doneDialogOpen: false })}
        />
      </Wrapper>
    );
  }
}
