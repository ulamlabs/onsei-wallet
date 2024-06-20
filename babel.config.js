module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      development: {
        plugins: [
          [
            "module-resolver",
            {
              alias: {
                crypto: "react-native-crypto",
                stream: "readable-stream",
                "react-native-randombytes": "react-native-get-random-values",
              },
            },
          ],
        ],
      },
      production: {
        plugins: [
          [
            "module-resolver",
            {
              alias: {
                crypto: "react-native-quick-crypto",
                stream: "readable-stream",
                "react-native-randombytes": "react-native-get-random-values",
              },
            },
          ],
        ],
      },
    },
  };
};
