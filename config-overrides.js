const {
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy,
  useEslintRc,
} = require('customize-cra');
const theme = require('./src/theme');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': theme.primary },
  }),
  addDecoratorsLegacy(),
  useEslintRc('./.eslintrc')
);
