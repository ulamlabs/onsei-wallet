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

Due to some issues with `react-native-quick-crypto` library, the build for Android needs to be created manually.
First, you need to head over to `node_modules/react-native-quick-crypto/android/build.gradle` and change `minSdkVersion` to `23`.

Then, make sure that you have the newest version of the app in `/android` folder

```
npx expo run:android
```

Now, place the `my-upload-key.keystore` file under the `android/app` directory.
Then, edit the file `android/gradle.properties`, and add the following (replace \*\*\* with the correct keystore password).

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=***
MYAPP_UPLOAD_KEY_PASSWORD=***
```

The last configuration step that needs to be done is to setup release builds to be signed using upload key. Edit the file `android/app/build.gradle`. Make sure that `versionName` and `versionCode` match those in `app.json`. Then make the following changes:

```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

Finally, run the following command in the android directory:

```
./gradlew bundleRelease
```

The newly generated `.aab` file will be located in `/android/app/build/outputs/bundle/release/app-release.aab`. It can be uploaded into the Google Play Store.
