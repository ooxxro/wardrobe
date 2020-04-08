import React from 'react';
// import Button from '@material-ui/core/Button';
// import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, SvgIcon, IconButton, Dialog } from '@material-ui/core';
import styled from 'styled-components';
import Success from './Success';
import triangleImg from '../images/triangle.png';
import starImg from '../images/star.svg';
import { ReactComponent as CloseIcon } from '../images/close.svg';

const Wrapper = styled.div`
  /* TODO:  */
  /* width: 480px;
  height: 380px; */
  background-image: url(${triangleImg});
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #fff;
  position: relative;
  text-align: center;
  .desc {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;
const Star = styled.div`
  position: absolute;
  top: -16px;
  left: -10px;
  width: 170px;
  height: auto;
  transform: rotate(130deg);
`;

const SuccessCircle = styled.div`
  padding-top: 50px;
  /* position: absolute;
  top: 44px;
  right: 169px; */
  transform: scale(0.8);
`;

const NextStep = styled.div`
  padding: 10px 160px 40px;
  display: flex;
  flex-direction: column;
  button {
    min-width: 184px;
    margin-bottom: 12px;
    text-transform: none;
    border-radius: 19px;
    padding: 5px 16px;
    font-size: 14px;
    font-weight: bold;
    color: #212121;
    &:hover {
      color: #212121;
    }
  }
  .next {
    background: #aef0f7;
    &:hover {
      background: #7ceaf5;
    }
  }
  .exit {
    background: #bdadfd;
    &:hover {
      background: #b4a2ff;
    }
  }
`;

const Close = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  .closeIcon {
    padding: 8px;
    font-size: 12px;
  }
`;

export default class SimpleDialog extends React.Component {
  handleClose = () => {
    const { onClose, selectedValue } = this.props;
    onClose(selectedValue);
  };

  handleListItemClick = value => {
    const { onClose } = this.props;
    onClose(value);
  };
  render() {
    const { open, buttons, onClose, description } = this.props;

    return (
      <Dialog onClose={this.handleClose} open={open}>
        <Wrapper>
          <Star>
            <img src={starImg} />
          </Star>
          <SuccessCircle className="circle">
            <Success />
          </SuccessCircle>
          {description && <div className="desc">{description}</div>}

          <NextStep>
            {buttons &&
              buttons.map((button, i) => (
                <Button
                  key={i}
                  className={button.exit ? 'exit' : 'next'}
                  variant="contained"
                  onClick={button.onClick}
                >
                  {button.text}
                </Button>
              ))}
          </NextStep>

          <Close className="close">
            <IconButton className="closeIcon" size="small" onClick={onClose}>
              <SvgIcon fontSize="inherit">
                <CloseIcon />
              </SvgIcon>
            </IconButton>
          </Close>
        </Wrapper>
      </Dialog>
    );
  }
}
