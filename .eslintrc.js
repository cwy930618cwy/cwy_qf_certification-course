module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //强制使用单引号
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'never'],
    // 关闭冲突规则
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, //单引号
        semi: false, //句尾添加分号
        trailingComma: 'none', //在对象或数组最后一个元素后面是否加逗号
        printWidth: 210,
        bracketSpacing: true //{ d } 对像要有空格
      }
    ]
  }
}
