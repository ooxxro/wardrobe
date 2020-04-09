import React from 'react';
import styled, { keyframes } from 'styled-components';

const stripe = keyframes`
  0% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(44px);
  }
`;

const Wrapper = styled.div`
  height: 20px;
  width: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3) inset;

  .progress {
    height: 100%;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
    transition: width 1s linear;
    &:before,
    &:after {
      content: '';
      position: absolute;
    }
    &:before {
      top: 0;
      left: -100px;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        115deg,
        #1bdafe,
        #1bdafe 20px,
        #1bdafe66 20px,
        #1bdafe66 40px
      );
      background-size: 100% 40px;
      background-position-x: 0;
      background-position-y: -10px;
      animation: ${stripe} 0.5s linear infinite;
    }
    &:after {
      top: 3px;
      width: calc(100% - 10px);
      left: 50%;
      transform: translateX(-50%);
      height: 4px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

export default function ProgressBar(props) {
  return (
    <Wrapper {...props} className="progressBar">
      <div className="progress" style={{ width: `${props.percent}%` }} />
    </Wrapper>
  );
}
