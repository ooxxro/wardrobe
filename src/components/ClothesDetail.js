import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { /*Link,*/ withRouter } from 'react-router-dom';
import styled from 'styled-components';
import backImg from '../images/back.png';
import deleteImg from '../images/delete.png';
import closeImg from '../images/closeIcon.png';
import editImg from '../images/pen.png';
import { Button, message } from 'antd';
import firebase from '../firebase';
import Popup from 'reactjs-popup';
import Loading from './Loading';

const db = firebase.firestore();

const Wrapper = styled.div`
  width: 75%;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  width: 100%;
  background-color: #e9e9e9;
  border-radius: 30px;
`;

const Top = styled.div`
  padding: 1rem 1rem;

  .backButton {
    background: url(${backImg}) center/60% no-repeat;
    background-color: #e2dcfe;
  }

  .editButton {
    float: right;
    background: url(${editImg}) center/60% no-repeat;
    background-color: #e2dcfe;
  }

  .deleteButton {
    float: right;
    background: url(${deleteImg}) center/60% no-repeat;
    background-color: #e2dcfe;
    margin-left: 10px;
  }
`;
const Bottom = styled.div`
  padding: 3rem 3rem;
  .saveButton {
    float: right;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
  }
`;

const ClothingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`;
const Left = styled.div`
  width: 50%;
  text-align: center;
  img {
    width: 80%;
  }
`;
const Right = styled.div`
  width: 50%;
  font-size: 20px;
  .label {
    font-size: 14px;
    color: #838383;
  }
  .addTagButton {
    border-radius: 10px;
    background-color: #e2dcfe;
  }
`;
const TagButton = styled.div`
  border-radius: 10px;
  background-color: #e2dcfe;
  display: block;
  border: 3px solid purple;
  width: 20%;
  text-align: center;
  margin-top: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
  display: inline-block;
`;
const modal = {
  fontSize: '12px',
  borderRadius: '20px',
  height: '30vh',
  width: '100%',
  margin: '0',
  padding: '0',
  background: 'linear-gradient(90deg, #6e8fe7 0%, #8261e6 100%)',
};

const modalContent = {
  width: '100%',
  padding: '10px 5px',
  textAlign: 'center',
  font: 'bold',
};
const btnStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  borderColor: '#888',
  width: '200px',
  textAlign: 'center',
  margin: '10px',
};
@withRouter
@observer
export default class ClothesDetail extends React.Component {
  static contextType = StoreContext;

  state = {
    loading: false,
    clothes: null,
    isEdit: false,
    removedTags: [],
    newTagArr: [],
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.clothesId !== prevProps.match.params.clothesId) {
      this.getData();
    }
  }

  clearSate() {
    this.setState({ removedTags: [], newTagArr: [] });
    this.getData();
  }

  goBack = () => {
    this.props.history.goBack();
  };

  edit = () => {
    this.setState({ isEdit: true });
  };

  save = () => {
    this.setState({ isEdit: false });
  };

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
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };

        this.setState({ clothes, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        message.error(error.message);
      });
  };

  updateTags = () => {
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
    const { clothes, newTagArr, removedTags } = this.state;

    if (newTagArr.length === 0 && removedTags.length === 0) return;

    this.setState({ loading: true });

    const userRef = db.collection('users').doc(uid);
    const clothesRef = userRef.collection('clothes').doc(clothesId);

    //Add new tag to firebase
    const batch = db.batch();

    batch.update(clothesRef, { updatedAt: new Date(), tags: clothes.tags });

    newTagArr.forEach(tag => {
      if (tag.length > 0) {
        const tagsRef = userRef.collection('tags').doc(tag);
        batch.set(
          tagsRef,
          {
            clothes: firebase.firestore.FieldValue.arrayUnion({ id: clothesId, url: clothes.url }),
          },
          { merge: true }
        );
      }
    });

    //Remove deleted tag from firebase
    removedTags.forEach(tag => {
      const tagsRef = userRef.collection('tags').doc(tag);
      batch.set(
        tagsRef,
        { clothes: firebase.firestore.FieldValue.arrayRemove({ id: clothesId, url: clothes.url }) },
        { merge: true }
      );
    });

    batch
      .commit()
      .then(() => {
        this.setState({ loading: false });
        this.getData();
      })
      .catch(err => {
        this.setState({ loading: false });
        message.error(`Error while saving: ${err.message}`);
      });
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

  onCatChange = e => {
    let arr = [];
    arr = e.target.value
      .toLowerCase()
      .split(',')
      .map(t => t.trim());

    this.setState({ newTagArr: arr });
  };

  combineNew = () => {
    let newArr = [...this.state.newTagArr];
    let tags = [...this.state.clothes.tags];

    //remove duplicated tag
    newArr.map(newTag => {
      if (tags.includes(newTag)) {
        newArr.splice(newArr.indexOf(newTag), 1);
      }
    });

    // console.log(newArr);
    newArr.map(newTag => {
      tags.push(newTag);
    });
    this.setState({
      newTagArr: newArr,
      clothes: {
        ...this.state.clothes,
        tags,
      },
    });
  };

  removeTag = index => {
    const { removedTags, clothes } = this.state;
    const tags = [...clothes.tags];

    const [tag] = tags.splice(index, 1);

    if (!removedTags.includes(tag)) {
      removedTags.push(tag);
    }
    this.setState({
      clothes: {
        ...this.state.clothes,
        tags,
      },
      removedTags,
    });
  };

  render() {
    let vm = this;
    let { loading, clothes, isEdit } = this.state;

    return (
      <Wrapper>
        <Loading loading={loading} />

        <Card>
          <Top>
            <div className="topButtons">
              <Button className="backButton" shape="circle" size="large" onClick={this.goBack} />
              {!isEdit && (
                <Button
                  className="deleteButton"
                  shape="circle"
                  size="large"
                  onClick={this.deleteClothes}
                />
              )}
              <Button
                className="editButton"
                shape="circle"
                size="large"
                onClick={this.edit}
                style={{ display: this.state.isEdit ? 'none' : 'block' }}
              />
            </div>
          </Top>

          {!loading && !clothes && <div>Clothes Not Found</div>}

          {clothes && (
            <ClothingContent>
              <Left>
                <div className="clothingImage">
                  <img src={clothes.url} />
                </div>
              </Left>

              <Right>
                <div className="dateAdded">
                  <div className="label">Date added:</div>
                  <div>{clothes.createdAt && clothes.createdAt.toLocaleString()}</div>
                </div>
                <br />
                <div className="dateModified">
                  <div className="label">Date modified:</div>
                  <div>{clothes.updatedAt && clothes.updatedAt.toLocaleString()}</div>
                </div>
                <br />
                <div className="categories">
                  <div className="label">Category:</div>
                  <div>{clothes.category}</div>
                </div>
                <br />
                <div className="tags">
                  <div className="label">Tags:</div>
                  <div>
                    {clothes.tags &&
                      clothes.tags.map((tag, i) =>
                        !vm.state.isEdit ? (
                          <TagButton
                            key={tag}
                            className="editButton"
                            shape="rectangle"
                            size="large"
                          >
                            {tag}
                          </TagButton>
                        ) : (
                          <TagButton
                            key={tag}
                            className="editButton"
                            shape="rectangle"
                            size="large"
                          >
                            {tag}
                            <Button
                              shape="circle"
                              size="small"
                              style={{
                                backgroundColor: '#8162EA',
                                margin: '0',
                                padding: '0',
                                marginLeft: '20%',
                                top: '-3px',
                                height: '100%',
                                width: '10%',
                                display: 'inline-block',
                              }}
                              onClick={() => this.removeTag(i)}
                            >
                              <img
                                src={closeImg}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  textAlign: 'center',
                                  display: 'inline-block',
                                }}
                              />
                            </Button>
                          </TagButton>
                        )
                      )}
                    <Popup
                      trigger={
                        <Button
                          className="addTagButton"
                          style={{ display: this.state.isEdit ? 'block' : 'none' }}
                        >
                          + Add New Tags
                        </Button>
                      }
                      modal
                    >
                      {close => (
                        <div style={modal}>
                          <form style={modalContent}>
                            <span>Custom Categories:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input
                              type="text"
                              name="cat"
                              placeholder="Seperate tags by comma"
                              value={this.state.newTagArr}
                              onChange={this.onCatChange}
                              style={{ width: '30%' }}
                            />
                            <div></div>
                            <input
                              type="submit"
                              value="submit"
                              className="btn"
                              style={btnStyle}
                              onChange={this.onChange}
                              onClick={() => {
                                this.combineNew();
                                close();
                              }}
                            />
                            <input
                              className="btn"
                              type="cancel"
                              value="cancel"
                              style={btnStyle}
                              onChange={() => {
                                this.clearSate();
                                close();
                              }}
                              onClick={() => {
                                this.clearSate();
                                close();
                              }}
                            />
                          </form>
                        </div>
                      )}
                    </Popup>
                  </div>
                </div>
                <br />
              </Right>
            </ClothingContent>
          )}

          <Bottom>
            <Button
              type="primary"
              className="saveButton"
              onClick={() => {
                this.save();
                this.updateTags();
              }}
              style={{ display: this.state.isEdit ? 'block' : 'none' }}
            >
              Save
            </Button>
          </Bottom>
        </Card>
      </Wrapper>
    );
  }
}
