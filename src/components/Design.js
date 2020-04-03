import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import userBgImg from '../images/userBgImg.jpg';

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
const Picture = styled.div``;
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
const Save = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  margin-left: 25px;
  .save {
    width: 60px;
    height: 60px;
    margin-bottom: 30px;
    text-transform: capitalize;
    background: #aef0f7;
    font-size: 16px;
    font-weight: bold;
    /* text-align: center;
    line-height: 60px; */
    border-radius: 50%;
    color: #212121;
    &:hover {
      background: #95f5ff;
      color: #212121;
    }
  }
`;
const Clothes = styled.div``;

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
          <Save>
            <Button className="save" variant="contained">
              Save
            </Button>
          </Save>
          <Clothes></Clothes>
        </Content>
      </Wrapper>
    );
  }
}
