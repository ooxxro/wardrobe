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
  padding: 0 160px 50px 160px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  .next {
    width: 184px;
    margin-top: 10px;
    text-transform: none;
    background: #aef0f7;
    border-radius: 19px;
    padding: 5px 16px;
    font-size: 14px;
    color: #212121;
    font-weight: bold;
    &:hover {
      background: #7ceaf5;
      color: #212121;
    }
  }
  .exit {
    width: 184px;
    margin-top: 10px;
    background: #bdadfd;
    text-transform: none;
    border-radius: 19px;
    padding: 5px 16px;
    font-size: 14px;
    color: #212121;
    font-weight: bold;
    &:hover {
      background: #b4a2ff;
      color: #212121;
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
    const { open, description } = this.props;

    return (
      <Dialog onClose={this.handleClose} open={open}>
        <Wrapper>
          <Star>
            <img src={starImg} />
          </Star>
          <SuccessCircle className="circle">
            <Success />
          </SuccessCircle>
          <div>{description}</div>
          <NextStep>
            <Button className="next" variant="contained">
              Download
            </Button>
            <Button className="next" variant="contained">
              Save to My Favorites
            </Button>
            <Button className="next" variant="contained">
              Go to Design
            </Button>
            <Button className="exit" variant="contained">
              Exit without Saving
            </Button>
          </NextStep>
          <Close className="close">
            <IconButton className="closeIcon" size="small">
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
