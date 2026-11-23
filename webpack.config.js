/**
 * Configuration to build the launcher (launch page, file manager, netgame handling etc.)
 *   for the Web port.
 */

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const LAUNCHER_SRC = "./src/web-src/";
const STATIC_PATH = "./src/web-static/";
const BUILD_PATH = "./web-build/";
const GAME_ASSETS = "./web-assets/";
const EMSCRIPTEN_BUILD_PATH = "./web-emscripten-wasm/bin/";
const EMSCRIPTEN_BUILD_NODE_PATH = "./web-emscripten-wasm-node/bin/";

const OUTPUT_EMSCRIPTEN_PATH = "emscripten-web/"; //Don't add ./ to these, as its already added to copy, make sure these are URL friendly.
const OUTPUT_EMSCRIPTEN_NODE_PATH = "emscripten-node/";
const OUTPUT_EMSCRIPTEN_JS_NAME = "srb2.js";

const WEB_CONSTANTS = {
  PATH: OUTPUT_EMSCRIPTEN_PATH,
  JS_PATH: OUTPUT_EMSCRIPTEN_JS_NAME,
};

const HTML_TEMPLATE_PATH = "./html-template/template.html"; //Relative to LAUNCHER_SRC

try {
  require("fs").rmSync(BUILD_PATH, { recursive: true });
} catch (e) {}

module.exports = {
  mode: "production",
  devServer: {
    allowedHosts: "all",
    port: (+require("process").env.PORT) || 3000,
    client: false,
  },
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
  },
  devtool: false,
  entry: {
    launcher: path.resolve(path.join(LAUNCHER_SRC, "index/index.js")),
    filemanager: path.resolve(path.join(LAUNCHER_SRC, "filemanager/index.js"))
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "shared",
    },
    minimize: true
  },
  output: {
    path: path.resolve(__dirname, BUILD_PATH),
    filename: "js/[contenthash]-[fullhash].js",
  },
  performance: {
    /*hints: "warning",*/
  },
  experiments: {
    css: false
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: "raw-loader",
            options: {
              esModule: false,
            },
          },
        ],
        type: "javascript/auto", // Fix for raw-loader
      },
      {
        test: /\.ttf$/i,
        type: "asset",
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'WEB_CONSTANTS': JSON.stringify(WEB_CONSTANTS),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      title: `SRB2 web`,
      template: path.join(LAUNCHER_SRC, HTML_TEMPLATE_PATH),
      chunks: ["launcher"],
    }),
    new HtmlWebpackPlugin({
      filename: `file.html`,
      title: `SRB2 web | File Manager`,
      template: path.join(LAUNCHER_SRC, HTML_TEMPLATE_PATH),
      chunks: ["filemanager"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        //Images and anything displayed on the site.
        {
          from: STATIC_PATH,
          to: "./",
          noErrorOnMissing: false,
        },

        //The game without assets.
        {
          from: EMSCRIPTEN_BUILD_PATH,
          to: "./"+OUTPUT_EMSCRIPTEN_PATH,
          noErrorOnMissing: true,
        },

        //The game without assets.
        {
          from: EMSCRIPTEN_BUILD_PATH,
          to: "./"+OUTPUT_EMSCRIPTEN_NODE_PATH,
          noErrorOnMissing: true,
        },

        //Assets 
        {
          from: GAME_ASSETS,
          to: "./assets/",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
