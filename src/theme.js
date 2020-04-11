const { createMuiTheme } = require('@material-ui/core/styles');

const theme = {
  primary: '#7d64e1',
};

exports.theme = theme;

exports.MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primary,
    },
    // secondary: '',
    // error: '',
    // warning: '',
    // info: '',
    // success: '',
  },
});
