const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// minify our CSS and extract it to a separate file
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//create a handy report of what's in our bundle when build is completed.
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");

process.env.NODE_ENV = "production";

module.exports = {
  mode: "production",
  target: "web",
  //This is a little slower to create than the source map setting that we were using for development, but it's higher quality,
  devtool: "source-map",
  entry: "./src/index",
  //unlike the dev config, webpack will actually write physical files to the build directory 
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  //plugins enhance webpack's power.
  plugins: [
    new webpackBundleAnalyzer.BundleAnalyzerPlugin({ analyzerMode: "static" }),
    new MiniCssExtractPlugin({
      //Webpack will pick the name for us and add a hash to it.
      //the file name will only change when our CSS changes.
      filename: "[name].[contenthash].css"
    }),
    //The DefinePlugin lets us define variables that are then made available to the libraries that webpack is building.
    new webpack.DefinePlugin({
      //This global makes sure React is built in prod mode
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify("http://localhost:3001")
    }),
    //this plugin generates our index.html and it adds a reference 
    //to our JavaScript bundle and CSS bundle into the HTML for us
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "src/favicon.ico",
      // see https://github.com/kangax/html-minifier#options-quick-reference
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /(\.css)$/,
        use: [
          //loaders run from the bottom up,
          // so the PostCSS loader will run and then the CSS loader will take over, 
          //generate our source map, and extract to a separate file
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              //We're using the cssnano PostCSS plugin to minify our CSS.
              plugins: () => [require("cssnano")],
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
