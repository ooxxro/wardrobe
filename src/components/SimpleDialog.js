import React from 'react';
// import Button from '@material-ui/core/Button';
// import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, SvgIcon, IconButton, Dialog } from '@material-ui/core';
import styled from 'styled-components';
import Success from './Success';
import Warning from './Warning';
import triangleImg from '../images/triangle.svg';
import splashImg from '../images/splash.svg';
import starImg from '../images/star.svg';
import { ReactComponent as CloseIcon } from '../images/close.svg';

const Wrapper = styled.div`
  background-image: url(${triangleImg});
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #fff;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;

  .star,
  .splash {
    position: absolute;
    z-index: -1;
  }
  .star {
    top: -16px;
    left: -10px;
    width: 170px;
    height: auto;
    transform: rotate(130deg);
  }
  .splash {
    top: 0;
    left: 0;
    width: 130px;
    height: auto;
  }

  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    .closeIcon {
      padding: 8px;
      font-size: 12px;
    }
  }

  .desc {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0 20px;
  }
`;

const IconWrapper = styled.div`
  padding-top: 50px;
  display: inline-block;
  .success {
    transform: scale(0.8);
  }
`;

const ButtonsWrapper = styled.div`
  padding: 10px 60px 40px;
  display: inline-flex;
  flex-direction: column;
  button {
    min-width: 184px;
    margin-bottom: 12px;
    text-transform: none;
    border-radius: 19px;
    padding: 5px 20px;
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
    const { open, buttons, onClose, description, type } = this.props;

    return (
      <Dialog fullWidth maxWidth="xs" onClose={this.handleClose} open={open}>
        <Wrapper>
          {/* top left image */}
          {type === 'success' && <img className="star" src={starImg} />}
          {type === 'warning' && <img className="splash" src={splashImg} />}

          {/* top right close button */}
          <span className="close">
            <IconButton className="closeIcon" size="small" onClick={onClose}>
              <SvgIcon fontSize="inherit">
                <CloseIcon />
              </SvgIcon>
            </IconButton>
          </span>

          {/* top center icon */}
          <IconWrapper>
            {type === 'success' && <Success />}
            {type === 'warning' && <Warning />}
          </IconWrapper>

          {/* description */}
          {description && <div className="desc">{description}</div>}

          {/* buttons */}
          <ButtonsWrapper>
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
          </ButtonsWrapper>
        </Wrapper>
      </Dialog>
    );
  }
}
