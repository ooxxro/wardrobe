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
// import Webcam from 'react-webcam';
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
  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
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
const Upload = styled(Button)`
  background: #ffb3a0;
  border-color: #ffb3a0;
  margin-left: 90px;
  height: 400px;
  width: 400px;
  border-radius: 20px;
  img {
    text-align: center;
    width: 50%;
    height: 50%;
  }
  span {
    font-size: 30px;
  }
  div {
    height: 5px;
  }
  label {
    font-size: 30px;
  }
`;
const TakePhoto = styled(Button)`
  background: #ffdacf;
  border-color: #ffdacf;
  margin-left: 50px;
  height: 400px;
  width: 400px;
  border-radius: 20px;
  span {
    font-size: 30px;
  }
  div {
    height: 200px;
    width: 200px;
    background-color: #ffc774;
    border-radius: 100%;
    padding-right: 0;
    padding-left: 3px;
    img {
      padding: 0;
      margin-right: 0;
      margin-top: 10%;
      width: 80%;
      height: 80%;
    }
  }
`;

@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;

  render() {
    const menu = <Hover>Make sure your clothes fit the background for background removal!</Hover>;
    const { userStore } = this.context;
    console.log(userStore.currentUser);

    const handChange = e => {
      const file = e.target.files[0];
      const uploadPath = userStore.currentUser.uid + '/' + file['name'];
      let storageRef = firebase.storage().ref(uploadPath);
      // let imageRef = storageRef.child('../images/arrow.png');

      if (file) {
        const fileType = file['type'];
        console.log(file);
        // const uploadPath = userStore.currentUser.email + '/' + file[""];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (validImageTypes.includes(fileType)) {
          let task = storageRef.put(file);
          task.on('state_changed', () => {
            console.log('complete!');
          });
        }
      }
    };
    // const videoConstraints = {
    //   width: 400,
    //   height: 400,
    //   facingMode: 'user',
    // };
    // /*global Uint8Array, ArrayBuffer*/
    // /*eslint no-undef: "error"*/
    // // const convertBase64ToFile = function(image) {
    //   const byteString = atob(image.split(',')[1]);
    //   const ab = new ArrayBuffer(byteString.length);
    //   const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i += 1) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }
    //   const newBlob = new Blob([ab], {
    //     type: 'image/jpeg',
    //   });
    //   return newBlob;
    // };
    // const WebcamCapture = () => {
    //   const webcamRef = React.useRef(null);
    //   const capture = React.useCallback(() => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     const file = convertBase64ToFile(imageSrc);
    //     const uploadPath =
    //       userStore.currentUser.email + '/' + imageSrc.substring(25, 36).replace('/', 'A');
    //     let storageRef = firebase.storage().ref(uploadPath);
    //     let task = storageRef.put(file);
    //     task.on('state_changed', () => {
    //       console.log('Upload image from camera snapshot completed!');
    //     });
    //   }, [webcamRef]);
    //   return (
    //     <>
    //       <Webcam
    //         audio={false}
    //         height={720}
    //         ref={webcamRef}
    //         screenshotFormat="image/jpeg"
    //         width={1280}
    //         videoConstraints={videoConstraints}
    //       />
    //       <button onClick={capture}>Capture photo</button>
    //     </>
    //   );
    // };

    return (
      <Card>
        <Container fluid>
          <Row className="cardHead">
            <Col sm={1}></Col>
            <Col sm={9}>
              <Row className="placeHolder"></Row>
              <FontAwesomeIcon icon={faPlus} className="icon" />
              {'    '}Add clothes
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
              <Upload>
                <input
                  type="file"
                  name="file"
                  onChange={handChange}
                  id="file"
                  className="inputfile"
                />
                <label htmlFor="file">
                  Click to upload image
                  <div></div>
                  <img src={uploadImg} />
                </label>
              </Upload>
            </Col>
            <Col>
              <TakePhoto>
                <span>Take a picture</span>
                <Container>
                  <Row>
                    <Col>
                      <div>
                        <img src={cameraImg} />
                      </div>
                    </Col>
                  </Row>
                </Container>
              </TakePhoto>
            </Col>
          </Row>
          {/* <Row>
            <WebcamCapture />
          </Row> */}
        </Container>
      </Card>
    );
  }
}
