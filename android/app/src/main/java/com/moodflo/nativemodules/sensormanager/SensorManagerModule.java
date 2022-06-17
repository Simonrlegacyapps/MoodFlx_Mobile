package com.moodflo.nativemodules.sensormanager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.util.Log;

public class SensorManagerModule extends ReactContextBaseJavaModule {
  private static final String	REACT_CLASS = "SensorManager";
  private LightSensorRecord mLightSensorRecord = null;

	private ReactApplicationContext	mReactContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public SensorManagerModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mReactContext = reactContext;
    }

    @ReactMethod
    public int startLightSensor(int delay) {
      if(mLightSensorRecord == null)
        mLightSensorRecord = new LightSensorRecord(mReactContext);
      return (mLightSensorRecord.start(delay));
    }

    @ReactMethod
    public void stopLightSensor() {
      if(mLightSensorRecord != null)
        mLightSensorRecord.stop();
    }

	/*
    @Override
    public ReactBarcodeScannerView createViewInstance(ThemedReactContext context) {
    }

    @Override
    public void onDropViewInstance(ReactBarcodeScannerView view) {
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }
    */
}
