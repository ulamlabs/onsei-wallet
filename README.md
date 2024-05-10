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

### iOS

Make sure to have eas installed and logged in

```
npm install -g eas-cli
eas login
```

Then run those commands

```
eas build --platform ios
eas submit
```

In the menu that appears choose the latest build and confirm. This process takes a few minutes.

### Android

Due to some issues with certain expo modules and 8th version of Gradle, the path for building Android is more complicated.

First, you need to head over to `node_modules/expo-application/android/build.gradle` and apply this diff:

```diff
--- a/node_modules/expo-application/android/build.gradle
+++ b/node_modules/expo-application/android/build.gradle
@@ -35,19 +35,11 @@ buildscript {
   }
 }

-// Creating sources with comments
-task androidSourcesJar(type: Jar) {
-  classifier = 'sources'
-  from android.sourceSets.main.java.srcDirs
-}
-
 afterEvaluate {
   publishing {
     publications {
       release(MavenPublication) {
         from components.release
-        // Add additional sourcesJar to artifacts
-        artifact(androidSourcesJar)
       }
     }
   }
 }

 android {
   compileSdkVersion safeExtGet("compileSdkVersion", 33)

   compileOptions {
-    sourceCompatibility JavaVersion.VERSION_11
-    targetCompatibility JavaVersion.VERSION_11
+    sourceCompatibility JavaVersion.VERSION_17
+    targetCompatibility JavaVersion.VERSION_17
   }

   kotlinOptions {
-    jvmTarget = JavaVersion.VERSION_11.majorVersion
+    jvmTarget = JavaVersion.VERSION_17.majorVersion
   }

   defaultConfig {
     minSdkVersion safeExtGet("minSdkVersion", 21)
     targetSdkVersion safeExtGet("targetSdkVersion", 33)
     versionCode 12
     versionName '5.1.1'
   }
   lintOptions {
     abortOnError false
   }
+  publishing {
+    singleVariant("release") {
+      withSourcesJar()
+    }
+  }
 }

```

Then, make sure that you have the newest version of the app in `/android` folder

```
npx expo run:android
```

Then, there are two paths:

If you want to create an `.apk` version that can be manually installed on your device, simply run:

```
cd android
./gradlew assembleRelease
```

The newly generated `.apk` file will be located in `/android/app/build/outputs/apk/release/app-release.apk`. It can be directly copied and installed on an Android device.

However, if you want to upload the app in Google Store, the `.apk` file is not accepted and it needs to be signed, so the process is more complicated.
Firstly, you need to get the upload key. Ask someone from your team for a `my-upload-key.keystore` file and the password. Place the mentioned file under the `android/app` directory.
Secondly, edit the file `android/gradle.properties`, and add the following (replace \*\*\* with the correct keystore password).

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=***
MYAPP_UPLOAD_KEY_PASSWORD=***
```

The last configuration step that needs to be done is to setup release builds to be signed using upload key. Edit the file `android/app/build.gradle`. Make sure the `versionName` matches version in `app.json`. Then make the following changes:

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

#### Troubleshooting

If you're still getting errors while building android `.apk`, check

```
cd android
./gradlew --version
```

And make sure that Java version is set to 17.0.11. It should appear like this

```
JVM:          17.0.11 (Azul Systems, Inc. 17.0.11+9-LTS)
```

If your version doesn't match, the easiest way to change it is to install -> https://sdkman.io/install
and then run

```
sdk install java 17.0.11-zulu
```
