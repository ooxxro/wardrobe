import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const width = 32;
const height = 20;
const padding = 2;
const IOSSwitch = withStyles(theme => ({
  root: {
    width: width,
    height: height,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: padding,
    '&$checked': {
      transform: `translateX(${width - 2 * padding - (height - 2 * padding)}px)`,
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#FD4A7A',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#FD4A7A',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: height - 2 * padding,
    height: height - 2 * padding,
  },
  track: {
    borderRadius: height / 2,
    border: `1px solid #656565`,
    backgroundColor: '#656565',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default IOSSwitch;
