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
import { Container, Row, Col } from 'react-bootstrap';
import firebase from '../firebase';
import Popup from 'reactjs-popup';
import Webcam from 'react-webcam';
import { message } from 'antd';

const Card = styled.div`
  width: 76%;
  height: 80vh;
  margin-top: 2%;
  margin-left: 12%;
  margin-bottom: 0%;
  border-radius: 20px;
  font-size: 26px;
  font-weight: bold;
  background-color: #ffdacf;
  .cardHead {
    white-space: pre;
    height: 15vh;
    .icon {
      font-weight: 100;
      color: white;
    }
  }
  .cardBody {
    width: 100%;
  }
  .right {
    img {
      right: 0;
      height: 30px;
      width: 30px;
    }
  }
  .placeHolder {
    height: 20%;
  }
  .tips {
    background-color: #ffb3a0;
    border-radius: 20px;
    width: 120px;
  }
`;
const Hover = styled.div`
  background-color: #ffc5b4;
  font-size: 20px;
  width: 220px;
  border-radius: 20px;
  margin: 5px;
  text-align: center;
`;

@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;
  state = {
    title: 'Add clothes',
    categoryArr: '',
    file: null,
  };

  onCatChange = e => {
    let arr = [];
    arr = e.target.value.toLowerCase().split(',');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
    }

    this.setState({ categoryArr: arr });
  };

  onImgChange = e => this.setState({ file: e.target.files[0] });
  onSubmit = e => e.preventDefault();

  render() {
    const menu = <Hover>Make sure your clothes fit the background for background removal!</Hover>;
    const { userStore } = this.context;

    const handChange = () => {
      const file = this.state.file;
      if (file) {
        let all = ['all'];
        const cates = this.state.categoryArr;
        const uploadPath = userStore.currentUser.uid + '/' + file['name'];
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
          categories: all.concat(cates),
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

        if (validImageTypes.includes(fileType)) {
          //fetch data from firebase
          //1. check dup
          /*clothRef.get().then(function(clothes) {
            if (clothes.exists) {
              console.log('Document data:', clothes.data());
              return;
            }
          });*/

          //2. add newData to storage and firestore
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
                      categoryRef.update({
                        clothes: firebase.firestore.FieldValue.arrayUnion(docRef.id),
                      });
                    }
                  }
                })
                .catch(function(error) {
                  message.error(error.message);
                });
              message.success('Uploaded successfuly!');
            } else {
              message.error('Error!');
            }
          });
        }
      } else {
        message.error('Image is required!');
      }
    };
    const videoConstraints = {
      width: '800px',
      height: '800px',
      facingMode: 'user',
    };
    /*global Uint8Array, ArrayBuffer*/
    /*eslint no-undef: "error"*/
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

    const WebcamCapture = () => {
      const webcamRef = React.useRef(null);
      // const close = this.props.close;
      const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        //const file = convertBase64ToFile(imageSrc);
        this.setState({ file: convertBase64ToFile(imageSrc) });
      }, [webcamRef]);
      return (
        <div style={modal}>
          <Webcam
            audio={false}
            height={'100%'}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={'100%'}
            videoConstraints={videoConstraints}
          />
          <Button
            onClick={() => {
              capture();
              console.log(this.props.close);
              console.log('modal closed');
            }}
          >
            Capture photo
          </Button>
        </div>
      );
    };

    const modal = {
      fontSize: '12px',
      borderRadius: '20px',
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
      marginLeft: '90px',
      height: '400px',
      width: '400px',
      borderRadius: '20px',
    };

    const imgStyle = {
      textAlign: 'center',
      width: '50%',
      height: '50%',
    };
    const spanStyle = {
      fontSize: '30px',
    };
    const divStyle = {
      height: '15%',
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
      marginLeft: '50px',
      height: '400px',
      width: '400px',
      borderRadius: '20px',
    };
    const photoSpanStyle = {
      fontSize: '30px',
    };
    const photoDivStyle = {
      height: '200px',
      width: '200px',
      backgroundColor: '#ffc774',
      borderRadius: '100%',
      marginLeft: '25%',
      paddingLeft: '3px',
    };
    const photoImgStyle = {
      padding: 0,
      marginRight: 0,
      marginTop: '10%',
      width: '80%',
      height: '80%',
    };
    const TakePhoto = () => (
      <div style={photoButtonStyle}>
        <div style={divStyle}></div>
        <span style={photoSpanStyle}>Click to take a picture</span>
        <div style={photoDivStyle}>
          <img style={photoImgStyle} src={cameraImg} />
        </div>
      </div>
    );
    const transparent = {
      background: 'transparent',
      borderColor: 'transparent',
    };
    const btnStyle = {
      backgroundColor: 'white',
      borderRadius: '10px',
      borderColor: '#888',
      width: '200px',
    };

    return (
      <Card>
        <Container fluid>
          <Row className="cardHead">
            <Col sm={1}></Col>
            <Col sm={9}>
              <Row className="placeHolder"></Row>
              <FontAwesomeIcon icon={faPlus} className="icon" />
              {'    '}
              {this.state.title}
            </Col>
            <Col sm={2} className="right">
              <Row className="placeHolder"></Row>
              <Dropdown overlay={menu} placement="bottomRight">
                <div className="tips">
                  {'  '}
                  <img src={starImg} />
                  {'  '}
                  <span>Tips</span>
                  {'  '}
                </div>
              </Dropdown>
            </Col>
          </Row>
          <Row className="cardBody">
            <Col sm={5}>
              <Popup
                trigger={
                  <Button style={transparent}>
                    <Upload />
                  </Button>
                }
                modal
                style={modal}
              >
                {close => (
                  <div style={modal}>
                    <a style={modalClose} onClick={close}>
                      &times;
                    </a>
                    <div style={modalHeader}> Please Select Image Here!</div>
                    <form style={modalContent} onSubmit={this.onSubmit}>
                      <span>Catogories:&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
                          type="submit"
                          value="submit"
                          className="btn"
                          style={btnStyle}
                          onChange={handChange}
                          onClick={() => {
                            handChange();
                            close();
                          }}
                        />
                        <input
                          className="btn"
                          type="cancel"
                          value="cancel"
                          style={btnStyle}
                          onChange={() => {
                            console.log('modal closed');
                            close();
                          }}
                          onClick={() => {
                            console.log('modal closed');
                            close();
                          }}
                        ></input>
                      </div>
                    </form>
                  </div>
                )}
              </Popup>
            </Col>
            <Col>
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
                    <Button
                      onClick={() => {
                        console.log(close);
                        close();
                      }}
                    />
                  </div>
                )}
              </Popup>
            </Col>
          </Row>
        </Container>
      </Card>
    );
  }
}
