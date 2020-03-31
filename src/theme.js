const { createMuiTheme } = require('@material-ui/core/styles');

const theme = {
  primary: '#7D64E1',
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
