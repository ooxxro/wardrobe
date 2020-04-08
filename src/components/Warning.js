import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const scaleWarning = keyframes`
	0% {
		transform: scale(1);
	}
	
	30% {
		transform: scale(1.02);
	}
	
	100% {
		transform: scale(1);
	}
`;

const pulseWarning = keyframes`
	0% {
		background-color: #fff;
		transform: scale(1);
		opacity: 0.5;
	}

	30% {
		background-color: #fff;
		transform: scale(1);
		opacity: 0.5;
	}

	100% {
		background-color: #F8BB86;
		transform: scale(1.7);
		opacity: 0;
	}
`;

const pulseWarningIns = keyframes`
    0% {
        background-color: #F8D486;
    }

    100% {
        background-color: #F8BB86;
    }
`;

const WarningCheckmark = styled.div`
  border-radius: 50%;
  border: 4px solid gray;
  height: 70px;
  padding: 0;
  position: relative;
  width: 70px;
  border-color: #f8bb86;
  animation: ${scaleWarning} 0.75s infinite alternate;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-color: #fff;
  }
  &:before {
    animation: ${pulseWarning} 2s linear infinite;
    opacity: 0;
  }
  &:after {
    display: block;
    z-index: 1;
  }

  .f-modal-body {
    background-color: #f8bb86;
    position: absolute;
    border-radius: 2px;
    left: 50%;
    transform: translateX(-50%);
    top: 9px;
    width: 5px;
    height: 33px;
    z-index: 2;
  }

  .f-modal-dot {
    background-color: #f8bb86;
    border-radius: 50%;
    bottom: 9px;
    width: 6px;
    height: 6px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    z-index: 2;
  }

  .pulseWarningIns {
    animation: ${pulseWarningIns} 0.75s infinite alternate;
  }
`;

@withRouter
@observer
export default class Design extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <WarningCheckmark className="warning">
        <span className="f-modal-body pulseWarningIns"></span>
        <span className="f-modal-dot pulseWarningIns"></span>
      </WarningCheckmark>
    );
  }
}
