import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import rightImg from '../images/main-placeholder.png';
import hangerImg from '../images/hangers.png';
import featherImg from '../images/feathers.png';
import heartImg from '../images/hearts.png';
import plusImg from '../images/pluses.png';
import questionImg from '../images/questions.png';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 45px 0 80px;
`;
const cardWidth = 240;

const Left = styled.div`
  width: ${cardWidth * 2 + 10 * 4}px;
`;
const LinkCard = styled(Link)`
  display: inline-flex;
  align-items: flex-end;
  line-height: 31px;
  vertical-align: top;
  width: ${cardWidth}px;
  height: 150px;
  margin: 10px;
  border-radius: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #212121;
  padding: 25px 35px;
  &:hover {
    color: #212121;
  }
  &.my-wardrobe {
    background: url(${hangerImg}) right center/contain no-repeat #cde6fe;
  }
  &.design {
    background: url(${featherImg}) right center/contain no-repeat #fecdda;
  }
  &.my-favorite {
    background: url(${heartImg}) right center/contain no-repeat #aef0f7;
  }
  &.add-clothes {
    background: url(${plusImg}) right center/contain no-repeat #fed3c7;
  }
  &.random {
    background: url(${questionImg}) right center/contain no-repeat #8ff2b8;
  }
`;
const Right = styled.div`
  margin-left: 80px;
`;
const ImgWrapper = styled.div`
  width: 280px;
  height: 400px;
  transform: rotate(10deg);
  position: relative;
  &::after {
    content: '';
    border: 3px solid #d3d3d3;
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
    background: #e9e9e9;
    width: 100%;
    height: 100%;
  }
`;

@observer
export default class HomeMain extends React.Component {
  static contextType = StoreContext;

  render() {
    return (
      <Wrapper>
        <Left>
          <LinkCard to="/my-wardrobe" className="my-wardrobe">
            <span>
              My
              <br />
              Wardrobe
            </span>
          </LinkCard>
          <LinkCard to="/design" className="design">
            <span>Design</span>
          </LinkCard>
          <LinkCard to="/my-favorites" className="my-favorite">
            <span>
              My
              <br />
              Favorite
            </span>
          </LinkCard>
          <LinkCard to="/add-clothes" className="add-clothes">
            <span>Add Clothes</span>
          </LinkCard>
          <LinkCard to="/random" className="random">
            <span>Random</span>
          </LinkCard>
        </Left>
        <Right>
          <ImgWrapper>
            <img src={rightImg} />
          </ImgWrapper>
        </Right>
      </Wrapper>
    );
  }
}
