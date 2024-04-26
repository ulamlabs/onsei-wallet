const { mergeConfig } = require("@react-native/metro-config");
const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const customConfig = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve("readable-stream"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
  transformer: {
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
