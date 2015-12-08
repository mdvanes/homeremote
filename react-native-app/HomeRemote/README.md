https://facebook.github.io/react-native/docs/getting-started.html

To run the Android app:

* $ cd AwesomeProject
* $ react-native run-android
* $ react-native start
* Use the "Reload JS" button in the app (Reload JS button is also under "menu" options)
* Open index.android.js in your text editor of choice and edit some lines.
* Press the menu button (F2 by default, or ?-M in Genymotion) and select Reload JS to see your change!
* Run adb logcat *:S ReactNative:V ReactNativeJS:V in a terminal to see your app's logs


Experimental Windows/Linux support.

After first build error:

Failed to notify ProjectEvaluationListener.afterEvaluate(), but primary configur
ation failure takes precedence.
java.lang.RuntimeException: SDK location not found. Define location with sdk.dir
 in the local.properties file or with an ANDROID_HOME environment variable.

tijdelijk gezet met:

set ANDROID_HOME=D:\Program Files\adt-bundle-windows-x86_64-20140702\sdk\

daarna blijkt versie 23 van de ADT niet geinstalleerd, dus die nog geinstalleerd

nu nog:

Could not find com.android.support:appcompat-v7:23.0.1.

dus ook installeren van "Android support repository" via Android SDK Manager

Nu nog: no connected devices. Hoewel telefoon aangesloten is. Alhoewel 'adb devices' geeft ook geen devices. Genymotion werkt niet meer...

Na reboot start Genymotion weer normaal.

