package com.moodflo;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
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

class Mood {
    String moodName;
    String moodId;
    int idx;

    public Mood(String name, String id, int idx) {
        this.moodName = name;
        this.moodId = id;
        this.idx = idx;
    }
}

/**
 * Implementation of App Widget functionality.
 */
public class MoodInputWidget extends AppWidgetProvider {
    private static final String OnSaveClick = "onSaveClick";
    private List<Mood> moods = new ArrayList<>();
    private  List<String> onClickIntents = new ArrayList(
            List.of("0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"));
    private  List<Integer> buttonIds = new ArrayList(
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
    private int widgetId = -1;
    private Mood selectedMood = null;


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

        for (int appWidgetId : appWidgetIds) {
//            updateAppWidget(context, appWidgetManager, appWidgetId);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.mood_input_widget);
//            views.setTextViewText(R.id.appwidget_text, appData.getString("text"));
//            appWidgetManager.updateAppWidget(appWidgetId, views);

//            views.setOnClickPendingIntent(R.id.button_1_id, getPendingSelfIntent(context, MyOnClick));
            views.setOnClickPendingIntent(R.id.save_button_id, getPendingSelfIntent(context, OnSaveClick));
            for (int i = 0; i < buttonIds.size(); i++) {
                views.setOnClickPendingIntent(buttonIds.get(i), getPendingSelfIntent(context, onClickIntents.get(i)));
            }
            widgetId = appWidgetId;
            setMoods();
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }

    public void setMoods() {
        if (moods.isEmpty()) {
            //1
            moods.add(new Mood("Annoyed", "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c", 1));
            //2
            moods.add(new Mood("Tense", "71c07325-3311-483f-b048-605d834d0661", 2));
            //3
            moods.add(new Mood("Alert", "c3d99c75-dd32-437b-a417-5e1654328cb1", 3));
            //4
            moods.add(new Mood("Excited", "a6b543a4-07d3-4781-8f1a-80ddf7f22808", 4));
            //5
            moods.add(new Mood("Upset", "a2fb79e8-e203-46a5-8d76-a6efcefe26f2", 5));
            //6
            moods.add(new Mood("Frustrated", "594e5408-8e0f-4613-b843-fb81d2322eb8", 6));
            //7
            moods.add(new Mood("Amused", "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09", 7));
            //8
            moods.add(new Mood("Delighted", "c52921a3-fc8f-4e8c-9a77-d9ba17a773dd", 8));
            //9
            moods.add(new Mood("Upset", "a2fb79e8-e203-46a5-8d76-a6efcefe26f2", 9));
            //10
            moods.add(new Mood("Impatient", "b4bd1683-8581-4156-844b-bc88c1f439f0", 10));
            //11
            moods.add(new Mood("Amused", "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09", 11));
            //12
            moods.add(new Mood("Happy", "13b3c477-9e5f-4bd3-b312-0abbb32e48bb", 12));
            //13
            moods.add(new Mood("Sad", "e08c39dc-579a-4e8e-a342-967931151ca9", 13));
            //14
            moods.add(new Mood("Gloomy", "abad9076-b41c-45fe-a3e5-960b1afe5f9f", 14));
            //15
            moods.add(new Mood("Glad", "23bd0192-8d1a-435f-a6b7-8c5fa97c5487", 15));
            //16
            moods.add(new Mood("Content", "43bd3752-d44b-4309-90f8-b081172461f2", 16));
            //17
            moods.add(new Mood("Bored", "da6e32d2-f8f0-439d-8540-ed85d543c2aa", 17));
            //18
            moods.add(new Mood("Worried", "2c764148-a046-409f-97c8-85220c2162de", 18));
            //19
            moods.add(new Mood("Calm", "56b4197c-8f6a-48bc-8751-33b16a572da7", 19));
            //20
            moods.add(new Mood("Relaxed", "88028988-a2d5-4ee3-8912-a4ffac7e9c43", 20));
            //21
            moods.add(new Mood("Bored", "da6e32d2-f8f0-439d-8540-ed85d543c2aa", 21));
            //22
            moods.add(new Mood("Tired", "32043734-1bac-4b59-8e15-b6791011f52f", 22));
            //23
            moods.add(new Mood("Calm", "56b4197c-8f6a-48bc-8751-33b16a572da7", 23));
            //24
            moods.add(new Mood("Relaxed", "88028988-a2d5-4ee3-8912-a4ffac7e9c43", 24));
        }
    }


    protected PendingIntent getPendingSelfIntent(Context context, String action) {
        Intent intent = new Intent(context, getClass());
        intent.setAction(action);
        return PendingIntent.getBroadcast(context, 0, intent, 0);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        RemoteViews views = new RemoteViews(context.getPackageName(),
                R.layout.mood_input_widget);
        if (OnSaveClick.equals(intent.getAction())) {
            String saveMoodName = "No mood selected";
            if (selectedMood != null && selectedMood instanceof Mood) {
                saveMoodName = selectedMood.moodName;
            }
            Log.d("Save Button Click", "Save mood" + "---" + saveMoodName);
        } else {
            for (int i = 0; i < onClickIntents.size(); i++) {
                if (onClickIntents.get(i).equals(intent.getAction())){
                    //your onClick action is here
                    Log.d("Button Click", onClickIntents.get(i) + "---" + moods.get(i).moodName);
                    selectedMood = null;
                    selectedMood = moods.get(i);
                    views.setTextViewText(R.id.mood_name_text_view_id, moods.get(i).moodName);
                    AppWidgetManager.getInstance(context).updateAppWidget(
                            widgetId,views);
            }
        }
        }
    }

}