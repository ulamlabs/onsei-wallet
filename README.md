# Onsei Wallet

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ulamlabs/onsei-wallet/blob/master/assets/ulam_labs.png">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/ulamlabs/onsei-wallet/blob/bc7674dfd78d2d70af0fcd69d3f61843f2779682/assets/ulam_labs_black.png">
  <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="">
</picture>

Onsei Wallet is an open-source, non-custodial wallet built for the Sei Network. This repository serves as a minimal reference implementation that can be used as a starting point for developers building their own wallet solutions or integrating Sei-related functionality into other applications.

## Features

- Sending and receiving SEI tokens
- Viewing transaction history
- Managing address book entries
- Creating new wallets using mnemonic phrases
- Importing existing wallets
- Setting custom network fee parameters
- Enabling biometric and PIN-based security
- Configuring in-app notifications

This project is intended as an open-source example that can be adapted and extended to meet different needs across the Sei ecosystem.

## Disclaimer

This software is provided by ULAM LABS as a public, open-source reference implementation for educational and development purposes only. It is not a commercial product, and no fees are charged for its use.

The codebase has not undergone any formal security audit and may contain bugs, security issues, or other vulnerabilities. By using this software, you acknowledge that you do so at your own risk.

ULAM LABS does not make any warranties, express or implied, and shall not be held liable for any damages, losses, or issues resulting from the use, misuse, or inability to use this software.

Developers are encouraged to review, test, and audit the code before deploying or integrating it into their own applications.

For licensing terms, see the LICENSE file included in this repository.

## The Onsei Wallet (testnet version) is available on the App Store and Google Play. It can be downloaded for testing and exploration purposes.

- [Download on the App Store](https://apps.apple.com/pl/app/onsei-wallet/id6498712168?l=pl)
- [Download on Google Play](https://play.google.com/store/apps/details?id=com.ulamlabs.seiwallet)

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Start your Application" step, before proceeding.

## Start your Application

There are two ways to run your project:

### Running expo client on your device

Install Expo Go application on your phone.

```
npm start
```

Scan the QR code generated in the terminal with Expo Go.

### Running on simulator

Make sure to have any simulator installed on your device.

```
npm run android
```

OR

```
npm run ios
```

## Test application

Make sure to have the newest android build:

```
npx expo run:android
```

Add a detox (e2e testing library) configuration to it

```
npm run e2e-configure
```

Now the tests are ready to go. Open two terminals. In one of them run:

```
npm start
```

And in the second:

```
npm run e2e-test
```

#### Troubleshooting

If you're encountering any errors while running tests, make sure that your Java version is set to 17.0.11.
If your version doesn't match, the easiest way to change it is to install -> https://sdkman.io/install
and then run

```
sdk install java 17.0.11-zulu
```

If you're getting `$ANDROID_SDK_ROOT is not defined` error, run

```
export ANDROID_SDK_ROOT=/Users/${USER}/Library/Android/sdk
```

## Build application

Before proceeding, make sure to have eas installed and logged in

```
npm install -g eas-cli
eas login
```

### iOS

Run those commands:

```
eas build --platform ios
eas submit
```

In the menu that appears choose the latest build and confirm. This process takes a few minutes.

### Android

For Android, you'll need to get the upload key. Ask someone from your team for a `my-upload-key.keystore` file and the password. Save those in a safe place.

Then run

```
eas credentials
```

In the menu pick "Android", then "production" and "Keystore".
From this menu, select "Set up a new keystore", and when asked to "Generate a new Android Keystore?", answer "No". You will then be asked for the path to the Keystore file. Provide the path to `my-upload-key.keystore`.
When asked for an alias, type "my-key-alias", and when asked for a password, enter the one provided by your team.

You can now run

```
eas build --platform android
```

The newly generated build can be downloaded from `expo.dev` panel. It can be uploaded into the Google Play Store.
