import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Stepper, Step, StepLabel, Button, Tooltip, Zoom } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import { PlusOutlined } from '@ant-design/icons';
import { message, Tag, Input, Radio } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import plusImg from '../images/plus.svg';
import uploadImg from '../images/upload-cloud.png';
import cameraImg from '../images/camera.png';
import Loading from './Loading';
import ClothesFitter from './ClothesFitter';
import IOSSwitch from './IOSSwitch';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: #ffdad0;
  padding: 0px 40px 50px;
`;

const Up = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
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
  margin: 40px 60px 10px;
  h3 {
    font-size: 18px;
    margin: 0 auto 10px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
  }
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
const StepTwo = styled.div``;
const StepThree = styled.div`
  display: flex;
  padding: 0 0 0 60px;
  font-size: 16px;
  .stepThreeMsg {
    margin: 60px 0 0 40px;
    h3 {
      margin-bottom: 20px;
    }
  }
`;
const StepFour = styled.div`
  display: flex;
  .left {
    padding: 30px;
    img {
      width: 300px;
      height: auto;
    }
  }
  .right {
    flex: 1;
    .selectCat {
      margin: 40px 0;
    }
    .radioBtn {
      margin: 6px 3px;
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
        /* &:hover {
          border: 2px solid #f36d6f;
          box-shadow: 1px #f36d6f;
        } */
      }
      .ant-tag {
        margin: 6px 3px;
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
        padding: 8px 8px 8px 12px;
        border: 2px solid #9887e6;
        span {
          padding: 2px;
          margin-left: 9px;
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
  }
`;

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

const steps = [
  'Upload clothes image',
  'Remove background',
  'Modify image',
  'Select category & add tags',
];

@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;

  state = {
    loading: false,
    activeStep: 0,

    // step1: upload img
    previewURL: '',
    aspectRatio: 1,
    lockAspectRatio: true,

    // step 4: category & tags\
    category: 'shirts',
    tags: [],
    tagsInputVisible: false,
    newTagValue: '',
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
    this.resizeImg(e.target.files[0], 'abcd', 600, 600)
      .then(({ file, aspectRatio }) => {
        this.setState({
          loading: false,
          activeStep: 1,
          previewURL: URL.createObjectURL(file),
          aspectRatio,
        });
      })
      .catch(error => {
        message.error(error.message);
        this.setState({ loading: false });
      });
  };

  resizeImg = (file, filename, resizeWidth, resizeHeight) => {
    return new Promise((resolve, reject) => {
      // load original image
      let original = new Image();
      original.onload = () => {
        // put image to canvas
        const canvas = document.createElement('canvas');
        const wCount = original.width / resizeWidth;
        const hCount = original.height / resizeHeight;
        if (wCount > hCount) {
          // original image is a "wide" one
          canvas.width = resizeWidth;
          canvas.height = (resizeWidth * original.height) / original.width;
        } else {
          // original image is a "tall" one
          canvas.height = resizeHeight;
          canvas.width = (resizeHeight * original.width) / original.height;
        }
        // resize image using canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          original,
          0,
          0,
          original.width,
          original.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
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
        resolve({
          file: new File([u8arr], filename, { type: mime }),
          aspectRatio: original.width / original.height,
        });
      };
      original.onerror = error => {
        reject(error);
      };
      original.src = URL.createObjectURL(file);
    });
  };

  handleNext = () => {
    this.setState(state => ({ activeStep: state.activeStep + 1 }));
  };

  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
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
      activeStep,
      loading,
      previewURL,
      aspectRatio,
      lockAspectRatio,
      category,
      tags,
      tagsInputVisible,
      newTagValue,
    } = this.state;

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
                <img src={previewURL} />
              </StepTwo>
            )}

            {/* ************************************** */}
            {/* Step3 */}
            {activeStep === 2 && (
              <StepThree>
                <ClothesFitter
                  clothesSrc={previewURL}
                  initialAspectRatio={aspectRatio}
                  lockAspectRatio={lockAspectRatio}
                />

                <div className="stepThreeMsg">
                  <h3>Drag and resize clothes to fit mannequin</h3>
                  <IOSSwitch
                    name="lockAspectRatio"
                    checked={lockAspectRatio}
                    onChange={e => this.setState({ lockAspectRatio: e.target.checked })}
                  />
                  Lock aspect ratio
                </div>
              </StepThree>
            )}

            {/* ************************************** */}
            {/* Step4 */}
            {activeStep === 3 && (
              <StepFour>
                <div className="left">
                  <img src={previewURL} />
                </div>
                <div className="right">
                  <div className="selectCat">
                    <h3>Select category for your clothes:</h3>
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
                  </div>
                  <div className="addTags">
                    <h3>Add custom tags:</h3>
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
                </div>
              </StepFour>
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
