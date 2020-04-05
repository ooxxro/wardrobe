import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import filterImg from '../images/filter.svg';
import userBgImg from '../images/userBgImg.jpg';
import lockImg from '../images/lock.svg';
import IOSSwitch from './IOSSwitch';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: rgba(185, 185, 185, 0.2);
  padding: 0px 40px;
`;
const Up = styled.div`
  padding-top: 20px;
  font-size: 20px;
`;

const Down = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 35px;
  /* overflow: hidden; */
`;
const Left = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 80px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .filter {
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #cbbfff;
    border-radius: 19px;
    padding: 7px 16px;
    font-size: 14px;
    color: #212121;
    &:hover {
      background: #c0b2ff;
      color: #212121;
    }
  }
  .random {
    padding: 0;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #8ff2b8;
    border-radius: 50%;
    /* padding: 44px 20px; */
    width: 100px;
    height: 100px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    line-height: 100px;
    color: #212121;
    &:hover {
      background: #75eda7;
      color: #212121;
    }
  }
`;
const Middle = styled.div`
  padding-bottom: 10px;
`;
const ImgWrapper = styled.div`
  width: 280px;
  height: 400px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
`;
const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  margin-left: 80px;
  .done {
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #aef0f7;
    border-radius: 19px;
    padding: 7px 16px;
    font-size: 16px;
    font-weight: bold;
    color: #212121;
    &:hover {
      background: #95f5ff;
      color: #212121;
    }
  }
`;
const Lock = styled.div`
  background: #fecdda;
  padding: 6px;
  border-radius: 10px;
  margin-bottom: 86px;
  .lock {
    text-align: center;
    padding: 5px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .lockItem {
    padding: 5px 10px;
    font-size: 14px;
    &:not(:last-child) {
      border-bottom: 0.5px solid #ff7298;
    }
    .MuiSwitch-root {
      margin: 0;
      margin-right: 10px;
    }
  }
`;

@withRouter
@observer
export default class Random extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <Wrapper>
        <Up>
          <span>Create your outfit within 3 mins! Go Go!</span>
        </Up>
        <Down>
          <Left>
            <Button className="filter" variant="contained">
              <img src={filterImg} />
              Filter
            </Button>
            <Button className="random" variant="contained">
              Random
            </Button>
          </Left>
          <Middle>
            <ImgWrapper>
              <img src={userBgImg} />
            </ImgWrapper>
          </Middle>
          <Right>
            <Lock>
              <div className="lock">
                <img src={lockImg} />
              </div>

              <div className="lockItem">
                <IOSSwitch name="checkedB" />
                Hat
              </div>
              <div className="lockItem">
                <IOSSwitch name="checkedB" />
                Shirt
              </div>
              <div className="lockItem">
                <IOSSwitch name="checkedB" />
                Pants
              </div>
              <div className="lockItem">
                <IOSSwitch name="checkedB" />
                Shoes
              </div>
            </Lock>
            <Button className="done" variant="contained">
              Done
            </Button>
          </Right>
        </Down>
      </Wrapper>
    );
  }
}
