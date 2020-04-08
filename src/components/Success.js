import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const rotateCircle = keyframes`
  0% {
    transform: rotate(-45deg);
  }
  40%,
  100% {
    transform: rotate(-405deg);
  }
`;

const iconLineTip = keyframes`
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  50% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
`;

const iconLineLong = keyframes`
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
`;

const SuccessCheckmark = styled.div`
  height: 88px;
  width: 88px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  .check-icon {
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 4px solid #4caf50;
    &::before {
      top: 3px;
      left: -2px;
      width: 30px;
      transform-origin: 100% 50%;
      border-radius: 100px 0 0 100px;
    }
    &::after {
      top: 0;
      left: 30px;
      width: 60px;
      transform-origin: 0 50%;
      border-radius: 0 100px 100px 0;
      animation: ${rotateCircle} 0.7s ease-in;
    }
    &::before,
    &::after {
      content: '';
      height: 100px;
      position: absolute;
      background: #ffffff;
      transform: rotate(-45deg);
    }
    .icon-line {
      height: 5px;
      background-color: #4caf50;
      display: block;
      border-radius: 2px;
      position: absolute;
      z-index: 10;
      &.line-tip {
        top: 46px;
        left: 14px;
        width: 25px;
        transform: rotate(45deg);
        animation: ${iconLineTip} 0.7s;
      }
      &.line-long {
        top: 38px;
        right: 8px;
        width: 47px;
        transform: rotate(-45deg);
        animation: ${iconLineLong} 0.7s;
      }
    }
    .icon-circle {
      top: -4px;
      left: -4px;
      z-index: 10;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: absolute;
      box-sizing: content-box;
      border: 4px solid rgba(76, 175, 80, 0.5);
    }
    .icon-fix {
      top: 8px;
      width: 5px;
      left: 26px;
      z-index: 1;
      height: 85px;
      position: absolute;
      transform: rotate(-45deg);
      background-color: #ffffff;
    }
  }
`;

@withRouter
@observer
export default class Success extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <SuccessCheckmark>
        <div className="check-icon">
          <span className="icon-line line-tip"></span>
          <span className="icon-line line-long"></span>
          <div className="icon-circle"></div>
          <div className="icon-fix"></div>
        </div>
      </SuccessCheckmark>
    );
  }
}
