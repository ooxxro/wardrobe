import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Button, SvgIcon, IconButton, Zoom } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import userBgImg from '../images/userBgImg.jpg';
import { ReactComponent as UndoIcon } from '../images/undo.svg';
import { ReactComponent as LockIcon } from '../images/lock.svg';
import { ReactComponent as FilterIcon } from '../images/filter.svg';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: rgba(185, 185, 185, 0.2);
  padding: 0px 40px;
`;
const Content = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 30px;
  padding-bottom: 35px;
`;
const Random = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 25px;
  .random {
    padding: 0;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #8ff2b8;
    border-radius: 50%;
    /* padding: 44px 20px; */
    width: 70px;
    height: 70px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    line-height: 70px;
    color: #212121;
    &:hover {
      background: #75eda7;
      color: #212121;
    }
  }
`;
const Picture = styled.div`
  display: flex;
  align-items: center;
`;
const ImgWrapper = styled.div`
  width: 300px;
  height: 400px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
`;
const IconCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-left: 25px;
`;

const Save = styled.div`
  .save {
    width: 60px;
    height: 60px;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #aef0f7;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    border-radius: 50%;
    color: #212121;
    padding: 0;
    min-width: 60px;
    &:hover {
      background: #95f5ff;
      color: #212121;
    }
  }
`;
const UpperIcon = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  .undo {
    background: #f7d49e;
    margin-bottom: 10px;
    &:hover {
      background: #fcce88;
    }
  }
  .lock {
    margin-left: 10px;
    background: #fecdda;
    &:hover {
      background: #fcbbcc;
    }
  }
`;
const Clothes = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 25px;
`;
// const UpIcon = styled.div`
//   margin-bottom: 10px;
//   .undo {
//     background: #f7d49e;
//     &:hover {
//       background: #fcce88;
//     }
//   }
//   .lock {
//     margin-left: 10px;
//     background: #fecdda;
//     &:hover {
//       background: #fcbbcc;
//     }
//   }
// `;
const ChooseClothes = styled.div`
  width: 250px;
  height: 400px;
  background: #cde6fe;
  border-radius: 20px;
  .filter {
    background: #cbbfff;
    border: 0.5px solid white;
    &:hover {
      background: #c0b2ff;
    }
  }
`;

@withRouter
@observer
export default class Design extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <Wrapper>
        <Content>
          <Random>
            <Button className="random" variant="contained">
              Random
            </Button>
          </Random>
          <Picture>
            <ImgWrapper>
              <img src={userBgImg} />
            </ImgWrapper>
          </Picture>
          <IconCol>
            <UpperIcon>
              <Tooltip title="Undo" TransitionComponent={Zoom} placement="top">
                <IconButton className="undo">
                  <SvgIcon fontSize="small">
                    <UndoIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Lock Categories" TransitionComponent={Zoom} placement="top">
                <IconButton className="lock">
                  <SvgIcon fontSize="small">
                    <LockIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </UpperIcon>
            <Save>
              <Button className="save" variant="contained">
                Save
              </Button>
            </Save>
          </IconCol>
          <Clothes>
            {/* <UpIcon>
              <IconButton className="undo">
                <SvgIcon fontSize="small">
                  <UndoIcon />
                </SvgIcon>
              </IconButton>
              <IconButton className="lock">
                <SvgIcon fontSize="small">
                  <LockIcon />
                </SvgIcon>
              </IconButton>
            </UpIcon> */}
            <ChooseClothes>
              <Tooltip title="Filter Categories" TransitionComponent={Zoom} placement="top">
                <IconButton className="filter">
                  <SvgIcon fontSize="small">
                    <FilterIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </ChooseClothes>
          </Clothes>
        </Content>
      </Wrapper>
    );
  }
}
