import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Stepper, Step, StepLabel, Button, Tooltip, Zoom } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import plusImg from '../images/plus.svg';
import uploadImg from '../images/upload-cloud.png';
import cameraImg from '../images/camera.png';
import { message } from 'antd';
import Loading from './Loading';
import ClothesFitter from './ClothesFitter';
import firebase from '../firebase';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: #ffdad0;
  padding: 0px 40px 40px;
`;

const Up = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 40px;
    height: 40px;
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
  .MuiPaper-root {
    background: inherit;
    padding: 0;
    margin-top: 5px;
    .MuiStepLabel-iconContainer {
      background: #fff;
      border-radius: 50%;
    }
  }
`;
const Content = styled.div`
  margin: 60px;
`;
const StepOne = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .iconButton {
    width: 160px;
    height: 160px;
    background: rgba(255, 209, 134, 0.7);
    border-radius: 50%;
    margin: 0 30px;
    text-align: center;
    line-height: 200px;
    &:hover {
      background: rgba(255, 209, 134, 0.7);
    }
  }
  input {
    display: none;
  }
  img {
    width: 100px;
    height: 100px;
  }
`;
const StepTwo = styled.div`
  text-align: center;
  .imgs {
    display: flex;
    align-items: center;
    justify-content: center;

    img,
    .img-placeholder {
      display: block;
      width: 350px;
      height: 350px;
      object-fit: contain;
      margin: 1rem;
      border: 1px solid #000;
    }
  }
`;
const StepThree = styled.div``;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 60px;
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
  .nextBtn {
    border-radius: 19px;
    padding: 7px 28px;
    background: #7d64e1;
    margin-bottom: 20px;
    &:hover {
      color: #fff;
      background-color: #775ce3;
    }
  }
`;

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#9d8781',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;

  state = {
    title: 'Add clothes',
    categoryArr: '',
    file: '',
    previewURL: '',
    previewImg: null,
    afterRemoveBackgroundURL: '',
    snapshotString: '',
    activeStep: 0,
    loading: false,
  };

  getSteps = () => {
    return [
      'Upload clothes image',
      'Remove background',
      'Modify image',
      'Select category & add tags',
    ];
  };

  getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return 'Upload clothes image';
      case 1:
        return 'Remove background';
      case 2:
        return 'Modify image';
      case 3:
        return 'Select category & add tags';
      default:
        return 'Unknown stepIndex';
    }
  };

  onSelectImg = e => {
    // const { loading } = this.state;
    this.setState({ loading: true });
    this.resizeImg(e.target.files[0], 'abcd', 800, 800)
      .then(file => {
        this.setState({
          loading: false,
          activeStep: 1,
          previewURL: URL.createObjectURL(file),
          previewImg: file,
        });
      })
      .catch(error => {
        message.error(error.message);
        this.setState({ loading: false });
      });
  };

  resizeImg = (file, filename, resizeWidth, resizeHeight) => {
    return new Promise((resolve, reject) => {
      //load original image
      let original = new Image();
      original.onload = () => {
        // put image to canvas
        const canvas = document.createElement('canvas');
        canvas.width = resizeWidth;
        canvas.height = resizeHeight;
        // resize image using canvas
        const ctx = canvas.getContext('2d');
        const wCount = original.width / resizeWidth;
        const hCount = original.height / resizeHeight;
        let sx, sy, sw, sh;
        if (wCount > hCount) {
          // crop "vertically"
          sh = original.height;
          sw = (original.height * resizeWidth) / resizeHeight;
          sy = 0;
          sx = (original.width - sw) / 2;
        } else {
          // crop horizontally
          sw = original.width;
          sh = (original.width * resizeHeight) / resizeWidth;
          sx = 0;
          sy = (original.height - sh) / 2;
        }
        ctx.drawImage(original, sx, sy, sw, sh, 0, 0, resizeWidth, resizeHeight);
        // read from canvas to png image file
        let dataURL = canvas.toDataURL('image/png');
        // https://stackoverflow.com/a/43358515/12017013
        let arr = dataURL.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        resolve(new File([u8arr], filename, { type: mime }));
      };
      original.onerror = error => {
        reject(error);
      };
      original.src = URL.createObjectURL(file);
    });
  };

  removeBackground = () => {
    if (this.state.loading) return;

    this.setState({ loading: true });

    // first convert file to base64 so we can send to httpsCallable
    const reader = new FileReader();
    reader.onload = () => {
      // can call cloud function
      const removeBackground = firebase.functions().httpsCallable('removeBackground');
      removeBackground({ base64: reader.result })
        .then(result => {
          this.setState({
            afterRemoveBackgroundURL: 'data:image/png;base64,' + result.data,
            loading: false,
          });
        })
        .catch(error => {
          this.setState({ loading: false });
          // eslint-disable-next-line no-console
          console.error(error);
          message.error(error.message);
        });
    };
    reader.readAsDataURL(this.state.previewImg);
  };

  handleNext = () => {
    this.setState(state => ({ activeStep: state.activeStep + 1 }));
  };

  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  render() {
    const steps = this.getSteps();
    const { activeStep, loading, previewURL, afterRemoveBackgroundURL } = this.state;
    return (
      <Wrapper>
        <Loading loading={loading} />
        <Up>
          <Title>
            <UpImgWrapper>
              <img src={plusImg} />
            </UpImgWrapper>
            <span>Add clothes</span>
          </Title>
        </Up>

        <Down>
          <Stepper
            className="stepper"
            activeStep={activeStep}
            alternativeLabel
            connector={<QontoConnector />}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Content>
            {activeStep === 0 && (
              <StepOne>
                <Tooltip
                  arrow
                  title="Click to upload image"
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <label htmlFor="uploadImg">
                    <input
                      accept="image/*"
                      id="uploadImg"
                      type="file"
                      onChange={this.onSelectImg}
                    />
                    <Button className="iconButton" component="span">
                      <img src={uploadImg} />
                    </Button>
                  </label>
                </Tooltip>
                <Tooltip arrow title="Take a photo" TransitionComponent={Zoom} placement="top">
                  <Button className="iconButton">
                    <img src={cameraImg} />
                  </Button>
                </Tooltip>
              </StepOne>
            )}

            {/* ************************************** */}
            {/* Step2 */}
            {activeStep === 1 && (
              <StepTwo>
                <div>
                  <Button variant="contained" color="primary" onClick={this.removeBackground}>
                    Remove Background
                  </Button>
                </div>
                <div className="imgs">
                  <img src={previewURL} />
                  {afterRemoveBackgroundURL ? (
                    <img src={afterRemoveBackgroundURL} />
                  ) : (
                    <div className="img-placeholder" />
                  )}
                </div>
              </StepTwo>
            )}

            {/* ************************************** */}
            {/* Step3 */}
            {activeStep === 2 && (
              <StepThree>
                <ClothesFitter clothesSrc={previewURL} />
              </StepThree>
            )}
          </Content>

          <Buttons>
            {activeStep !== 0 && (
              <Button
                className="backBtn"
                variant="contained"
                color="primary"
                disabled={activeStep === 0}
                onClick={this.handleBack}
              >
                Back
              </Button>
            )}
            {activeStep !== 0 && (
              <Button
                className="nextBtn"
                variant="contained"
                color="primary"
                // disabled={activeStep === 2}
                onClick={this.handleNext}
              >
                {activeStep >= steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            )}
          </Buttons>
        </Down>
      </Wrapper>
    );
  }
}
