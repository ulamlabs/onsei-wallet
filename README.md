# sei-wallet

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
