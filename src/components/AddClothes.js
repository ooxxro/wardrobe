import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Button } from 'antd';
import uploadImg from '../images/upload-cloud.png';
import cameraImg from '../images/camera.png';
import starImg from '../images/star.png';
import firebase from '../firebase';
import Popup from 'reactjs-popup';
import Webcam from 'react-webcam';
import { message } from 'antd';

const Wrapper = styled.div`
  width: 75%;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  width: 100%;
  border-radius: 30px;
  background-color: #ffdacf;
`;
const Hover = styled.div`
  background-color: #ffc5b4;
  font-size: 20px;
  width: 220px;
  border-radius: 20px;
  margin: 5px;
  text-align: center;
`;
// const previewText = styled.div`
//   width: 100%;
// `;

const Top = styled.div`
  display: inline;

  .plusSign {
    margin-left: 3vh;
    margin-top: 1vh;
    font-size: 30px;
    font-weight: 100;
    color: white;
    display: inline-block;
  }
  .titleStyle {
    font-size: 30px;
    font-weight: 10px;
    display: inline-block;
    white-space: pre;
  }

  .starIcon {
    float: right;
    margin-right: 3vh;
    margin-top: 1vh;
    font-size: 30px;
    background-color: #ffc5b4;
    border-radius: 30px;
    white-space: pre;
  }
  .starStyle {
    margin-top: -0.5vh;
    height: 5vh;
  }
  .tipStyle {
    margin-top: 3vh;
  }
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`;
const Left = styled.div`
  width: 50%;
  height: 70vh;
  margin: 0;
  margin-left: 8%;
  margin-top: 10vh;
  padding: 0;
  text-align: center;
`;
const Right = styled.div`
  width: 50%;
  font-size: 20px;
  margin: 0;
  margin-right: 12.5%;
  .label {
    font-size: 14px;
    color: #838383;
  }
  .addTagButton {
    border-radius: 10px;
    background-color: #e2dcfe;
  }
`;
@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;
  constructor(props) {
    super(props);
    this.state = {
      categoryArr: '',
      file: '',
      imagePreviewUrl: '',
      snapshotString: '',
      defaultCate: '',
      captured: false,
      isHat: false,
      isPants: false,
      isShoes: false,
      isShirt: false,
    };
  }
  onCatChange = e => {
    let arr = [];
    arr = e.target.value.toLowerCase().split(',');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
    }

    this.setState({ categoryArr: arr });
  };

  onImgChange = e => this.setState({ file: e.target.files[0] });
  onSubmit = e => {
    e.preventDefault();
    this.setState({
      categoryArr: '',
      file: null,
    });
  };
  clearSate = () =>
    this.setState({
      categoryArr: '',
      file: '',
      imagePreviewUrl: '',
      defaultCate: '',
      isHat: false,
      isPants: false,
      isShirt: false,
      isShoes: false,
    });
  setHat = () => {
    this.setState({
      defaultCate: 'hats',
      isHat: true,
      isPants: false,
      isShirt: false,
      isShoes: false,
    });
    this.printState();
  };
  setPants = () => {
    this.setState({
      defaultCate: 'pants',
      isHat: false,
      isPants: true,
      isShirt: false,
      isShoes: false,
    });
  };
  setShirt = () => {
    this.setState({
      defaultCate: 'shirts',
      isHat: false,
      isPants: false,
      isShirt: true,
      isShoes: false,
    });
  };
  setShoes = () => {
    this.setState({
      defaultCate: 'shoes',
      isHat: false,
      isPants: false,
      isShirt: false,
      isShoes: true,
    });
  };
  handleDefaultCate = () => {
    this.printState();
  };
  printState = () => {
    console.log(this.state.defaultCate);
  };

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }
  render() {
    const menu = <Hover>Make sure your clothes fit the background for background removal!</Hover>;
    const { userStore } = this.context;
    let { imagePreviewUrl } = this.state;
    let { isHat, isPants, isShirt, isShoes } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <div style={{ height: '100%', width: '100%', textAlign: 'center' }}>
          <img src={imagePreviewUrl} style={{ height: '100%' }} />
        </div>
      );
    }

    const handChange = () => {
      const file = this.state.file;
      if (file) {
        if (!this.state.defaultCate) {
          message.error('Need to select one default category');
        }
        let temp = ['all'];
        temp.push(this.state.defaultCate);
        const cates = temp.concat(this.state.categoryArr);

        let uploadPath;
        if (file['name']) {
          uploadPath = userStore.currentUser.uid + '/' + file['name'];
        } else {
          uploadPath =
            userStore.currentUser.uid +
            '/' +
            this.state.snapshotString.substring(25, 36).replace('/', 'A');
        }
        const newData = {
          createdTime: new Date().toLocaleDateString('en-GB', {
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          lastEditedTime: new Date().toLocaleDateString('en-GB', {
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          imagePath: uploadPath,
          categories: cates,
        };
        const fileType = file['type'];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

        //Firebase setup
        let storageRef = firebase.storage().ref(uploadPath);
        let clothRef = firebase
          .firestore()
          .collection('users')
          .doc(userStore.currentUser.uid)
          .collection('clothes');
        clothRef.get().then(function(clothes) {
          if (!clothes.exists && validImageTypes.includes(fileType)) {
            if (validImageTypes.includes(fileType)) {
              storageRef.put(file).then(function(snapshot) {
                if (snapshot.state == 'success') {
                  //Document successfully uploaded
                  clothRef
                    .add(newData)
                    .then(function(docRef) {
                      //Document successfully written to firestore
                      //Add clothing item ID to corresponding categories in firestore
                      for (let i = 0; i < newData.categories.length; i++) {
                        if (newData.categories[i].length > 0) {
                          let categoryRef = firebase
                            .firestore()
                            .collection('users/' + firebase.auth().currentUser.uid + '/categories')
                            .doc(newData.categories[i]);

                          //Check if category exists. If it does, update it, if it doesn't create it
                          categoryRef.get().then(function(thisDoc) {
                            if (thisDoc.exists) {
                              categoryRef.update({
                                clothes: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                              });
                            } else {
                              categoryRef.set({
                                clothes: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                                name: newData.categories[i],
                              });
                            }
                          });
                        }
                      }
                    })
                    .catch(function(error) {
                      message.error(error.message);
                    });
                } else {
                  message.error('Error!');
                }
                message.success('Upload completed!');
              });
            } else {
              message.error('File type is incorrect!');
            }
          }
        });
      } else {
        alert('Image is reqired!');
      }
    };
    const videoConstraints = {
      width: '400px',
      height: '400px',
      facingMode: 'user',
    };
    const convertBase64ToFile = function(image) {
      const byteString = atob(image.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const newBlob = new Blob([ab], {
        type: 'image/jpeg',
      });
      return newBlob;
    };

    const WebcamCapture = e => {
      const webcamRef = React.useRef(null);
      let convertedFile = null;
      let webcam = null;
      if (this.state.imagePreviewUrl) {
        webcam = null;
      } else {
        webcam = (
          <Webcam
            audio={false}
            height={'100%'}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={'100%'}
            style={{ top: '0', padding: '0' }}
            videoConstraints={videoConstraints}
          />
        );
      }
      const capture = React.useCallback(() => {
        if (this.state.captured) {
          return null;
        }
        this.setState({ captured: true });
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;
        convertedFile = convertBase64ToFile(imageSrc);
        this.setState({ snapshotString: imageSrc });
        let reader = new FileReader();

        reader.onloadend = () => {
          this.setState({
            file: convertedFile,
            imagePreviewUrl: reader.result,
          });
        };

        reader.readAsDataURL(convertedFile);
      }, [webcamRef]);
      return (
        <form style={modal} onSubmit={this.onSubmit}>
          <div
            style={{
              padding: '0',
              margin: '0',
              width: '100%',
              height: '65%',
            }}
          >
            {webcam}
            {$imagePreview}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={capture}
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                marginTop: '5px',
                borderRadius: '30px',
              }}
            >
              Capture photo
            </Button>
          </div>
          <div style={modalActions}>
            <div style={{ display: 'inline-block' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                Custom Categories:&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <input
              type="text"
              name="cat"
              placeholder="Seperate tags by comma (Optional)"
              value={this.state.categoryArr}
              onChange={this.onCatChange}
              style={{ width: '60%', display: 'inline-block' }}
            />
            <div></div>
            <input
              className="btn"
              type="hat"
              value="hat"
              style={hatStyle}
              onChange={() => {
                this.setHat();
              }}
              onClick={() => {
                this.setHat();
              }}
            />
            <input
              className="btn"
              type="shirt"
              value="shirt"
              style={shirtStyle}
              onChange={() => {
                this.setShirt();
              }}
              onClick={() => {
                this.setShirt();
              }}
            />
            <input
              className="btn"
              type="pants"
              value="pants"
              style={pantsStyle}
              onChange={() => {
                this.setPants();
              }}
              onClick={() => {
                this.setPants();
              }}
            />
            <input
              className="btn"
              type="shoes"
              value="shoes"
              style={shoesStyle}
              onChange={() => {
                this.setShoes();
              }}
              onClick={() => {
                this.setShoes();
              }}
            />
            <div></div>
            <input
              type="submit"
              value="submit"
              className="btn"
              style={btnStyle}
              onChange={handChange}
              onClick={() => {
                handChange();
                this.clearSate();
                e.close();
              }}
            />
            <input
              className="btn"
              type="cancel"
              value="cancel"
              style={btnStyle}
              onChange={() => {
                this.clearSate();
                e.close();
              }}
              onClick={() => {
                this.clearSate();
                e.close();
              }}
            />
          </div>
        </form>
      );
    };

    const modal = {
      fontSize: '12px',
      borderRadius: '20px',
      height: '67vh',
      margin: '0',
      padding: '0',
      background: 'linear-gradient(90deg, #6e8fe7 0%, #8261e6 100%)',
    };
    const modalHeader = {
      width: '100%',
      fontSize: '18px',
      textAlign: 'center',
      padding: '5px',
    };
    const modalContent = {
      width: '100%',
      padding: '10px 5px',
    };
    const modalActions = {
      width: '100%',
      padding: '10px 5px',
      margin: 'auto',
      textAlign: 'center',
    };
    const modalClose = {
      cursor: 'pointer',
      position: 'absolute',
      display: 'block',
      padding: '2px 5px',
      lineHeight: '20px',
      right: '-10px',
      top: '-10px',
      fontSize: '24px',
      background: '#ffffff',
      borderRadius: '18px',
      border: '1px solid #cfcece',
    };
    const UploadButton = {
      background: '#ffb3a0',
      borderColor: '#ffb3a0',
      width: '100%',
      height: '100%',
      borderRadius: '20px',
    };

    const imgStyle = {
      textAlign: 'center',
      width: '60%',
    };
    const spanStyle = {
      fontSize: '30px',
    };
    const divStyle = {
      height: '10%',
    };
    const Upload = () => (
      <div style={UploadButton}>
        <div style={divStyle}></div>
        <span style={spanStyle}>Click to upload image</span>
        <div></div>
        <img style={imgStyle} src={uploadImg} />
      </div>
    );

    const photoButtonStyle = {
      background: '#ffdacf',
      borderColor: '#ffdacf',
      marginLeft: '3vw',
      height: '100%',
      width: '100%',
      borderRadius: '20px',
    };
    const photoSpanStyle = {
      fontSize: '30px',
    };
    // const photoDivStyle = {
    //   height: '200px',
    //   width: '200px',
    //   backgroundColor: '#ffc774',
    //   borderRadius: '100%',
    //   marginLeft: '25%',
    //   paddingLeft: '3px',
    // };
    // const photoImgStyle = {
    //   padding: 0,
    //   marginRight: 0,
    //   marginTop: '10%',
    //   width: '80%',
    //   height: '80%',
    // };
    const TakePhoto = () => (
      <div style={photoButtonStyle}>
        <span style={photoSpanStyle}>Click to take a picture</span>
        <div></div>
        <img style={imgStyle} src={cameraImg} />
      </div>
    );
    const transparent = {
      background: 'transparent',
      borderColor: 'transparent',
      height: '50vh',
      width: '30vw',
      margin: '0',
      padding: '0',
    };
    const btnStyle = {
      backgroundColor: 'white',
      borderRadius: '10px',
      borderColor: '#888',
      width: '200px',
      textAlign: 'center',
      margin: '10px',
    };
    let hatStyle = null;
    let pantsStyle = null;
    let shirtStyle = null;
    let shoesStyle = null;
    if (isHat) {
      hatStyle = {
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        backgroundColor: '#8B1EF9',
        borderColor: 'transparent',
        margin: '10px',
      };
    } else {
      hatStyle = {
        backgroundColor: 'white',
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        borderColor: 'transparent',
        margin: '10px',
      };
    }

    if (isPants) {
      pantsStyle = {
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        backgroundColor: '#8B1EF9',
        borderColor: 'transparent',
        margin: '10px',
      };
    } else {
      pantsStyle = {
        backgroundColor: 'white',
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        borderColor: 'transparent',
        margin: '10px',
      };
    }
    if (isShirt) {
      shirtStyle = {
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        backgroundColor: '#8B1EF9',
        borderColor: 'transparent',
        margin: '10px',
      };
    } else {
      shirtStyle = {
        backgroundColor: 'white',
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        borderColor: 'transparent',
        margin: '10px',
      };
    }
    if (isShoes) {
      shoesStyle = {
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        backgroundColor: '#8B1EF9',
        borderColor: 'transparent',
        margin: '10px',
      };
    } else {
      shoesStyle = {
        backgroundColor: 'white',
        borderRadius: '50px',
        width: '100px',
        textAlign: 'center',
        borderColor: 'transparent',
        margin: '10px',
      };
    }

    return (
      <Wrapper>
        <Card>
          <Top>
            <FontAwesomeIcon icon={faPlus} className="plusSign" />
            <div className="titleStyle">{'   '}Add Clothes</div>
            <div className="starIcon">
              <Dropdown overlay={menu} placement="bottomRight">
                <div className="tips">
                  {'  '}
                  <img src={starImg} className="starStyle" /> <span className="tipStyle">Tips</span>
                  {'  '}
                </div>
              </Dropdown>
            </div>
          </Top>
          <Content>
            <Left>
              <Popup
                trigger={
                  <Button style={transparent}>
                    <Upload />
                  </Button>
                }
                modal
              >
                {close => (
                  <div style={modal}>
                    <a style={modalClose} onClick={close}>
                      &times;
                    </a>
                    <div style={modalHeader}> Please Select Image Here!</div>
                    <form style={modalContent} onSubmit={this.onSubmit}>
                      <span>Custom Categories:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <input
                        type="text"
                        name="cat"
                        placeholder="Seperate tags by comma, (Optional)"
                        value={this.state.categoryArr}
                        onChange={this.onCatChange}
                        style={{ width: '30%' }}
                      />
                      <div></div>
                      <input
                        type="file"
                        name="file"
                        value={this.state.image}
                        onChange={this.onImgChange}
                      />
                      <label htmlFor="file"></label>

                      <div style={modalActions}>
                        <input
                          className="btn"
                          type="hat"
                          value="hat"
                          style={hatStyle}
                          onChange={() => {
                            this.setHat();
                          }}
                          onClick={() => {
                            this.setHat();
                          }}
                        />
                        <input
                          className="btn"
                          type="shirt"
                          value="shirt"
                          style={shirtStyle}
                          onChange={() => {
                            this.setShirt();
                          }}
                          onClick={() => {
                            this.setShirt();
                          }}
                        />
                        <input
                          className="btn"
                          type="pants"
                          value="pants"
                          style={pantsStyle}
                          onChange={() => {
                            this.setPants();
                          }}
                          onClick={() => {
                            this.setPants();
                          }}
                        />
                        <input
                          className="btn"
                          type="shoes"
                          value="shoes"
                          style={shoesStyle}
                          onChange={() => {
                            this.setShoes();
                          }}
                          onClick={() => {
                            this.setShoes();
                          }}
                        />
                        <div></div>
                        <input
                          type="submit"
                          value="submit"
                          className="btn"
                          style={btnStyle}
                          onChange={handChange}
                          onClick={() => {
                            handChange();
                            this.clearSate();
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
                      </div>
                    </form>
                  </div>
                )}
              </Popup>
            </Left>
            <Right>
              <Popup
                trigger={
                  <Button style={transparent}>
                    <TakePhoto />
                  </Button>
                }
                modal
                style={modal}
              >
                {close => (
                  <div>
                    <WebcamCapture close={close} />
                  </div>
                )}
              </Popup>
            </Right>
          </Content>
        </Card>
      </Wrapper>
    );
  }
}
