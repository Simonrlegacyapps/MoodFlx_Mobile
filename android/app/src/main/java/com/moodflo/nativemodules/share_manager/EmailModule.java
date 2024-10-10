package com.moodflo.nativemodules.share_manager;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;



public class EmailModule extends ReactContextBaseJavaModule {

    public EmailModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "Email";
    }


    @ReactMethod
    public void compose(final String title, final String to, final String subject, final String body, final String cc, final String bcc) {
        Intent send = new Intent(Intent.ACTION_SENDTO);
        String uriText = "mailto:" + Uri.encode(to) +
                "?subject=" + Uri.encode(subject) +
                "&body=" + Uri.encode(body);
        if(cc != null) {
            uriText += "&cc=" + Uri.encode(cc);
        }
        if(bcc != null) {
            uriText += "&bcc=" + Uri.encode(bcc);
        }
        Uri uri = Uri.parse(uriText);

        send.setData(uri);
        Intent chooserIntent = Intent.createChooser(send, title);
        chooserIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(chooserIntent);
    }

}
