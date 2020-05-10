# Instify
Instify is an android application designed to help students and faculty members stay in-touch with each other in an organized manner. Instify is a mini social networking android application, which acts as a companion for college and school students. This app allows the users to get instant notifications about the college/school news and announcements, keep track of what is trending in the campus, share academic notes, keep track of attendance and marks, get timetable related alerts on a daily basis and much more.

It's also on Google Play:
<a href="https://play.google.com/store/apps/details?id=com.instify.android" target="_blank" rel="noopener">
  <img alt="Get it on Google Play"
      src="https://play.google.com/intl/en_us/badges/images/generic/en-play-badge.png" height="60"/>
</a>

#### Manifest Settings

```xml
 <supports-screens
        android:anyDensity="true"
        android:largeScreens="true"
        android:normalScreens="true"
        android:smallScreens="true" />

    <!-- Normal permissions, access automatically granted to app -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Dangerous permissions, access must be requested at runtime -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!-- FCM (Firebase Cloud Messaging) for all build types configuration -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    
    <uses-feature
        android:name="android.hardware.camera"
        android:required="false" />
    <uses-feature
        android:name="android.hardware.camera.front"
        android:required="false" />
    <uses-feature
        android:name="android.hardware.camera.autofocus"
        android:required="false" />
