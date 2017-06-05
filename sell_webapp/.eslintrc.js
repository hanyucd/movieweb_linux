// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
// -------------- start（添加的 code） --------------------------------
    /*
    ESLint规则:
      0: 不验证  1：警告  2：报错
    */

    //总是 添加分号
    'semi': ['error', 'always'],
    // 强制使用一致的缩径
    'indent': 0,
    // 禁止函数圆括号前有空格
    'space-before-function-paren': 0,
    // 关闭 tab 符号
    'no-tabs': 'off',
    // 命名变量时，要求双峰驼命名格式
    'camelcase': 0,
    'template-curly-spacing': 0
  }
}
