require("es6-promise").polyfill();

const path = require("path");
const context = path.join(__dirname, "scripts");
const tsForkCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const {
  externalizeDidgahPackagesClientApp,
} = require("didgah-external-helper");

const getPlugins = () => [];

const output = {
  path: path.join(__dirname, "../build"),
  filename: "[name].js",
  libraryTarget: "var",
  library: ["DDMPlugins", 'AllPluginsInfo'],
  publicPath: "/Applications/Zagros/extramodel/",
  chunkFilename: "[name].js",
  chunkLoadingGlobal: 'DDMPlugin_AllPluginsInfo_Jsonp',
};

const devtool = "source-map";
const moduleConfig = {
  rules: [
    {
      test: /\.tsx?$/,
      exclude: "/node_modules/",
      use: [{ loader: "cache-loader" }, { loader: "swc-loader" }],
    },
  ],
};

const resolve = {
  alias: {
    react: path.join(__dirname, "node_modules", "react"),
  },
  extensions: [".json", ".tsx", ".ts", ".js"],
};

const externals = {
  "didgah/ant-core-component/providers": "didgah.components.ant.antcorecomponent.default.providers",
	"didgah/ant-core-component": "didgah.components.ant.antcorecomponent.default",
  "didgah/common": "didgah.common",
  "@didgah/common": "didgah.common",
  "didgah/global": "window",
  "didgah/global/userTempStorage": "Chargoon.Didgah.UI5",
  react: "React",
  "react-dom": "ReactDOM",
  "react-dnd": "ReactDnD",
  "react-dnd-html5-backend": "ReactDnDHTML5Backend",
  "prop-types": "PropTypes",
};

const formsConfig = {
  entry: {
    'AllPluginsInfo': ['./index.tsx']
  },
  output,
  devtool,
  module: moduleConfig,
  plugins: getPlugins(),
  resolve,
  externals: [
    ({ context, request }, callback) =>
      externalizeDidgahPackagesClientApp(context, request, callback, externals),
  ],
  context,
};


module.exports = [formsConfig];
