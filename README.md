# ListingApp
React Native App

1. npm install -g react-native-cli
2. npm install
3. react-native link
4. react-native run-android
5. react-native run-ios
6. [Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android)  
```
   $ cd android  
   $ ./gradlew assembleRelease  
``` 
7. react-native link react-native-firebase
8. logging
```
   $ react-native log-android
   $ react-native log-ios
```
9. install Firebase in iOS
```
   pod init
   pod 'Firebase/Core'
      Podfile
      platform :ios, '9.0'
      pod 'Firebase/Core'
      pod 'Firebase/Auth'
      pod 'Firebase/Firestore'
   pod install
```