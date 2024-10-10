package com.moodflo;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RemoteViews;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

class Mood {
    String moodName;
    String moodId;
    int idx;
    int color;

    public Mood(String name, String id, int idx, int color) {
        this.moodName = name;
        this.moodId = id;
        this.idx = idx;
        this.color = color;
    }

    @Override
    public String toString() {
        return "Mood{" +
                "moodName='" + moodName + '\'' +
                ", moodId='" + moodId + '\'' +
                ", idx=" + idx + '\'' +
                ", color=" + color +
                '}';
    }
}

class MoodUpdateResponse {
    int status_code = -1;
    int reward_point = -1;
    String mood_id = "";
    boolean success = false;

    public MoodUpdateResponse(int status_code, int reward_point, String mood_id, boolean success) {
        this.status_code = status_code;
        this.reward_point = reward_point;
        this.mood_id = mood_id;
        this.success = success;
    }

    @Override
    public String toString() {
        return "MoodUpdateResponse{" +
                "status_code=" + status_code +
                ", reward_point=" + reward_point +
                ", mood_id='" + mood_id + '\'' +
                ", success=" + success +
                '}';
    }
}

class MoodUpdateBody {
    int anonymous = 1;
    String city = "";
    String description = "mood input";
    String device_id = "";
    String device_token = "";
    String device_type = "android";
    String email = "";
    String lat = "";
    String lon = "";
    String mood_id = "";
    String mood_type = "regular";
    int reward_point = 0;
    int section_index = 4;
    String state = "";
    String country = "";
    String user_id = "";
//    {
//        "anonymous": 1,
//            "city": "Melbourne",
//            "country": "Australia",
//            "description": "mood input",
//            "device_id": "F8EA5DB9-75E0-45FB-9E26-A243876ADAE8",
//            "device_token": "dupgKHolukmHpamOWbyNeS:APA91bEsSJL9TpF0SaHhsuQakVhB3Tm58NMOKEbXpjKojBk7x8fjaCwuLclgp4gavPGmd67LAA5064P5o9sDTjVFn4oA80k2iwrmfRnEkdgLj10TcXJoEiUo2s3bLsQeNjK9v34oY2EQ",
//            "device_type": "ios",
//            "email": null,
//            "lat": "-37.8112451",
//            "long": "144.9543962",
//            "mood_id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
//            "mood_type": "regular",
//            "reward_point": 0,
//            "section_index": 4,
//            "state": "Victoria",
//            "user_id": null
//    }
    public MoodUpdateBody(
            int anonymous,
            String city,
            String description,
            String device_id,
            String device_token,
            String device_type,
            String email,
            String lat,
            String lon,
            String mood_id,
            String mood_type,
            int reward_point,
            int section_index,
            String state,
            String country,
            String user_id
            ) {
        this.anonymous = anonymous;
        this.city = city;
        this.description = description;
        this.device_id = device_id;
        this.device_token = device_token;
        this.device_type = device_type;
        this.email = email;
        this.lat = lat;
        this.lon = lon;
        this.mood_id = mood_id;
        this.mood_type = mood_type;
        this.reward_point = reward_point;
        this.section_index = 4;
        this.state = state;
        this.country = country;
        this.user_id = user_id;
    }

    @Override
    public String toString() {
        return "MoodUpdateBody{" +
                "anonymous=" + anonymous +
                ", city='" + city + '\'' +
                ", description='" + description + '\'' +
                ", device_id='" + device_id + '\'' +
                ", device_token='" + device_token + '\'' +
                ", device_type='" + device_type + '\'' +
                ", email='" + email + '\'' +
                ", lat='" + lat + '\'' +
                ", lon='" + lon + '\'' +
                ", mood_id='" + mood_id + '\'' +
                ", mood_type='" + mood_type + '\'' +
                ", reward_point=" + reward_point +
                ", section_index=" + section_index +
                ", state='" + state + '\'' +
                ", country='" + country + '\'' +
                ", user_id='" + user_id + '\'' +
                '}';
    }
}

interface GitHubService {
    @POST("moodUpdate")
    Call<MoodUpdateResponse> updateMood(@Body MoodUpdateBody moodUpdateBody);
}

/**
 * Implementation of App Widget functionality.
 */
public class MoodInputWidget extends AppWidgetProvider {
    public final static String BASE_URL = BuildConfig.BASE_URL;
    public final static String MOOD_TYPE_REGULAR = "regular";
    public final static String MOOD_TYPE_PRETTY = "pretty";
    public final static String MOOD_TYPE_VERY = "very";
    private static final String OnSaveClick = "onSaveClick";
    private static final String OnPrettyClick = "onPrettyClick";
    private static final String OnVeryClick = "onVeryClick";
    private static List<Mood> moods = new ArrayList<>();
    private static final String intentExtraWidgetIdKey = "widgetId";
    private static Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build();
    private static String moodType = MOOD_TYPE_REGULAR;

    private static GitHubService service = retrofit.create(GitHubService.class);
    private List<String> onClickIntents = new ArrayList(
            List.of("0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"));
    private static List<Integer> buttonIds = null;
    private static Mood selectedMood = null;


//    public void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
//                                int appWidgetId) {
//
//        try {
//            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
//            String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
//            JSONObject appData = new JSONObject(appString);
//            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.mood_input_widget);
////            views.setTextViewText(R.id.appwidget_text, appData.getString("text"));
////            appWidgetManager.updateAppWidget(appWidgetId, views);
//            views.setOnClickPendingIntent(R.id.button_id, getPendingSelfIntent(context, MyOnClick));
//            appWidgetManager.updateAppWidget(appWidgetId, views);
//        }catch (JSONException e) {
//            e.printStackTrace();
//        }
//
////        CharSequence widgetText = context.getString(R.string.appwidget_text);
////        // Construct the RemoteViews object
////        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.mood_input_widget);
////        views.setTextViewText(R.id.appwidget_text, widgetText);
////
////        // Instruct the widget manager to update the widget
////        appWidgetManager.updateAppWidget(appWidgetId, views);
//    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        super.onUpdate(context, appWidgetManager, appWidgetIds);
        setMoods();
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

        }
        if (service == null) {
            service = retrofit.create(GitHubService.class);
        }

        if (buttonIds == null) {
            buttonIds = new ArrayList(
                    List.of(
                            R.id.button_1_id,
                            R.id.button_2_id,
                            R.id.button_3_id,
                            R.id.button_4_id,
                            R.id.button_5_id,
                            R.id.button_6_id,
                            R.id.button_7_id,
                            R.id.button_8_id,
                            R.id.button_9_id,
                            R.id.button_10_id,
                            R.id.button_11_id,
                            R.id.button_12_id,
                            R.id.button_13_id,
                            R.id.button_14_id,
                            R.id.button_15_id,
                            R.id.button_16_id,
                            R.id.button_17_id,
                            R.id.button_18_id,
                            R.id.button_19_id,
                            R.id.button_20_id,
                            R.id.button_21_id,
                            R.id.button_22_id,
                            R.id.button_23_id,
                            R.id.button_24_id
                    ));
        }

        for (int appWidgetId : appWidgetIds) {
//            updateAppWidget(context, appWidgetManager, appWidgetId);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.mood_input_widget);
//            views.setTextViewText(R.id.appwidget_text, appData.getString("text"));
//            appWidgetManager.updateAppWidget(appWidgetId, views);

//            views.setOnClickPendingIntent(R.id.button_1_id, getPendingSelfIntent(context, MyOnClick));
            views.setOnClickPendingIntent(R.id.save_button_id, getPendingSelfIntent(context, OnSaveClick, appWidgetId));
            views.setOnClickPendingIntent(R.id.pretty_button_id, getPendingSelfIntent(context, OnPrettyClick, appWidgetId));
            views.setOnClickPendingIntent(R.id.very_button_id, getPendingSelfIntent(context, OnVeryClick, appWidgetId));
            for (int i = 0; i < buttonIds.size(); i++) {
                views.setOnClickPendingIntent(buttonIds.get(i), getPendingSelfIntent(context, onClickIntents.get(i), appWidgetId));
            }
            Log.d("buttonId ", buttonIds.toString());
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        super.onDeleted(context, appWidgetIds);
    }

    public void setMoods() {
        if (moods.isEmpty()) {
            //1
            moods.add(new Mood("Stressed", "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c", 1, Color.rgb(255, 68, 108)));
            //2
            moods.add(new Mood("Tense", "71c07325-3311-483f-b048-605d834d0661", 2, Color.rgb(255, 161, 146)));
            //3
            moods.add(new Mood("Alert", "c3d99c75-dd32-437b-a417-5e1654328cb1", 3, Color.rgb(251, 255, 122)));
            //4
            moods.add(new Mood("Pumped", "a6b543a4-07d3-4781-8f1a-80ddf7f22808", 4, Color.rgb(225, 255, 157)));
            //5
            moods.add(new Mood("Upset", "a2fb79e8-e203-46a5-8d76-a6efcefe26f2", 5, Color.rgb(255, 109, 254)));
            //6
            moods.add(new Mood("Cranky", "594e5408-8e0f-4613-b843-fb81d2322eb8", 6, Color.rgb(245, 172, 255)));
            //7
            moods.add(new Mood("Awesome", "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09", 7, Color.rgb(210, 255, 217)));
            //8
            moods.add(new Mood("Chuffed", "c52921a3-fc8f-4e8c-9a77-d9ba17a773dd", 8, Color.rgb(134, 255, 174)));
            //9
            moods.add(new Mood("Upset", "a2fb79e8-e203-46a5-8d76-a6efcefe26f2", 9, Color.rgb(225, 91, 255)));
            //10
            moods.add(new Mood("Impatient", "b4bd1683-8581-4156-844b-bc88c1f439f0", 10, Color.rgb(212, 194, 255)));
            //11
            moods.add(new Mood("Awesome", "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09", 11, Color.rgb(178, 240, 255)));
            //12
            moods.add(new Mood("Happy", "13b3c477-9e5f-4bd3-b312-0abbb32e48bb", 12, Color.rgb(98, 255, 199)));
            //13
            moods.add(new Mood("Sad", "e08c39dc-579a-4e8e-a342-967931151ca9", 13, Color.rgb(172, 56, 255)));
            //14
            moods.add(new Mood("Flat", "abad9076-b41c-45fe-a3e5-960b1afe5f9f", 14, Color.rgb(129, 79, 255)));
            //15
            moods.add(new Mood("Grateful", "23bd0192-8d1a-435f-a6b7-8c5fa97c5487", 15, Color.rgb(108, 198, 255)));
            //16
            moods.add(new Mood("Content", "43bd3752-d44b-4309-90f8-b081172461f2", 16, Color.rgb(22, 255, 243)));
            //17
            moods.add(new Mood("Bored", "da6e32d2-f8f0-439d-8540-ed85d543c2aa", 17, Color.rgb(64, 0, 255)));
            //18
            moods.add(new Mood("Anxious", "2c764148-a046-409f-97c8-85220c2162de", 18, Color.rgb(31, 48, 255)));
            //19
            moods.add(new Mood("Chilled", "56b4197c-8f6a-48bc-8751-33b16a572da7", 19, Color.rgb(0, 106, 255)));
            //20
            moods.add(new Mood("Relaxed", "88028988-a2d5-4ee3-8912-a4ffac7e9c43", 20, Color.rgb(0, 160, 255)));
            //21
            moods.add(new Mood("Bored", "da6e32d2-f8f0-439d-8540-ed85d543c2aa", 21, Color.rgb(44, 0, 255)));
            //22
            moods.add(new Mood("Tired", "32043734-1bac-4b59-8e15-b6791011f52f", 22, Color.rgb(0, 2, 255)));
            //23
            moods.add(new Mood("Chilled", "56b4197c-8f6a-48bc-8751-33b16a572da7", 23, Color.rgb(0, 97, 255)));
            //24
            moods.add(new Mood("Relaxed", "88028988-a2d5-4ee3-8912-a4ffac7e9c43", 24, Color.rgb(0, 145, 255)));
        }
    }


    protected PendingIntent getPendingSelfIntent(Context context, String action, int widgetId) {
        Intent intent = new Intent(context, getClass());
        intent.putExtra(intentExtraWidgetIdKey, widgetId);
        intent.setAction(action);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    protected void resetMoodData(Context context, RemoteViews views, int widgetId) {
        moodType = MOOD_TYPE_REGULAR;
        views.setInt(R.id.pretty_button_id, "setTextColor", context.getColor(R.color.black));
        views.setInt(R.id.pretty_button_id, "setBackgroundColor", context.getColor(R.color.white));
        views.setInt(R.id.very_button_id, "setTextColor", context.getColor(R.color.black));
        views.setInt(R.id.very_button_id, "setBackgroundColor", context.getColor(R.color.white));
//        views.setInt(R.id.save_button_id, "setBackgroundColor", Color.parseColor("#B8B2F1"));
        views.setInt(R.id.save_button_id, "setBackgroundResource", R.drawable.round_corner_button);
        views.setTextViewText(R.id.mood_name_text_view_id, "Select Mood");
        for (int x = 0; x < buttonIds.size(); x++) {
            views.setInt(buttonIds.get(x), "setBackgroundColor", Color.parseColor("#A3BBCE"));
        }
        AppWidgetManager.getInstance(context).updateAppWidget(new ComponentName(context.getPackageName(), MoodInputWidget.class.getName()), views);
    }

    protected void onMoodUpdate(Mood _selectedMood, String _moodType, Context context, RemoteViews _views, int _widgetId) {
        MoodUpdateBody body = null;
        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
            JSONObject appData = new JSONObject(appString);
            JSONObject moodUpdateBody = appData.getJSONObject("moodUpdateBody");
            body = new MoodUpdateBody(
                    moodUpdateBody.getInt("anonymous"),
                    moodUpdateBody.getString("city"),
                    "mood input",
                    moodUpdateBody.getString("device_id"),
                    moodUpdateBody.getString("device_token"),
                    "android",
                    moodUpdateBody.getString("email"),
                    moodUpdateBody.getString("lat"),
                    moodUpdateBody.getString("lon"),
                    _selectedMood.moodId,
                    _moodType,
                    moodUpdateBody.getInt("reward_point"),
                    moodUpdateBody.getInt("section_index"),
                    moodUpdateBody.getString("state"),
                    moodUpdateBody.getString("country"),
                    moodUpdateBody.getString("user_id")
            );
            Log.d("onMoodUpdate ", body.toString());
//            views.setTextViewText(R.id.appwidget_text, appData.getString("text"));
//            appWidgetManager.updateAppWidget(appWidgetId, views);

        }catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d("MoodUpdateBody ", body.toString());
        if (body != null && body instanceof MoodUpdateBody) {
            Call<MoodUpdateResponse> call = service.updateMood(body);
            call.enqueue(new Callback<MoodUpdateResponse>() {

                @Override
                public void onResponse(Call<MoodUpdateResponse> call, Response<MoodUpdateResponse> response) {
                    Log.d("Api call success ", response.toString());
                    resetMoodData(context, _views, _widgetId);
                }

                @Override
                public void onFailure(Call<MoodUpdateResponse> call, Throwable t) {
                    Log.d("Api call fail", t.toString());
                }
            });
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
//        Log.d("Base Url ", BASE_URL);
//        Log.d("onClickIntents", onClickIntents.toString());
        setMoods();
//        Log.d("moods ", moods.toString());
        if (selectedMood != null && selectedMood instanceof Mood) {
            Log.d("selectedMood ", selectedMood.toString());
        }
        RemoteViews views = new RemoteViews(context.getPackageName(),
                R.layout.mood_input_widget);
        int widgetId = -1;
        if (OnSaveClick.equals(intent.getAction())) {
            widgetId = intent.getIntExtra(intentExtraWidgetIdKey, -1);
            String saveMoodName = "No mood selected";
            if (selectedMood != null && selectedMood instanceof Mood) {
                saveMoodName = selectedMood.moodName;
                Log.d("moodType ", moodType);
                onMoodUpdate(selectedMood, moodType, context, views, widgetId);
            }
            Log.d("Save Button Click", "Save mood" + "---" + saveMoodName);
        } else if (OnPrettyClick.equals(intent.getAction())) {
            widgetId = intent.getIntExtra(intentExtraWidgetIdKey, -1);
            Log.d("moodType ", moodType);
            if (moodType == MOOD_TYPE_VERY || moodType == MOOD_TYPE_REGULAR) {
                moodType = MOOD_TYPE_PRETTY;
                views.setInt(R.id.pretty_button_id, "setTextColor", context.getColor(R.color.white));
                views.setInt(R.id.pretty_button_id, "setBackgroundColor", Color.parseColor("#7265E3"));
                views.setInt(R.id.very_button_id, "setTextColor", context.getColor(R.color.black));
                views.setInt(R.id.very_button_id, "setBackgroundColor", context.getColor(R.color.white));
            } else {
                moodType = MOOD_TYPE_REGULAR;
                views.setInt(R.id.pretty_button_id, "setTextColor", context.getColor(R.color.black));
                views.setInt(R.id.pretty_button_id, "setBackgroundColor", context.getColor(R.color.white));
            }
            if (widgetId != -1) {
                AppWidgetManager.getInstance(context).updateAppWidget(new ComponentName(context.getPackageName(), MoodInputWidget.class.getName()), views);
            }
        } else if (OnVeryClick.equals(intent.getAction())) {
            Log.d("moodType ", moodType);
            widgetId = intent.getIntExtra(intentExtraWidgetIdKey, -1);
            if (moodType == MOOD_TYPE_PRETTY || moodType == MOOD_TYPE_REGULAR) {
                moodType = MOOD_TYPE_VERY;
                views.setInt(R.id.very_button_id, "setTextColor", context.getColor(R.color.white));
                views.setInt(R.id.very_button_id, "setBackgroundColor", Color.parseColor("#7265E3"));
                views.setInt(R.id.pretty_button_id, "setTextColor", context.getColor(R.color.black));
                views.setInt(R.id.pretty_button_id, "setBackgroundColor", context.getColor(R.color.white));
            } else {
                moodType = MOOD_TYPE_REGULAR;
                views.setInt(R.id.very_button_id, "setTextColor", context.getColor(R.color.black));
                views.setInt(R.id.very_button_id, "setBackgroundColor", context.getColor(R.color.white));
            }
            if (widgetId != -1) {
                AppWidgetManager.getInstance(context).updateAppWidget(new ComponentName(context.getPackageName(), MoodInputWidget.class.getName()), views);
            }
        } else {
            for (int i = 0; i < onClickIntents.size(); i++) {
                if (onClickIntents.get(i).equals(intent.getAction())){
                    //your onClick action is here
                    widgetId = intent.getIntExtra(intentExtraWidgetIdKey, -1);
                    Log.d("Button Click", onClickIntents.get(i) + "---" + moods.get(i).moodName);
                    selectedMood = null;
                    selectedMood = moods.get(i);
                    views.setTextViewText(R.id.mood_name_text_view_id, moods.get(i).moodName);
                    for (int x = 0; x < buttonIds.size(); x++) {
                        views.setInt(buttonIds.get(x), "setBackgroundColor", selectedMood.color);
                    }
                    views.setInt(R.id.save_button_id, "setBackgroundResource", R.drawable.mood_select_save_button);
                    //#7265E3
                    if (widgetId != -1) {
                        AppWidgetManager.getInstance(context).updateAppWidget(new ComponentName(context.getPackageName(), MoodInputWidget.class.getName()), views);
                    }
                }
            }
        }
    }

}