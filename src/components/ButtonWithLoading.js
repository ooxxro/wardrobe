import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress } from '@material-ui/core';

const Wrapper = styled.span`
  position: relative;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .MuiCircularProgress-root {
      display: block;
    }
  }
`;
export default function ButtonWithLoading(props) {
  const { loading, loadingSize = 18, loadingColor = 'secondary', ...forwardProps } = props;

  return (
    <Wrapper className="button-with-loading">
      <Button {...forwardProps}>{props.children}</Button>
      {loading && (
        <div className="loading">
          <CircularProgress size={loadingSize} color={loadingColor} />
        </div>
      )}
    </Wrapper>
  );
}
