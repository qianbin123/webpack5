import "../src/css/index.css"
import "../src/less/index.less"
// import "core-js"; // 用来解决ES6已经ES6以上语法的兼容性问题        全部加载
// import "core-js/es/promise"     // 用来解决ES6已经ES6以上语法的兼容性问题        按需手动引入对应语法

document.getElementById("btn").onclick = function(){
  // promise形式返回, 解构出 sum
  // 另外eslint不识别动态导入语法，需要在.eslintrc.js配置一下 plugins: ["import"]
  // /* webpackChunkName: "count" */ 为chunk重命名，方便后期排查，另外配合 webpack 配置文件 chunFilename: "static/js/[name].js"
  import(/* webpackChunkName: "count" */"./js/count.js").then(({ sum }) => {
    console.log(sum(2, 5))
  })
}

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}