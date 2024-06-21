const { mergeConfig } = require("@react-native/metro-config");
const { getDefaultConfig } = require("@expo/metro-config");
const cryptoModule = process.env.EXPO_PUBLIC_CRYPTO;

const defaultConfig = getDefaultConfig(__dirname);
const customConfig = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve(cryptoModule),
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
