import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../stores';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Zoom, FormControlLabel, Checkbox, Tooltip, Popover } from '@material-ui/core';
import heartImg from '../images/heart.svg';
import filterImg from '../images/filter.svg';
import placeHolderImg from '../images/userBgImg.jpg';
import placeHolder1Img from '../images/userBgImg1.jpg';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto 100px;
  border-radius: 30px;
  background: #e0ddf3;
  padding: 0px 40px 50px;
`;

const Up = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 0 10px;
  img {
    width: 50px;
    height: 50px;
  }
`;
const UpImgWrapper = styled.div``;
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

const Down = styled.div`
  .filter {
    margin: 2px 0 6px 124px;
    text-transform: capitalize;
    background: #cbbfff;
    border-radius: 3px;
    padding: 7px 16px;
    font-size: 14px;
    color: #212121;
    &:hover {
      background: #c0b2ff;
      color: #212121;
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
`;

const Content = styled.div`
  padding: 0 110px 10px;
  img {
    width: 150px;
    height: 200px;
    margin: 20px 10px;
  }
`;

const CheckboxoxList = styled.div`
  padding: 0 6px;
  background: #d8d0fc;
  .filterItem {
    padding-right: 11px;
    font-size: 14px;
    &:not(:last-child) {
      border-bottom: 0.5px solid #8c72ff;
    }
    span {
      font-size: 14px;
    }
  }
  .MuiFormControlLabel-root {
    margin: 0;
  }
  .MuiSvgIcon-root {
    color: #7d64e1;
  }
`;

@withRouter
@observer
export default class MyFavorites extends React.Component {
  static contextType = StoreContext;
  state = {
    turnon: false,
    tagdata: [],
    tagtoggled: [],
    summer: false,
    pink: false,
  };

  render() {
    return (
      <Wrapper>
        <Up>
          <Title>
            <UpImgWrapper>
              <img src={heartImg} />
            </UpImgWrapper>
            <span>My favorites</span>
          </Title>
        </Up>

        <Down>
          {/* filter */}
          <Tooltip arrow title="Filter categories" TransitionComponent={Zoom} placement="top">
            <Button
              className="filter"
              variant="contained"
              ref={el => (this.filterBtnRef = el)}
              onClick={() => this.setState({ turnon: true })}
            >
              <img src={filterImg} />
              Filter
            </Button>
          </Tooltip>
          <Popover
            open={this.state.turnon}
            anchorEl={this.filterBtnRef}
            onClose={() => this.setState({ turnon: false })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {/* show all user defined tags */}
            <CheckboxoxList>
              {/* {(this.state.tagdata || []).map((tag, index) => (
                <div className="filterItem" key={tag}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={tag}
                        color="primary"
                        onChange={() => this.onSelectTag(index)}
                      />
                    }
                    label={tag}
                  />
                </div>
              ))} */}

              <div className="filterItem">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.summer}
                      onChange={() => this.setState(state => ({ summer: !state.summer }))}
                      name="summer"
                      color="primary"
                    />
                  }
                  label="Summer"
                />
              </div>
              <div className="filterItem">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.pink}
                      onChange={() => this.setState(state => ({ pink: !state.pink }))}
                      name="pink"
                      color="primary"
                    />
                  }
                  label="Pink"
                />
              </div>
            </CheckboxoxList>
          </Popover>
          <Content>
            <img src={placeHolderImg} />
            <img src={placeHolder1Img} />
            <img src={placeHolderImg} />
            <img src={placeHolder1Img} />
            <img src={placeHolderImg} />
            <img src={placeHolder1Img} />
            <img src={placeHolderImg} />
            <img src={placeHolder1Img} />
            <img src={placeHolderImg} />
            <img src={placeHolder1Img} />
          </Content>
        </Down>
      </Wrapper>
    );
  }
}
