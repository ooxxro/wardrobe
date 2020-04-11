import React from 'react';
import styled from 'styled-components';
import SyncLoader from 'react-spinners/SyncLoader';
import { Backdrop } from '@material-ui/core';

const StyledBackdrop = styled(Backdrop)`
  z-index: 1;
`;

export default function Loading({
  backdrop = true,
  loading,
  size = 15,
  margin = 2,
  color = '#21cbf3',
  ...props
}) {
  return backdrop ? (
    <StyledBackdrop {...props} open={loading}>
      <SyncLoader loading={loading} size={size} margin={margin} color={color} />
    </StyledBackdrop>
  ) : (
    <SyncLoader {...props} loading={loading} size={size} margin={margin} color={color} />
  );
}
