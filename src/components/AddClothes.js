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
    // const [image, setImage] = useState(null);
    // const [url, setUrl] = useState('');
    // const [progress, setProgress] = useState(0);
    // const [error, setError] = useState('');
    let errorMsg = '';
    let image = null;
    let progressBar = 0;
    let urlMsg = '';
    console.log(errorMsg, progressBar, urlMsg);
    const handChange = e => {
      const file = e.target.files[0];
      if (file) {
        const fileType = file['type'];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (validImageTypes.includes(fileType)) {
          errorMsg = '';
          image = file;
        } else {
          errorMsg = 'Please select an image to upload';
        }
      }
    };

    const handleUpdate = () => {
      if (image) {
        const uploadPath = userStore.userID;
        console.log(uploadPath);
        const uploadTask = firebase.storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            progressBar = progress;
          },
          error => {
            errorMsg = error;
          },
          () => {
            firebase.storage
              .ref('images')
              .child(image.name)
              .getDownloadURL()
              .then(url => {
                urlMsg = url;
                progressBar = 0;
              });
          }
        );
      } else {
        errorMsg = 'Error please choose an image to upload';
      }
    };
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
              <Upload onClick={handleUpdate}>
                <input
                  type="file"
                  onChange={handChange}
                  name="file"
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
        </Container>
        <p style={{ color: 'red' }}>{errorMsg}</p>
        {urlMsg ? <img src={urlMsg} alt="logo" /> : <span>No Img</span>}
      </Card>
    );
  }
}
