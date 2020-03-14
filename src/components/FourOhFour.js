import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  h1 {
    font-size: 40px;
    color: #fff;
  }
`;

export default () => (
  <Wrapper>
    <h1>Oops! 404 Not Found...</h1>
  </Wrapper>
);
