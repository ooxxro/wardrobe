import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { /*Link,*/ withRouter } from 'react-router-dom';
import styled from 'styled-components';
import placeholderImg from '../images/mywardrobe-tshirt.png';
import backImg from '../images/back.png';
import deleteImg from '../images/delete.png';
import closeImg from '../images/closeIcon.png';
import editImg from '../images/pen.png';
import { Button, message } from 'antd';
import firebase from '../firebase';
import Popup from 'reactjs-popup';

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
    isEdit: false,
    imgID: '',
    imagePath: '',
    imageURL: '',
    upDateTime: '',
    createTime: '',
    cateArr: [],
    compareArr: [],
    fetched: false,
    removalArr: [],
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
    this.setState({ removalArr: [], newTagArr: [] });
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
    if (this.state.fetched) return;
    const { userStore } = this.context;
    const vm = this;
    //fetch data from firebase
    let userObj = firebase
      .firestore()
      .collection('users')
      .doc(userStore.currentUser.uid);
    let imgID = '';
    userObj
      .collection('clothes')
      .get()
      .then(function(res) {
        //TODO: Temporary using fixed data
        imgID = res.docs[0].id;
        userObj
          .collection('clothes')
          .doc(imgID)
          .get()
          .then(function(res) {
            let storageRef = firebase.storage().ref();
            vm.setState({
              imagePath: res.data().imagePath,
              upDateTime: res.data().lastEditedTime,
              createTime: res.data().createdTime,
              cateArr: res.data().categories,
              compareArr: res.data().categories,
              imgID: imgID,
            });
            storageRef
              .child(res.data().imagePath)
              .getDownloadURL()
              .then(function(url) {
                vm.setState({
                  imageURL: url,
                  fetched: true,
                });
              });
          });
      });
  };

  updateCates = () => {
    //console.log('Compare Data');
    let vm = this;
    const { userStore } = this.context;

    //Add new tag to firebase
    this.state.newTagArr.map(tag => {
      if (tag.length > 0) {
        console.log('in newTagArr map');
        let categoryRef = firebase
          .firestore()
          .collection('users/' + firebase.auth().currentUser.uid + '/categories')
          .doc(tag);

        //Check if category exists. If it does, update it, if it doesn't create it
        categoryRef.get().then(function(thisDoc) {
          console.log(thisDoc);
          if (thisDoc.exists) {
            categoryRef.update({
              clothes: firebase.firestore.FieldValue.arrayUnion(vm.state.imgID),
            });
          } else {
            categoryRef.set({
              clothes: firebase.firestore.FieldValue.arrayUnion(vm.state.imgID),
              name: tag,
            });
          }
        });
      }
    });

    //Remove deleted tag from firebase
    this.state.removalArr.map(tag => {
      let categoryRef = firebase
        .firestore()
        .collection('users/' + firebase.auth().currentUser.uid + '/categories')
        .doc(tag);
      categoryRef.delete().then(function(thisDoc) {
        console.log(thisDoc);
      });
    });

    //Overwrite cateArr
    let clothRef = firebase
      .firestore()
      .collection('users')
      .doc(userStore.currentUser.uid)
      .collection('clothes')
      .doc(this.state.imgID);

    let clothesObject = null;
    firebase
      .firestore()
      .collection('users')
      .doc(userStore.currentUser.uid)
      .collection('clothes')
      .doc(vm.state.imgID)
      .get()
      .then(function(res) {
        clothesObject = res.data();
        if (clothesObject) {
          clothesObject.categories = vm.state.cateArr;
          clothesObject.lastEditedTime = new Date().toLocaleDateString('en-GB', {
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          clothRef.set(clothesObject);
          vm.setState({ fetched: false });
        }
      });
  };

  deleteClothes = () => {
    let vm = this;
    const { userStore } = this.context;

    this.state.cateArr.map(tag => {
      let categoryRef = firebase
        .firestore()
        .collection('users/' + firebase.auth().currentUser.uid + '/categories')
        .doc(tag);
      categoryRef.delete().then(function(thisDoc) {
        console.log(thisDoc);
      });
    });
    let userObj = firebase
      .firestore()
      .collection('users')
      .doc(userStore.currentUser.uid);
    userObj
      .collection('clothes')
      .doc(this.state.imgID)
      .delete()
      .then(function(res) {
        console.log(res);
        message.success('clothes deleted!');
        vm.goBack();
      });
  };

  onCatChange = e => {
    let arr = [];
    arr = e.target.value.toLowerCase().split(',');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
    }

    this.setState({ newTagArr: arr });
  };

  combineNew() {
    let newArr = this.state.newTagArr;
    let cates = this.state.cateArr;

    //remove duplicated tag
    newArr.map(function(newTag) {
      if (cates.includes(newTag)) {
        newArr.splice(newArr.indexOf(newTag), 1);
      }
    });

    // console.log(newArr);
    newArr.map(function(newTag) {
      cates.push(newTag);
    });
    this.setState({ newTagArr: newArr, cateArr: cates });
  }

  render() {
    let vm = this;
    let { imageURL, createTime, upDateTime, cateArr } = this.state;
    let $imageDisplay = <img src={placeholderImg} />;
    let $createdTime = <span>{createTime}</span>;
    let $upDateTime = <span>{upDateTime}</span>;
    if (imageURL) {
      $imageDisplay = <img src={imageURL} />;
    }
    const removeTag = tag => {
      let tempArr = this.state.cateArr;
      let removeArr = this.state.removalArr;
      if (tempArr.includes(tag)) {
        tempArr.splice(tempArr.indexOf(tag), 1);
        if (!removeArr.includes(tag)) {
          removeArr.push(tag);
        }
      }
      this.setState({ cateArr: tempArr, removalArr: removeArr });
    };
    const tags = cateArr.map(function(tag) {
      if (tag == 'all') {
        return;
      } else if (!vm.state.isEdit) {
        return (
          <TagButton key={tag.toString()} className="editButton" shape="rectangle" size="large">
            {tag}
          </TagButton>
        );
      } else {
        return (
          <TagButton key={tag.toString()} className="editButton" shape="rectangle" size="large">
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
              onClick={() => removeTag(tag)}
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
        );
      }
    });

    return (
      <Wrapper>
        <Card>
          <Top>
            <div className="topButtons">
              <Button className="backButton" shape="circle" size="large" onClick={this.goBack} />
              <Button
                className="deleteButton"
                shape="circle"
                size="large"
                onClick={this.deleteClothes}
              />
              <Button
                className="editButton"
                shape="circle"
                size="large"
                onClick={this.edit}
                style={{ display: this.state.isEdit ? 'none' : 'block' }}
              />
            </div>
          </Top>

          <ClothingContent>
            <Left>
              <div className="clothingImage">{$imageDisplay}</div>
            </Left>

            <Right>
              <div className="dateAdded">
                <div className="label">Date added:</div>
                <div>{$createdTime}</div>
              </div>
              <br />
              <div className="dateModified">
                <div className="label">Date modified:</div>
                <div>{$upDateTime}</div>
              </div>
              <br />
              <div className="categories">
                <div className="label">Categories:</div>
                <div>
                  {tags}
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
                        <form style={modalContent} onSubmit={this.onSubmit}>
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

          <Bottom>
            <Button
              type="primary"
              className="saveButton"
              onClick={() => {
                this.save();
                this.updateCates();
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
