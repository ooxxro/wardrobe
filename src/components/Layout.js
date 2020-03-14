import React, { Component } from 'react';
import styled from 'styled-components';
import Header from './Header';

const Wrapper = styled.div`
  background: linear-gradient(90deg, #6b8ade 0%, #7d64e1 100%);
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
  color: #ffffff;
`;

export default class Layout extends Component {
  render() {
    return (
      <Wrapper>
        <Header />
        <Content>{this.props.children}</Content>
        <Footer>Wardrobe Team 2020 &nbsp; &mdash; &nbsp; All Rights Reserved</Footer>
      </Wrapper>
    );
  }
}
