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
const ContentImgWrapper = styled.div`
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
  img {
    width: 100px;
    height: 100px;
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

@withRouter
@observer
export default class AddClothes extends React.Component {
  static contextType = StoreContext;

  state = {
    title: 'Add clothes',
    categoryArr: '',
    file: '',
    imagePreviewUrl: '',
    snapshotString: '',
    activeStep: 0,
  };

  getSteps = () => {
    return ['Upload clothes image', 'Modify image', 'Select category & add tags'];
  };

  getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return 'Select campaign settings...';
      case 1:
        return 'What is an ad group anyways?';
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'Unknown stepIndex';
    }
  };

  handleNext = () => {
    this.setState(state => ({ activeStep: state.activeStep + 1 }));
  };

  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  render() {
    const steps = this.getSteps();
    const { activeStep } = this.state;
    return (
      <Wrapper>
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
            <ContentImgWrapper>
              <Tooltip
                arrow
                title="Click to upload image"
                TransitionComponent={Zoom}
                placement="top"
              >
                <Button className="iconButton">
                  <img src={uploadImg} />
                </Button>
              </Tooltip>
              <Tooltip arrow title="Take a photo" TransitionComponent={Zoom} placement="top">
                <Button className="iconButton">
                  <img src={cameraImg} />
                </Button>
              </Tooltip>
            </ContentImgWrapper>
          </Content>

          <Buttons>
            <Button
              className="backBtn"
              variant="contained"
              color="primary"
              disabled={activeStep === 0}
              onClick={this.handleBack}
            >
              Back
            </Button>
            <Button
              className="nextBtn"
              variant="contained"
              color="primary"
              // disabled={activeStep === 2}
              onClick={this.handleNext}
            >
              {activeStep >= steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Buttons>
        </Down>
      </Wrapper>
    );
  }
}
