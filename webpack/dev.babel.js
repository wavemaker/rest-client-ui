/**
 * @prettier
 */

import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin"

import configBuilder from "./_config-builder"
import styleConfig from "./stylesheets.babel"

const projectBasePath = path.join(__dirname, "../")
const isDevelopment = process.env.NODE_ENV !== "production"

const devConfig = configBuilder(
  {
    minimize: false,
    mangle: false,
    sourcemaps: true,
    includeDependencies: true,
  },
  {
    mode: "development",
    entry: {
      "rest-import-ui-bundle": [
        "./src/core/index.js",
      ],
      "rest-import-ui-standalone-preset": [
        "./src/standalone/index.js",
      ],
      "rest-import-ui": "./src/style/main.scss",
    },

    performance: {
      hints: false
    },

    output: {
      filename: "[name].js",
      chunkFilename: "[id].js",
      library: {
        name: "[name]",
        export: "default",
      },
      publicPath: "/",
    },

    devServer: {
      allowedHosts: "all", // for development within VMs
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      port: 3800,
      host: "0.0.0.0",
      hot: true,
      static: {
        directory: path.resolve(projectBasePath, "dev-helpers"),
        publicPath: "/",
      },
      client: {
        logging: "info",
        progress: true,
      },
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.join(projectBasePath, "src"),
            path.join(projectBasePath, "node_modules", "object-assign-deep"),
          ],
          loader: "babel-loader",
          options: {
            retainLines: true,
            cacheDirectory: true,
          },
        },
        {
          test: /\.(txt|yaml)$/,
          type: "asset/source",
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/inline",
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(projectBasePath, "dev-helpers", "index.html"),
      }),
      new HtmlWebpackSkipAssetsPlugin({
        skipAssets: [/rest-import-ui\.js/],
      }),
    ].filter(Boolean),

    optimization: {
      runtimeChunk: "single", // for multiple entry points using ReactRefreshWebpackPlugin
    },
  },
)

// mix in the style config's plugins and loader rules

devConfig.plugins = [...devConfig.plugins, ...styleConfig.plugins]

devConfig.module.rules = [
  ...devConfig.module.rules,
  ...styleConfig.module.rules,
]

export default devConfig
