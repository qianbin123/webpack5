const path = require("path");

// 插件需要引入才能用
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 优化1：单独打包css文件，通过link标签引入，这样子就没有闪屏现象
// 默认会把所有css文件，放在同一个文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 压缩css（另外mode: "production"已经默认开启html和js压缩，不需要进行额外配置，其中js压缩是webpack内置的terser压缩的）
const cssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// webpack内置，不需要下载，用来压缩js
const TerserWebpackPlugin = require("terser-webpack-plugin");

// 有损压缩
// npm install image-minimizer-webpack-plugin imagemin -D
// npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
const ImageMinmizerPlugin = require("image-minimizer-webpack-plugin");

const os = require("os");
const threads = os.cpus().length;

// Preload：告诉浏览器立即下载资源
// Preffetch：有空时候加载
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin")


// 抽取重复代码
function getStyleLoader(pre){
  return [
    // "style-loader",      // 将js中的css通过创建style标签添加到html文件中生效       （会生成style标签）
    MiniCssExtractPlugin.loader,      // 提取css为单独文件   （会生成link标签）
    "css-loader",         // 将css编译成commonjs的模块资源
    // css样式兼容性处理 npm install postcss-loader postcss postcss-preset-env -D 其中 postcss-loader依赖 postcss，并且postcss-preset-env为预设
    // 写在css-loader后面，less-loader前面
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env"     // 能解决大多数样式兼容性问题，需要在browserslist配置兼容性做到什么程度
          ]
        }
      }
    },
    pre
  ].filter(Boolean)
}

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/main.js",
  // 所有文件的输出路径
  output: {
    path: path.resolve(__dirname, "../dist"),       // 返回绝对路径resolve
    // 入口文件打包输出名
    filename: "static/js/[name].[contenthash:5].main.js",
    // 给打包输出的其他文件命名
    chunkFilename: "static/js/[name].[contenthash:5].chunk.js",
    // 其他资源文件名（字体，图片）
    assetModuleFilename: "static/images/[hash:6][ext][query]",
    // webpack5 自动清空上次打包内容（不用像webpack4，需要额外配置）
    clean: true
  },
  module: {
    rules: [
      {
        //只要匹配到一个loader，剩下的就不匹配了
        oneOf: [
          {
            test: /\.css$/,
            use: getStyleLoader()          // loader从右往左执行
          },
          {
            test: /\.less$/,
            use: getStyleLoader('less-loader')
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",       // 相当于 结合了webpack4中的url-loader和file-loader
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024       // 小于 10M 转成base64字符串，来减少请求
              }
            },
            // 也可以在assetModuleFilename: "static/images/[hash:6][ext][query]",做统一管理
            // generator: {
            //   // hash:6 hash取前6位 ext 为文件名扩展符 query 指携带的其他参数
            //   filename: 'static/images/[hash:6][ext][query]'
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
            // 也可以在assetModuleFilename: "static/images/[hash:6][ext][query]",做统一管理
            // generator: {
            //   // 输出位置
            //   filename: 'static/media/[hash:6][ext][query]'
            // }
          },
          {
            test: /\.js$/,
            // exclude: /node_module/,       // 排除node_module中的js文件
            include: path.resolve(__dirname, "../src"),     // 只处理src下的文件
            // use: {
            //   loader: "babel-loader",
            //   options: {
            //     // 也可以预设写在babel.config.js
            //     // presets: ["@babel/preset-env"]
            //     cacheDirectory: true,      // 开启babel缓存
            //     cacheCompression: false    // 关闭缓存文件压缩
            //   }
            // }
            use: [
              // thread-loader 要放在目标loader前面
              {
                loader: "thread-loader",         // 开启多进程
                options: {
                  works: threads                 // 进程数量
                }
              },
              {
                loader: "babel-loader",
                options: {
                  // 也可以预设写在babel.config.js
                  // presets: ["@babel/preset-env"]
                  cacheDirectory: true,      // 开启babel缓存
                  cacheCompression: false,    // 关闭缓存文件压缩
                  plugins: ["@babel/plugin-transform-runtime"]         // 减少代码体积
                }
              }
            ]
          }
        ]
      }
    ]
  },
  optimization: {
    // 这里放压缩的
    // minimizer: [
    //   // 也可以在这里调用-----1
    //   new cssMinimizerPlugin(),
    //   // 也可以在这里调用-----1
    //   new TerserWebpackPlugin({
    //     parallel: threads                 // 开启多进程
    //   })
    // ],

    // 代码分割配置
    splitChunks: {
      chunks: "all",          // 其他用默认值（把node_modules打包成单独文件，把import也打包成一个单独的文件）
    },
    // 如何更好的做缓存，需要解决两个问题
    // 1、当缓存发生变化时候，希望能接受新的资源， 通过 contentHash，根据文件内容重新设置hash
    // 2、当有一个文件发生变化时候，就这个文件发生变化，通过 runtimeChunk，比如 A依赖B，一般情况B变化A会跟着变化，但是runtimeChunk会生成映射文件，帮忙管理B的映射，导致B变化A不会跟着变化
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}.js`
    }
  },
  plugins: [
    new ESLintPlugin({
      // 对哪些内容需要做eslint检查
      context: path.resolve(__dirname, '../src'),
      exclude: "node_module",
      cache: true,    // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      threads                 // 开启多进程
    }),
    // npm install -D html-webpack-plugin
    new HtmlWebpackPlugin({
      // 模版：以public/index.html文件创建新的html文件
      // 新的html文件特点：1、结构和原来一致；2、自动引入打包后输出的资源
      template: path.resolve(__dirname, "../public/index.html")
    }),
    new MiniCssExtractPlugin({
      // 指定输出路径
      filename: "static/css/[name].[contenthash:5].css",
      chunkFilename: "static/css/[name].chunk.[contenthash:5].css"
    }),
    // 也可以在这里调用-----2
    new cssMinimizerPlugin(),
     // 也可以在这里调用-----2
    new TerserWebpackPlugin({
      parallel: threads                 // 开启多进程
    }),
    new PreloadWebpackPlugin({
      // --- preload ---
      rel: "preload",       // 表示js采用preload形式加载
      as: "script"          //  指作为一个script标签形式去做

      // --- prefetch ---
      // rel: "prefetch"
    })
    // new ImageMinmizerPlugin({
    //   implementation: ImageMinmizerPlugin.imageminGenerate,
    //   options: {
    //     plugins: [
    //       ["gifsicle", {interlaced: true}],
    //       ["jpegtran", {progressive: true}],
    //       ["optipng", {optimizationLevel: 5}],
    //       [
    //         "svgo",
    //         {
    //           plugins: [
    //             "preset-default",
    //             "prefixIds",
    //             {
    //               name: "sortAttrs",
    //               params: {
    //                 xmlsOrder: "alphabetical"
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     ]
    //   }
    // })
  ],
}