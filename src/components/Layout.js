import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

const Header = styled.header`
  background: pink;
`;

const Content = styled.div`
  background: lightblue;
`;

export default class Layout extends Component {
  render() {
    return (
      <Fragment>
        <Header>I'm header</Header>
        <Content>{this.props.children}</Content>
        <footer>im footer</footer>
      </Fragment>
    );
  }
}
