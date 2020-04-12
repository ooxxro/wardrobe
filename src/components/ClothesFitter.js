import React from 'react';
import styled from 'styled-components';
import mannequinImg from '../images/mannequin.svg';

const Wrapper = styled.div`
  width: 300px;
  height: 400px;
  padding: 50px;
  background: lightblue;
  position: relative;
  .mannequin {
    width: 100%;
    height: 100%;
  }
  .clothes {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 50%;
  }
`;

export default class ClothesFitter extends React.Component {
  state = {
    parentBox: {},
    dragging: false,
    startX: 0,
    startY: 0,
    dX: 0,
    dY: 0,
    top: 0,
    left: 0,
    width: 30,
    height: 30,
  };

  onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      parentBox: this.parentRef.getBoundingClientRect(),
      startX: e.clientX,
      startY: e.clientY,
      dragging: true,
      dX: 0,
      dY: 0,
    });

    // register event listeners
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  };
  onMouseMove = e => {
    e.preventDefault();
    e.stopPropagation();

    const { parentBox, startX, startY, left, top, width, height } = this.state;

    let dX = ((e.clientX - startX) * 100) / parentBox.width;
    let dY = ((e.clientY - startY) * 100) / parentBox.height;
    if (left + dX < 0) {
      dX = -left;
    } else if (left + dX + width > 100) {
      dX = 100 - left - width;
    }

    if (top + dY < 0) {
      dY = -top;
    } else if (top + dY + height > 100) {
      dY = 100 - top - height;
    }

    this.setState({
      dX,
      dY,
    });
  };
  onMouseUp = e => {
    e.preventDefault();
    e.stopPropagation();

    const { top, left, startX, startY, parentBox, width, height } = this.state;

    let dX = ((e.clientX - startX) * 100) / parentBox.width;
    let dY = ((e.clientY - startY) * 100) / parentBox.height;
    if (left + dX < 0) {
      dX = -left;
    } else if (left + dX + width > 100) {
      dX = 100 - left - width;
    }

    if (top + dY < 0) {
      dY = -top;
    } else if (top + dY + height > 100) {
      dY = 100 - top - height;
    }
    this.setState({ dragging: false, top: top + dY, left: left + dX, dX: 0, dY: 0 });

    // remove event listeners
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  render() {
    const { dX, dY, top, left, width, height } = this.state;

    return (
      <Wrapper ref={el => (this.parentRef = el)}>
        <img className="mannequin" src={mannequinImg} />
        <img
          className="clothes"
          src={this.props.clothesSrc}
          style={{
            top: `${top + dY}%`,
            left: `${left + dX}%`,
            width: `${width}%`,
            height: `${height}%`,
          }}
          onMouseDown={this.onMouseDown}
        />
      </Wrapper>
    );
  }
}
