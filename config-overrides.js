const {
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy,
  useEslintRc,
} = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#7D64E1' },
  }),
  addDecoratorsLegacy(),
  useEslintRc('./.eslintrc')
);
