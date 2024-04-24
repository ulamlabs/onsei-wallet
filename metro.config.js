const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const customConfig = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve("readable-stream"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
