/** @type {Detox.DetoxConfig} */
module.exports = {
  logger: {
    level: process.env.CI ? "debug" : undefined,
  },
  testRunner: {
    $0: "jest",
    args: {
      config: "e2e/jest.config.js",
      _: ["e2e"],
    },
  },
  artifacts: {
    plugins: {
      log: process.env.CI ? "failing" : undefined,
      screenshot: "failing",
    },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      build:
        "xcodebuild -workspace ios/eastestsexample.xcworkspace -scheme eastestsexample -configuration Debug -sdk iphonesimulator -arch x86_64 -derivedDataPath ios/build",
      binaryPath:
        "ios/build/Build/Products/Debug-iphonesimulator/eastestsexample.app",
    },
    "ios.release": {
      type: "ios.app",
      build:
        "xcodebuild -workspace ios/eastestsexample.xcworkspace -scheme eastestsexample -configuration Release -sdk iphonesimulator -arch x86_64 -derivedDataPath ios/build",
      binaryPath:
        "ios/build/Build/Products/Release-iphonesimulator/eastestsexample.app",
    },
    "android.debug": {
      type: "android.apk",
      build:
        "cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug && cd ..",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
    },
    "android.release": {
      type: "android.apk",
      build:
        "cd android && ./gradlew :app:assembleRelease :app:assembleAndroidTest -DtestBuildType=release && cd ..",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 14",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_3a_API_34_extension_level_7_arm64-v8a",
      },
    },
  },
  configurations: {
    "ios.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "ios.release": {
      device: "simulator",
      app: "ios.release",
    },
    "android.debug": {
      device: "emulator",
      app: "android.debug",
    },
    "android.release": {
      device: "emulator",
      app: "android.release",
    },
  },
};
