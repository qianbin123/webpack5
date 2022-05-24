import "../src/css/index.css"
import "../src/less/index.less"

document.getElementById("btn").onclick = function(){
  // promise形式返回, 解构出 sum
  // 另外eslint不识别动态导入语法，需要在.eslintrc.js配置一下 plugins: ["import"]
  // /* webpackChunkName: "count" */ 为chunk重命名，方便后期排查，另外配合 webpack 配置文件 chunFilename: "static/js/[name].js"
  import(/* webpackChunkName: "count" */"./js/count.js").then(({ sum }) => {
    console.log(sum(2, 5))
  })
}