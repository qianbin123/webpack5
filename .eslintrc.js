// 1. eslint在webpack4时候，是以loader形式去处理，在webpack5时，是以plugin形式去处理
// 2. 安装 npm install eslint-webpack-plugin eslint --save-dev
// 3. vscode安装eslint插件可以帮忙在开始时候抓出规范错误，另外如果让vscode忽略校验文件，可以用.eslintignore文件，让webpage打包时候忽略校验文件，可以直接在webpack.config文件中配置

/************************************ 情况一 ****************************************/
// module.exports = {
//   // 继承其他规则
//   extends: ["react-app"],
//   // 解析选项
//   parserOptions: {
//     ecmaVersion: 6,       // ES 语法版本
//     sourceType: "module",     // ES 模块化
//     ecmaFeatures: {
//       jsx: true         // 如果是React项目，就需要开启jsx语法
//     }
//   },
//   // 具体检查规则，另外我们的规则会覆盖掉extends中react-app的规则
//   rules: {
//     semi: "error",         // 禁止使用分号
//     'array-callback-return': 'warn',    // 强制数组方法的回调函数中有return语句，否则警告
//     'default-case': [
//       'warn',              // 要求 switch 语句中有 default 分支，否则警告
//       { commentPattern: '^no default' }       // 允许在最后注释 no default，就不会有警告
//     ],
//     eqeqeq: [
//       'warn',         // 强制使用 === 和 !== 否则警告
//       'smart'
//     ]
//   },
// }

/************************************ 情况二 ****************************************/
module.exports = {
  // 继承 Eslint 规则
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: "module", // es module
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
  },
  plugins: ["import"], // 解决动态导入语法报错
};