import React from 'react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import intersection from 'lodash/intersection';
import {
  Button,
  Zoom,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Popover,
  IconButton,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { message } from 'antd';

import { StoreContext } from '../stores';
import { loadOneImg, downloadImg, img2dataURL } from '../utils/image-processing';
import firebase from '../firebase';
import heartImg from '../images/heart.svg';
import filterImg from '../images/filter.svg';
import SimpleDialog from './SimpleDialog';
import Loading from './Loading';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: #e0ddf3;
  padding: 0px 40px 50px;
`;

const Up = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 0 10px;
  img {
    width: 50px;
    height: 50px;
  }
`;
const UpImgWrapper = styled.div``;
const Title = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 24px;
    font-weight: bold;
    color: #212121;
    margin-left: 14px;
  }
`;

const Down = styled.div`
  .filter {
    margin: 2px 0 6px 124px;
    text-transform: capitalize;
    background: #cbbfff;
    border-radius: 3px;
    padding: 7px 16px;
    font-size: 14px;
    color: #212121;
    &:hover {
      background: #c0b2ff;
      color: #212121;
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
`;

const Content = styled.div`
  padding: 0 110px 10px;
  min-height: 400px;
  position: relative;
  img {
    width: 150px;
    height: 200px;
    margin: 20px 10px;
    cursor: pointer;
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CheckboxoxList = styled.div`
  padding: 0 6px;
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
    margin: 0;
  }
  .MuiSvgIcon-root {
    color: #7d64e1;
  }
`;

const LightboxBottom = styled.div`
  width: 100vw;
  margin: -10px -20px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .lightbox-menubar-button {
    color: #fff;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
`;

const Info = styled.div`
  padding: 1rem;
  font-size: 16px;
  line-height: 1.4;
  font-weight: normal;
  .label {
    color: #ddd;
    margin-top: 0.5rem;
  }
  .value {
  }
`;

@withRouter
@observer
export default class MyFavorites extends React.Component {
  static contextType = StoreContext;
  state = {
    dataLoading: true,
    loading: false,
    turnon: false,
    deleteDialogOpen: false,

    tags: [],
    outfits: [],
    filteredTags: [],
    filteredOutfits: [],

    // lightbox
    isOpen: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;

    this.setState({ dataLoading: true });

    const db = firebase.firestore();
    return db
      .collection('users')
      .doc(uid)
      .collection('outfits')
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        const tagSet = new Set();
        const outfits = [];
        querySnapshot.forEach(doc => {
          const outfit = doc.data();
          outfits.push({
            id: doc.id,
            ...outfit,
            createdAt: outfit.createdAt.toDate(),
            updatedAt: outfit.updatedAt.toDate(),
          });
          // add tag to tags Set
          outfit.tags.forEach(tag => tagSet.add(tag));
        });

        const tags = [...tagSet];
        tags.sort();

        this.setState(
          {
            dataLoading: false,
            outfits,
            tags,
          },
          () => {
            // also need to update filtered result
            this.updateFiltered();
          }
        );
      })
      .catch(error => {
        this.setState({ dataLoading: false });
        message.error(error.message);
      });
  };

  // apply filter to all outfits and save to filteredOutfits
  // call this method everytime filteredTags changes
  updateFiltered = () => {
    const { outfitId } = this.props.match.params;
    const { outfits, filteredTags } = this.state;
    const filteredOutfits = outfits.filter(outfit => {
      if (filteredTags.length === 0) return true; // no filters
      // filter by all tags in filteredTags:
      // the intersection needs to be the same length
      return intersection(outfit.tags, filteredTags).length === filteredTags.length;
    });

    const photoIndex = filteredOutfits.findIndex(outfit => outfit.id === outfitId);
    this.setState({ filteredOutfits, isOpen: photoIndex !== -1 });
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

  onDownload = async url => {
    const img = await loadOneImg(url);
    const dataURL = img2dataURL(img);
    downloadImg(dataURL, 'wardrobe-download.png');
  };

  deleteOutfit = async outfit => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const { loading } = this.state;
    const { history } = this.props;

    if (loading) return;

    this.setState({ loading: true });

    const db = firebase.firestore();
    const userRef = db.collection('users').doc(uid);

    // we need to write clothes, categories, tags, etc. in "batch" atomically
    const batch = db.batch();

    const outfitsRef = userRef.collection('outfits').doc(outfit.id);

    batch.delete(outfitsRef);

    outfit.tags.forEach(tag => {
      const tagsRef = userRef.collection('tags').doc(tag);
      batch.set(
        tagsRef,
        { outfits: firebase.firestore.FieldValue.arrayRemove({ id: outfit.id, url: outfit.url }) },
        { merge: true }
      );
    });

    const firestorePromise = batch.commit();

    const storagePromise = firebase
      .storage()
      .ref(outfit.storagePath)
      .delete();

    Promise.all([firestorePromise, storagePromise])
      .then(() => {
        this.setState({ loading: false, deleteDialogOpen: false, isOpen: false });
        this.getData();

        history.replace(`/my-favorites`);
      })
      .catch(err => {
        this.setState({ loading: false, deleteDialogOpen: false });
        message.error(`Error while deleting outfit: ${err.message}`);
      });
  };

  render() {
    const { history } = this.props;
    const { outfitId } = this.props.match.params;
    const {
      dataLoading,
      loading,
      isOpen,
      filteredOutfits,
      tags,
      filteredTags,
      deleteDialogOpen,
    } = this.state;

    const up = (
      <Up>
        <Title>
          <UpImgWrapper>
            <img src={heartImg} />
          </UpImgWrapper>
          <span>My favorites</span>
        </Title>
      </Up>
    );

    const photoIndex = filteredOutfits.findIndex(outfit => outfit.id === outfitId);
    if (!dataLoading && outfitId && photoIndex === -1) {
      return (
        <Wrapper>
          {up}
          <Down>
            <Content style={{ paddingTop: '2rem', textAlign: 'center' }}>
              <h2>Outfit ID: {outfitId} Not Found</h2>
              <Link to="/my-favorites">Back to all outfits</Link>
            </Content>
          </Down>
        </Wrapper>
      );
    }
    const outfit = filteredOutfits[photoIndex];

    return (
      <Wrapper>
        <Loading loading={loading} />

        {up}

        <Down>
          {/* filter */}
          <Tooltip
            interactive
            arrow
            title="Filter categories"
            TransitionComponent={Zoom}
            placement="top"
          >
            <Button
              className="filter"
              variant="contained"
              ref={el => (this.filterBtnRef = el)}
              onClick={() => this.setState({ turnon: true })}
            >
              <img src={filterImg} />
              Filter
            </Button>
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
          <Content>
            <div className="loading">
              <Loading loading={dataLoading} backdrop={false} />
            </div>

            {filteredOutfits.map((outfit, i) => (
              <img
                key={i}
                src={outfit.url}
                onClick={() => {
                  history.push(`/my-favorites/${outfit.id}`);
                  this.setState({ isOpen: true });
                }}
              />
            ))}
          </Content>
        </Down>

        {isOpen && (
          <Lightbox
            clickOutsideToClose={false}
            mainSrc={outfit.url}
            nextSrc={
              photoIndex < filteredOutfits.length - 1
                ? filteredOutfits[photoIndex + 1].url
                : undefined
            }
            imageCaption={
              <LightboxBottom>
                <Tooltip
                  interactive
                  arrow
                  title="Download"
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <IconButton
                    className="lightbox-menubar-button"
                    onClick={() => this.onDownload(outfit.url)}
                  >
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  interactive
                  arrow
                  title="Edit this outfit in design page"
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <IconButton
                    className="lightbox-menubar-button"
                    onClick={() => history.push(`/my-favorites/${outfit.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  interactive
                  arrow
                  title="Delete this outfit"
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <IconButton
                    className="lightbox-menubar-button"
                    onClick={() => this.setState({ deleteDialogOpen: true })}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  interactive
                  arrow
                  title={
                    <Info>
                      <div className="label">Date added:</div>
                      <div className="value">
                        {outfit.createdAt && outfit.createdAt.toLocaleString()}
                      </div>
                      <div className="label">Date modified:</div>
                      <div className="value">
                        {outfit.updatedAt && outfit.updatedAt.toLocaleString()}
                      </div>
                    </Info>
                  }
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <IconButton className="lightbox-menubar-button">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </LightboxBottom>
            }
            prevSrc={photoIndex > 0 ? filteredOutfits[photoIndex - 1].url : undefined}
            onCloseRequest={() => {
              this.setState({ isOpen: false });
              history.push('/my-favorites');
            }}
            onMovePrevRequest={() => {
              if (photoIndex <= 0) return;
              history.push(`/my-favorites/${filteredOutfits[photoIndex - 1].id}`);
            }}
            onMoveNextRequest={() => {
              if (photoIndex >= filteredOutfits.length - 1) return;
              history.push(`/my-favorites/${filteredOutfits[photoIndex + 1].id}`);
            }}
          />
        )}

        {/* delete outfit confirm dialog */}
        <SimpleDialog
          open={deleteDialogOpen}
          type="warning"
          description={
            <span>
              Are you sure
              <br />
              you want to delete this outfit?
            </span>
          }
          buttons={[
            {
              text: 'Yes',
              onClick: () => {
                this.setState({
                  deleteDialogOpen: false,
                });
                this.deleteOutfit(outfit);
              },
            },
            {
              text: 'Cancel',
              exit: true,
              onClick: () => this.setState({ deleteDialogOpen: false }),
            },
          ]}
          onClose={() => this.setState({ deleteDialogOpen: false })}
        />
      </Wrapper>
    );
  }
}
