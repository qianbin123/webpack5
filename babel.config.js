// babel用一个loader去处理，叫做babel-loader
// npm install babel-loader @babel/core @babel/preset-env -D
module.exports = {
  // 预设
  presets: [
    '@babel/preset-env',                    // 一个智能预设，允许您使用最新的javascript
    // '@babel/preset-react',                  // 一个用来编译jsx
    // '@babel/preset-typescript',             // 一个用来编译typescript
  ]
}