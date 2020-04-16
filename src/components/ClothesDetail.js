import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { /*Link,*/ withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Button, SvgIcon, IconButton, Zoom, Tooltip } from '@material-ui/core';
import { message, Tag, Input, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import difference from 'lodash/difference';
import xor from 'lodash/xor';
import Loading from './Loading';
import firebase from '../firebase';
import SimpleDialog from './SimpleDialog';
import { ReactComponent as GoBackIcon } from '../images/goback.svg';
import { ReactComponent as EditIcon } from '../images/editpic.svg';
import { ReactComponent as DeleteIcon } from '../images/trashCan.svg';

const db = firebase.firestore();

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: #e9e9e9;
  padding: 10px 10px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  .backButton {
    background: #e3ddff;
    &:hover {
      background: #d7cffc;
    }
  }
  div {
    display: flex;
    .editButton,
    .deleteButton {
      background: #e3ddff;
      &:hover {
        background: #d7cffc;
      }
    }
    .deleteButton {
      margin-left: 14px;
    }
  }
`;
const Bottom = styled.div`
  margin-top: -10px;
  padding: 0 60px 40px;
  text-align: right;
  .backBtn {
    border-radius: 19px;
    padding: 7px 28px;
    background: #7d64e1;
    margin-bottom: 20px;
    color: #fff;
    &:hover {
      color: #fff;
      background-color: #775ce3;
    }
  }
`;

const ClothingContent = styled.div`
  display: flex;
  padding: 10px 100px 20px;
`;
const Left = styled.div`
  position: relative;
  margin-right: 70px;
  width: 300px;
  height: 400px;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    width: 300px;
    height: 400px;
    object-fit: contain;
  }
`;
const ImgWrapper = styled.div``;
const Right = styled.div`
  padding-top: 30px;
  h3 {
    font-size: 18px;
    margin: 0 auto 5px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
  }
  h4 {
    font-size: 16px;
    margin: 14px auto 2px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  .category {
    margin: 6px 0;
    border: 2px solid #46a0fc;
    border-radius: 5px;
    background: #46a0fc;
    color: #fff;
    width: 70px;
    height: 40px;
    font-size: 16px;
    line-height: 36px;
    text-align: center;
    font-weight: bold;
    text-transform: capitalize;
  }
  .radioBtn {
    margin: 6px 3px 6px 0;
    border: 2px solid #46a0fc;
    border-radius: 5px;
    background: #edf5ff;
    color: #212121;
    width: 90px;
    height: 40px;
    font-size: 16px;
    line-height: 36px;
    text-align: center;
    &:before {
      content: none;
    }
    &:hover {
      color: #2979ff;
      border: 2px solid #46a0fc;
    }
    &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      background: #46a0fc;
      color: #fff;
      border-color: #46a0fc;
      font-weight: bold;
    }
  }
  .tags {
    .ant-input {
      width: 120px;
      height: 40px;
      border-radius: 5px;
      padding: 8px 8px 8px 12px;
      font-size: 16px;
      margin: 6px;
    }
    .ant-tag {
      margin: 6px 6px 6px 0;
      display: inline-block;
      border-radius: 5px;
      font-size: 16px;
      &:hover {
        opacity: 1;
      }
    }
    .tag-style {
      color: #212121;
      background: #e3defe;
      padding: 8px 10px 8px 12px;
      border: 2px solid #9887e6;
      span {
        padding: 2px;
        margin-left: 10px;
        background: #7e69de;
        border-radius: 50%;
        svg {
          width: 12px;
          height: 12px;
          color: #fff;
        }
      }
    }
  }
  .new-tag {
    width: 120px;
    text-align: center;
    background: #feddde;
    border: 2px solid #f36d6f;
    padding: 8px 12px;
    color: #f36d6f;
    font-weight: bold;
    &:hover {
      background: #f36d6f;
      color: #fff;
      font-weight: bold;
    }
    span {
      margin-left: 0;
    }
  }
`;

@withRouter
@observer
export default class ClothesDetail extends React.Component {
  static contextType = StoreContext;

  state = {
    loading: false,
    clothes: null,
    isEdit: false,

    category: '',
    tags: [],
    tagsInputVisible: false,
    newTagValue: '',
    goBackDialogOpen: false,
    deleteDialogOpen: false,
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.clothesId !== prevProps.match.params.clothesId) {
      this.getData();
    }
  }

  getData = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const {
      match: {
        params: { clothesId },
      },
    } = this.props;

    this.setState({ loading: true });

    //fetch data from firebase
    db.collection('users')
      .doc(uid)
      .collection('clothes')
      .doc(clothesId)
      .get()
      .then(doc => {
        if (!doc.exists) throw new Error('Oops! clothes does not exist!');
        const data = doc.data();
        const clothes = {
          id: clothesId,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };

        this.setState({ clothes, loading: false, category: clothes.category, tags: clothes.tags });
      })
      .catch(error => {
        this.setState({ loading: false });
        message.error(error.message);
      });
  };

  onSave = () => {
    const { loading, clothes, category, tags } = this.state;
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    if (!this.hasModified()) {
      this.setState({ isEdit: false });
      return;
    }
    if (loading) return;
    this.setState({ loading: true });

    const batch = db.batch();

    // update clothes
    const clothesRef = db
      .collection('users')
      .doc(uid)
      .collection('clothes')
      .doc(clothes.id);
    batch.set(
      clothesRef,
      {
        category,
        updatedAt: new Date(),
        tags,
      },
      { merge: true }
    );

    // add new tags
    const newTags = difference(tags, clothes.tags);
    newTags.forEach(tag => {
      const tagRef = db
        .collection('users')
        .doc(uid)
        .collection('tags')
        .doc(tag);
      batch.set(
        tagRef,
        {
          clothes: firebase.firestore.FieldValue.arrayUnion({ id: clothes.id, url: clothes.url }),
        },
        { merge: true }
      );
    });

    // remove removed tags
    const removedTags = difference(clothes.tags, tags);
    removedTags.forEach(tag => {
      const tagRef = db
        .collection('users')
        .doc(uid)
        .collection('tags')
        .doc(tag);
      batch.set(
        tagRef,
        {
          clothes: firebase.firestore.FieldValue.arrayRemove({ id: clothes.id, url: clothes.url }),
        },
        { merge: true }
      );
    });

    batch
      .commit()
      .then(() => {
        this.setState({ loading: false, isEdit: false });
        this.getData();
      })
      .catch(err => {
        this.setState({ loading: false });
        message.error(`Error while saving: ${err.message}`);
      });
  };

  hasModified = () => {
    const { clothes, category, tags } = this.state;

    if (clothes.category !== category) return true;
    if (xor(clothes.tags, tags).length > 0) return true;

    return false;
  };

  deleteClothes = () => {
    const {
      userStore: {
        currentUser: { uid },
      },
    } = this.context;
    const {
      match: {
        params: { clothesId },
      },
    } = this.props;
    const { clothes } = this.state;

    this.setState({ loading: true });

    const userRef = db.collection('users').doc(uid);
    const batch = db.batch();
    // delete clothes document
    const clothesRef = userRef.collection('clothes').doc(clothesId);
    batch.delete(clothesRef);

    clothes.tags.forEach(tag => {
      const tagsRef = userRef.collection('tags').doc(tag);
      batch.set(
        tagsRef,
        { clothes: firebase.firestore.FieldValue.arrayRemove({ id: clothesId, url: clothes.url }) },
        { merge: true }
      );
    });
    const firestorePromise = batch.commit();

    // firestore
    const storagePromise = firebase
      .storage()
      .ref(clothes.storagePath)
      .delete();

    Promise.all([firestorePromise, storagePromise])
      .then(() => {
        this.setState({ loading: false });
        this.props.history.goBack();
      })
      .catch(err => {
        this.setState({ loading: false });
        message.error(`Error while saving: ${err.message}`);
      });
  };

  onRemoveTag = tag => {
    const tags = this.state.tags.filter(t => t !== tag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState(
      { tagsInputVisible: true },
      () => this.newTagInputRef && this.newTagInputRef.focus()
    );
  };

  addTag = () => {
    const { newTagValue, tags } = this.state;

    if (!newTagValue.trim()) return;

    // TODO: limit tag to use as firebase document ID
    if (tags.includes(newTagValue.trim())) {
      message.warn('Tag already exists!');
    } else {
      this.setState({
        tags: [...tags, newTagValue],
      });
    }
    // clear input
    this.setState({ newTagValue: '' }, () => this.newTagInputRef && this.newTagInputRef.focus());
  };

  render() {
    const {
      loading,
      clothes,
      isEdit,
      tags,
      category,
      tagsInputVisible,
      newTagValue,
      goBackDialogOpen,
      deleteDialogOpen,
    } = this.state;

    return (
      <Wrapper>
        <Top>
          <Tooltip arrow title="Go back" TransitionComponent={Zoom} placement="top">
            <IconButton
              className="backButton"
              onClick={() => {
                if (isEdit) {
                  if (this.hasModified()) this.setState({ goBackDialogOpen: true });
                  else this.setState({ isEdit: false });
                } else {
                  this.props.history.goBack();
                }
              }}
            >
              <SvgIcon fontSize="small">
                <GoBackIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>

          <div>
            {!isEdit && (
              <Tooltip arrow title="Edit clothes" TransitionComponent={Zoom} placement="top">
                <IconButton
                  className="editButton"
                  onClick={() => this.setState({ isEdit: true })}
                  style={{ display: this.state.isEdit ? 'none' : 'block' }}
                >
                  <SvgIcon fontSize="small">
                    <EditIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip arrow title="Delete clothes" TransitionComponent={Zoom} placement="top">
              <IconButton
                className="deleteButton"
                onClick={() => this.setState({ deleteDialogOpen: true })}
              >
                <SvgIcon fontSize="small">
                  <DeleteIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </div>
        </Top>

        {!loading && !clothes && <div>Clothes Not Found</div>}

        <ClothingContent>
          <Left>
            <div className="loading">
              <Loading loading={loading} backdrop={false} />
            </div>
            {clothes && (
              <ImgWrapper>
                <img src={clothes.url} />
              </ImgWrapper>
            )}
          </Left>
          <Right>
            {!isEdit ? (
              <div>
                <h4>Date added:</h4>
                {clothes && <h3>{clothes.createdAt && clothes.createdAt.toLocaleString()}</h3>}

                <h4>Date modified:</h4>
                {clothes && <h3>{clothes.updatedAt && clothes.updatedAt.toLocaleString()}</h3>}

                <h4>Category:</h4>
                {clothes && <div className="category">{clothes.category}</div>}

                <h4>Tags:</h4>
                {clothes && (
                  <div className="tags">
                    {clothes.tags.map(tag => (
                      <Tag className="tag-style" key={tag}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h4>Date added:</h4>
                <h3>{clothes.createdAt && clothes.createdAt.toLocaleString()}</h3>

                <h4>Date modified:</h4>
                <h3>{clothes.updatedAt && clothes.updatedAt.toLocaleString()}</h3>

                <h4>Change category:</h4>
                <Radio.Group
                  name="category"
                  value={category}
                  onChange={e => this.setState({ category: e.target.value })}
                >
                  <Radio.Button className="radioBtn" value="hats">
                    Hats
                  </Radio.Button>
                  <Radio.Button className="radioBtn" value="shirts">
                    Shirts
                  </Radio.Button>
                  <Radio.Button className="radioBtn" value="pants">
                    Pants
                  </Radio.Button>
                  <Radio.Button className="radioBtn" value="shoes">
                    Shoes
                  </Radio.Button>
                </Radio.Group>
                <h4>Add/Remove tags:</h4>
                <div>
                  <TweenOneGroup
                    className="tags"
                    enter={{
                      scale: 0.8,
                      opacity: 0,
                      type: 'from',
                      duration: 100,
                      onComplete: e => {
                        e.target.style = '';
                      },
                    }}
                    leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                    appear={false}
                  >
                    {tags.map(tag => (
                      <Tag
                        className="tag-style"
                        key={tag}
                        closable
                        onClose={e => {
                          e.preventDefault();
                          this.onRemoveTag(tag);
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                    {tagsInputVisible ? (
                      <Input
                        ref={el => (this.newTagInputRef = el)}
                        type="text"
                        size="small"
                        value={newTagValue}
                        onChange={e => this.setState({ newTagValue: e.target.value })}
                        onBlur={() => {
                          this.addTag();
                          this.setState({ tagsInputVisible: false });
                        }}
                        onPressEnter={this.addTag}
                      />
                    ) : (
                      <Tag className="new-tag" onClick={this.showInput}>
                        <PlusOutlined /> New Tag
                      </Tag>
                    )}
                  </TweenOneGroup>
                </div>
              </div>
            )}
          </Right>
        </ClothingContent>

        <Bottom style={{ display: isEdit ? 'block' : 'none' }}>
          <Button
            className="saveButton"
            variant="contained"
            color="primary"
            onClick={() => {
              this.onSave();
            }}
          >
            Save
          </Button>
        </Bottom>
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
            {
              text: 'Cancel, Continue Editing',
              onClick: () => this.setState({ goBackDialogOpen: false }),
            },
            {
              text: 'Exit without Saving',
              exit: true,
              onClick: () =>
                this.setState({
                  isEdit: false,
                  goBackDialogOpen: false,
                  tags: clothes.tags,
                  category: clothes.category,
                }),
            },
          ]}
          onClose={() => this.setState({ goBackDialogOpen: false })}
        />

        <SimpleDialog
          open={deleteDialogOpen}
          type="warning"
          description={
            <span>
              Are you sure
              <br />
              you want to delete this clothes?
            </span>
          }
          buttons={[
            {
              text: 'Yes',
              onClick: () => {
                this.setState({
                  isEdit: false,
                  deleteDialogOpen: false,
                });
                this.deleteClothes();
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
