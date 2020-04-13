import React from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import mannequinImg from '../images/mannequin.svg';

const WIDTH = 300;
const HEIGHT = 400;

const Wrapper = styled.div`
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  padding: 60px 50px;
  background: #e8dcdc;
  position: relative;
  border-radius: 30px;
  margin-bottom: 20px;
  .mannequin {
    width: 100%;
    height: 100%;
  }
  .react-draggable {
    .corner,
    .side {
      position: relative;
      &:after {
        content: '';
        border: 0.5px solid #07badd;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        transform: translate(-50%, -50%);
        opacity: 0;
      }
    }
    &:hover {
      outline: 0.5px solid gray;
      .corner,
      .side {
        &:after {
          opacity: 1;
        }
      }
    }
  }
  .clothes {
    width: 100%;
    height: 100%;
  }
`;

export default class ClothesFitter extends React.Component {
  static WIDTH = WIDTH;
  static HEIGHT = HEIGHT;

  render() {
    const {
      lockAspectRatio,
      state,
      state: { x, y, width, height },
      onChange,
    } = this.props;

    return (
      <Wrapper ref={el => (this.parentRef = el)}>
        <img className="mannequin" src={mannequinImg} draggable={false} />

        <Rnd
          bounds="parent"
          resizeHandleClasses={{
            bottomLeft: 'corner',
            bottomRight: 'corner',
            topLeft: 'corner',
            topRight: 'corner',
            left: 'side',
            right: 'side',
            top: 'side',
            bottom: 'side',
          }}
          lockAspectRatio={lockAspectRatio}
          size={{ width, height }}
          position={{ x, y }}
          onDragStop={(e, d) => onChange({ ...state, x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            onChange({
              width: width + delta.width,
              height: height + delta.height,
              ...position,
            });
          }}
        >
          <img draggable={false} className="clothes" src={this.props.clothesSrc} />
        </Rnd>
      </Wrapper>
    );
  }
}
