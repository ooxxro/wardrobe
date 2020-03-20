import React from 'react';
import styled from 'styled-components';
import welcomeHero from '../images/welcome-hero.jpg';
import welcomeClothes from '../images/welcome-clothes.png';
import hatImg from '../images/welcome-cap.svg';
import shirtImg from '../images/welcome-tshirt.svg';
import pantImg from '../images/welcome-jeans.svg';
import shoeImg from '../images/welcome-shoe.svg';
import arrowImg from '../images/arrow.png';
import { Button } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';

const Wrapper = styled.div``;
const Hero = styled.section`
  /* width:  */
  height: 550px;
  position: relative;
  padding: 176px 300px 100px 100px;
  &::before {
    content: '';
    background: url(${welcomeHero}) center top/cover no-repeat #8ff2b8;
    position: absolute;
    opacity: 0.4;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &::after {
    content: '';
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;
const HeroContent = styled.div`
  max-width: 500px;
  position: relative;
  z-index: 1;
  text-align: center;
  h1 {
    font-size: 46px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }
  h2 {
    font-size: 16px;
    color: #fff;
    margin-top: 6px;
  }
  div {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    .login,
    .signup {
      border-radius: 19px;
      padding: 7px 28px;
    }
    .login {
      background: #6247ce;
      &:hover {
        color: #fff;
      }
    }
    .signup {
      background: #fff;
      margin-left: 20px;
      margin-right: 14px;
      &:hover {
        color: #212121;
      }
    }
  }
`;
const Down = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 850px;
  background: #f2f2f4;
  padding-bottom: 120px;
`;
const Left = styled.div`
  width: 552px;
  border: 6px dashed #8c74ff;
  border-radius: 10%;
  padding: 10px;
`;
const Card = styled.div`
  display: inline-flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  align-items: center;
  line-height: 31px;
  vertical-align: top;
  width: 240px;
  height: 188px;
  margin: 10px;
  border-radius: 20px;
  font-size: 26px;
  font-weight: bold;
  /* padding-bottom: 25px; */
  /* border: 1px solid currentColor; */
  background: #fff;
  box-shadow: 3px 3px 8px 0.5px #dedede;
  &.hats {
    color: #6fb9ff;
  }
  &.shirts {
    color: #ff7c9f;
  }
  &.pants {
    color: #24d9ed;
  }
  &.shoes {
    color: #ff9d81;
  }
  img {
    width: 100px;
    height: 100px;
    transform: rotate(5deg);
  }
`;
const Middle = styled.div`
  margin-left: 60px;
  width: 60px;
  img {
    width: 100%;
    height: 100%;
  }
`;
const Right = styled.div`
  margin-left: 80px;
`;
const ImgWrapper = styled.div`
  width: 280px;
  height: 400px;
  transform: rotate(12deg);
  position: relative;
  &::after {
    content: '';
    border: 3px solid #8c74ff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translate(-18px, 16px);
    z-index: -1;
  }
  img {
    object-fit: contain;
    background: #fff;
    width: 100%;
    height: 100%;
    box-shadow: 2px 2px 8px 0.5px #dedede;
  }
`;
export default class HomeWelcome extends React.Component {
  render() {
    return (
      <Wrapper>
        <Hero>
          <HeroContent>
            <h1>Welcome to Wardrobe</h1>
            <h2>If you find yourself tend to be lazy deciding what outfit to wear.</h2>
            <div>
              <Button
                className="login"
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button>
              <Button className="signup" component={Link} to="/signup" variant="contained">
                SIGN UP NOW
              </Button>
            </div>
          </HeroContent>
        </Hero>
        <Down>
          <Left>
            <Card className="hats">
              <img src={hatImg} />
              <span>Hats</span>
            </Card>
            <Card className="shirts">
              <img src={shirtImg} />
              <span>Shirts</span>
            </Card>
            <Card className="pants">
              <img src={pantImg} />
              <span>Pants</span>
            </Card>
            <Card className="shoes">
              <img src={shoeImg} />
              <span>Shoes</span>
            </Card>
          </Left>
          <Middle>
            <img src={arrowImg} />
          </Middle>
          <Right>
            <ImgWrapper>
              <img src={welcomeClothes} />
            </ImgWrapper>
          </Right>
        </Down>
      </Wrapper>
    );
  }
}
