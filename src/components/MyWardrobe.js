import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import hangerImg from '../images/hanger.svg';
import clothesImg from '../images/clothes.png';
import hatImg from '../images/mywardrobe-cap.png';
import tshirtImg from '../images/mywardrobe-tshirt.png';
import pantsImg from '../images/mywardrobe-jeans.png';
import shoesImg from '../images/mywardrobe-shoe.png';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: #cde6fe;
  padding: 0px 40px;
`;

const Up = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 54px;
    height: 54px;
  }
  .add {
    text-transform: capitalize;
    background: #fed3c7;
    margin-left: 20px;
    margin-right: 14px;
    border-radius: 19px;
    padding: 7px 28px;
    font-size: 14px;
    color: #212121;
    &:hover {
      background: #fed3c7;
      color: #212121;
    }
  }
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 24px;
    font-weight: bold;
    color: #212121;
    margin-left: 14px;
  }
`;

const UpImgWrapper = styled.div``;
const Line = styled.div`
  height: 6px;
  margin: 0px -40px;
  background: linear-gradient(90deg, #01f1fe 0%, #4facfe 100%);
`;
const Down = styled.div`
  text-align: center;
  padding-bottom: 70px;
  overflow: hidden;
`;
const ropeLength = 80;
const CardWrapper = styled.div`
  display: inline-block;
  padding-top: ${ropeLength}px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: 50%;
    width: 4px;
    transform: translateX(-50%);
    height: calc(100% + ${ropeLength}px);
  }
  &.all {
    &::before {
      background: #33e2fc;
    }
  }
  &.hat {
    &::before {
      background: #3fcffc;
    }
  }
  &.shirt {
    &::before {
      background: #4bbdfc;
    }
  }
  &.pant {
    &::before {
      background: #39d9fc;
    }
  }
  &.shoe {
    &::before {
      background: #45c6fc;
    }
  }
`;
const LinkCard = styled(Link)`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  width: 200px;
  height: 120px;
  margin: 0 50px;
  border-radius: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  padding: 25px 35px;
  transition: box-shadow 0.2s;
  img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    transform: rotate(5deg);
  }
  &:hover {
    color: #fff;
    box-shadow: 3px 3px 8px 1px #aabed1;
  }
  &.all {
    background: #a690ff;
  }
  &.hat {
    background: #6fb9ff;
  }
  &.shirt {
    background: #ff7c9f;
  }
  &.pant {
    background: #24d9ed;
  }
  &.shoe {
    background: #ff9d81;
  }
`;
const ImgWrapper = styled.div``;

@observer
export default class MyWardrobe extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <Wrapper>
        <Up>
          <Title>
            <UpImgWrapper>
              <img src={hangerImg} />
            </UpImgWrapper>
            <span>My wardrobe</span>
          </Title>
          <Button className="add" component={Link} to="/add-clothes" variant="contained">
            + Add Clothes
          </Button>
        </Up>
        <Line />
        <Down>
          <CardWrapper className="all">
            <LinkCard className="all">
              <ImgWrapper>
                <img src={clothesImg} />
              </ImgWrapper>
              <span>ALL</span>
            </LinkCard>
          </CardWrapper>
          <CardWrapper className="hat">
            <LinkCard className="hat">
              <ImgWrapper>
                <img src={hatImg} />
              </ImgWrapper>
              <span>Hats</span>
            </LinkCard>
          </CardWrapper>
          <CardWrapper className="shirt">
            <LinkCard className="shirt">
              <ImgWrapper>
                <img src={tshirtImg} />
              </ImgWrapper>
              <span>Shirts</span>
            </LinkCard>
          </CardWrapper>
          <CardWrapper className="pant">
            <LinkCard className="pant">
              <ImgWrapper>
                <img src={pantsImg} />
              </ImgWrapper>
              <span>Pants</span>
            </LinkCard>
          </CardWrapper>
          <CardWrapper className="shoe">
            <LinkCard className="shoe">
              <ImgWrapper>
                <img src={shoesImg} />
              </ImgWrapper>
              <span>Shoes</span>
            </LinkCard>
          </CardWrapper>
        </Down>
      </Wrapper>
    );
  }
}
