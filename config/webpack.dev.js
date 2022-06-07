const path = require("path");

// 插件需要引入才能用
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const os = require("os");
const threads = os.cpus().length; // cpu核数

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/main.js",
  // 所有文件的输出路径
  output: {
    path: undefined,            // 开发模式没输出，可以undefined
    // 入口文件打包输出名
    filename: "static/js/[name].js",
    // 给打包输出的其他文件命名
    chunkFilename: "static/js/[name].chunk.js",
    // 图片、字体等通过type:asset处理资源命名方式
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  module: {
    rules: [
      {
        // 只要匹配到一个loader，剩下的就不匹配了
        oneOf: [
          {
            test: /\.css$/,
            use: [    // 从右到左
              "style-loader",      // 将js中的css通过创建style标签添加到html文件中生效
              "css-loader"         // 将css编译成commonjs的模块资源
            ],    
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              'css-loader',
              'less-loader',    // 将less转成css文件
            ],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader", // 将sass编译成css文件
            ],
          },
          {
            test: /\.styl$/,
            use: [
              "style-loader",
              "css-loader",
              "stylus-loader", // 将stylus编译成css文件
            ],
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",       // 相当于 结合了webpack4中的url-loader和file-loader
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024       // 小于 10M 转成base64字符串，来减少请求
              }
            },
            // 这里的图片和下面的字体文件可以输出位置复用
            // generator: {
              // hash:6 hash取前6位 ext 为文件名扩展符 query 指携带的其他参数
              // filename: 'static/images/[hash:6][ext][query]'
            // }
          },
          {
            // 对字体文件处理以及处理其他资源（如：音视频）
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: "asset/resource",       // 相当于 webpack4中 file-loader ： 只会对文件源做一个输出，不会转成base64字符串
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024
              }
            },
            // 这里的图片和下面的字体文件可以输出位置复用
            // generator: {
              // 输出位置
              // filename: 'static/media/[hash:6][ext][query]'
            // }
          },
          {
            test: /\.js$/,
            // exclude: /node_module/,       // 排除node_module中的js文件
            include: path.resolve(__dirname, "../src"),     // 只处理src下的文件
            use: {
              loader: "babel-loader",
              options: {
                // 也可以预设写在babel.config.js
                // presets: ["@babel/preset-env"]
                cacheDirectory: true,      // 开启babel缓存
                cacheCompression: false,    // 关闭缓存文件压缩
                plugins: ["@babel/plugin-transform-runtime"]         // 减少代码体积
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      // 对哪些内容需要做eslint检查
      context: path.resolve(__dirname, '../src'),
      exclude: "node_module",       // 排除node_module中的js文件
      cache: true,    // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      threads, // 开启多进程和设置进程数量
    }),
    // npm install -D html-webpack-plugin
    new HtmlWebpackPlugin({
      // 模版：以public/index.html文件创建新的html文件
      // 新的html文件特点：1、结构和原来一致；2、自动引入打包后输出的资源
      template: path.resolve(__dirname, "../public/index.html")
    })
  ],
  optimization: {
    // 开发模式下不需要压缩
    // 代码分割配置
    splitChunks: {
      chunks: "all",
      // 其他都用默认值
    },
  },
  // 用webpack serve启动，
  // 注意：它不会输出dist资源（删除dist也没事），它是在内存中打包的
  devServer: {
    host: "localhost",
    port: "3000",
    open: true,
    hot: true
  }
}