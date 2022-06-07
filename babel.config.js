// babel用一个loader去处理，叫做babel-loader
// npm install babel-loader @babel/core @babel/preset-env -D
module.exports = {
  // 预设
  presets: [
    // '@babel/preset-env',                    // 一个智能预设，允许您使用最新的javascript
    // '@babel/preset-react',                  // 一个用来编译jsx
    // '@babel/preset-typescript',             // 一个用来编译typescript
    ['@babel/preset-env', {useBuiltIns: "usage", corejs: 3}]                // 数组第二项增加配置           解决ES6已经ES6以上语法的兼容性问题        自动按需引入
  ]
}