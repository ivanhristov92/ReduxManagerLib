const path = require("path");
const commonPaths = {
  root: path.resolve(__dirname),
  outputPath: path.resolve(__dirname, "build"),
  entryPath: path.resolve(__dirname, "index.js"),
  jsFolder: "js"
};

module.exports = {
  mode: "production",
  entry: commonPaths.entryPath,
  output: {
    // filename: `${commonPaths.jsFolder}/[name].[hash].js`,
    path: commonPaths.outputPath,
    chunkFilename: "[name].[chunkhash].js",
    library: "ReduxManagerLib",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /(node_modules)/
      }
    ]
  },

  resolve: {
    modules: ["src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".css", ".scss"]
  },
  plugins: []
};
