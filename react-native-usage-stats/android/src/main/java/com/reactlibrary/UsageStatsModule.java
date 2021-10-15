package com.reactlibrary;

import android.app.AppOpsManager;
import android.app.usage.NetworkStats;
import android.app.usage.NetworkStatsManager;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Process;
import android.os.RemoteException;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.common.MapBuilder;

import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static android.app.AppOpsManager.MODE_ALLOWED;
import static android.app.AppOpsManager.OPSTR_GET_USAGE_STATS;

class Stat {
    private String packageName;
    private long totalTime;
    private List<ZonedDateTime> startTimes;

    public Stat(String pkgName, long totalInterval, List<ZonedDateTime> startTimesList) {
        this.packageName = pkgName;
        this.totalTime = totalInterval;
        this.startTimes = startTimesList;
    }

    public String getPackageName() {
        return packageName;
    }

    public List<ZonedDateTime> getStartTimes() {
        return startTimes;
    }

    public long getTotalTime() {
        return totalTime;
    }
}


public class UsageStatsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private class AppUsageInfo {
        String appName, packageName;
        long timeInForeground;
        int launchCount;

        AppUsageInfo(String pName) {
            this.packageName=pName;
        }
        public String getPackageName() {
            return packageName;
        }

        public int getLaunchCount() {
            return launchCount;
        }

        public long getTimeInForeground() {
            return timeInForeground;
        }
    }

    public UsageStatsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        networkStatsManager = (NetworkStatsManager) reactContext.getSystemService(Context.NETWORK_STATS_SERVICE);
    }

    @Override
    public String getName() {
        return "UsageStats";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = MapBuilder.newHashMap();
        constants.put("INTERVAL_WEEKLY", UsageStatsManager.INTERVAL_WEEKLY);
        constants.put("INTERVAL_MONTHLY", UsageStatsManager.INTERVAL_MONTHLY);
        constants.put("INTERVAL_YEARLY", UsageStatsManager.INTERVAL_YEARLY);
        constants.put("INTERVAL_DAILY", UsageStatsManager.INTERVAL_DAILY);
        constants.put("INTERVAL_BEST", UsageStatsManager.INTERVAL_BEST);


        constants.put("TYPE_WIFI", ConnectivityManager.TYPE_WIFI);
        constants.put("TYPE_MOBILE", ConnectivityManager.TYPE_MOBILE);
        constants.put("TYPE_MOBILE_AND_WIFI", Integer.MAX_VALUE);
        return constants;
    }

    private boolean packageExists(String packageName) {
        PackageManager packageManager = reactContext.getPackageManager();
        ApplicationInfo info = null;
        try {
            info = packageManager.getApplicationInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void showUsageAccessSettings(String packageName) {
        Intent intent = new Intent(android.provider.Settings.ACTION_USAGE_ACCESS_SETTINGS);
        if (packageExists(packageName)) {
            intent.setData(Uri.fromParts("package", packageName, null));
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }


    public static String getAppNameFromPkgName(Context context, String Packagename) {
        try {
            PackageManager packageManager = context.getPackageManager();
            ApplicationInfo info = packageManager.getApplicationInfo(Packagename, PackageManager.GET_META_DATA);
            String appName = (String) packageManager.getApplicationLabel(info);
            return appName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return "";
        }
    }

    @ReactMethod
    public void queryUsageStats(int interval, double startTime, double endTime, Promise promise) {
        WritableMap result = new WritableNativeMap();
        UsageStatsManager usageStatsManager = (UsageStatsManager)reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        List<UsageStats> queryUsageStats = usageStatsManager.queryUsageStats(interval, (long) startTime, (long) endTime);
        // Map<String, UsageStats> stats = usageStatsManager.queryAndAggregateUsageStats((long) startTime, (long) endTime);
        // Log.d("UsageStats MAP: ", stats.toString());
        for (UsageStats us : queryUsageStats) {
            Log.d("UsageStats", us.getPackageName() + " = " + us.getTotalTimeInForeground());
            WritableMap usageStats = new WritableNativeMap();
            usageStats.putString("packageName", us.getPackageName());
            // usageStats.putString("appName", getAppNameFromPkgName(reactContext, us.getPackageName()));
            usageStats.putDouble("totalTimeInForeground", us.getTotalTimeInForeground());
            usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp());
            usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp());
            usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed());
            usageStats.putInt("describeContents", us.describeContents());
            result.putMap(us.getPackageName(), usageStats);
        }
        // promise.resolve(stats.toString());
        promise.resolve(result);
    }

    /**
     * Returns the stats for the [date] (defaults to today)
     */
// fun getDailyStats(date: LocalDate = LocalDate.now()): List<Stat> {
//     // The timezones we'll need 
//     val utc = ZoneId.of("UTC")
//     val defaultZone = ZoneId.systemDefault()

//     // Set the starting and ending times to be midnight in UTC time
//     val startDate = date.atStartOfDay(defaultZone).withZoneSameInstant(utc)
//     val start = startDate.toInstant().toEpochMilli()
//     val end = startDate.plusDays(1).toInstant().toEpochMilli()

//     // This will keep a map of all of the events per package name 
//     val sortedEvents = mutableMapOf<String, MutableList<UsageEvents.Event>>()

//     // Query the list of events that has happened within that time frame
//     val systemEvents = usageManager.queryEvents(start, end)
//     while (systemEvents.hasNextEvent()) {
//         val event = UsageEvents.Event()
//         systemEvents.getNextEvent(event)

//         // Get the list of events for the package name, create one if it doesn't exist
//         val packageEvents = sortedEvents[event.packageName] ?: mutableListOf()
//         packageEvents.add(event)
//         sortedEvents[event.packageName] = packageEvents
//     }

//     // This will keep a list of our final stats
//     val stats = mutableListOf<Stat>()

//     // Go through the events by package name
//     sortedEvents.forEach { packageName, events ->
//         // Keep track of the current start and end times
//         var startTime = 0L
//         var endTime = 0L
//         // Keep track of the total usage time for this app
//         var totalTime = 0L
//         // Keep track of the start times for this app 
//         val startTimes = mutableListOf<ZonedDateTime>()
//         events.forEach {
//             if (it.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
//                 // App was moved to the foreground: set the start time
//                 startTime = it.timeStamp
//                 // Add the start time within this timezone to the list
//                 startTimes.add(Instant.ofEpochMilli(startTime).atZone(utc)
//                         .withZoneSameInstant(defaultZone))
//             } else if (it.eventType == UsageEvents.Event.MOVE_TO_BACKGROUND) {
//                 // App was moved to background: set the end time
//                 endTime = it.timeStamp
//             }

//             // If there's an end time with no start time, this might mean that
//             //  The app was started on the previous day, so take midnight 
//             //  As the start time 
//             if (startTime == 0L && endTime != 0L) {
//                 startTime = start
//             }

//             // If both start and end are defined, we have a session
//             if (startTime != 0L && endTime != 0L) {
//                 // Add the session time to the total time
//                 totalTime += endTime - startTime
//                 // Reset the start/end times to 0
//                 startTime = 0L
//                 endTime = 0L
//             }
//         }

//         // If there is a start time without an end time, this might mean that
//         //  the app was used past midnight, so take (midnight - 1 second) 
//         //  as the end time
//         if (startTime != 0L && endTime == 0L) {
//             totalTime += end - 1000 - startTime
//         }
//         stats.add(Stat(packageName, totalTime, startTimes))
//     }
//     return stats
// }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private boolean getIsSystemApp(String pkgName) {
        PackageManager packageManager = (PackageManager)reactContext.getPackageManager();
        boolean flag = false;
        ApplicationInfo info = null;
        try {
            info = packageManager.getApplicationInfo(pkgName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        
        if (info != null && (info.flags & ApplicationInfo.FLAG_SYSTEM) != 0) {
            // System.out.println(">>>>>>packages is system package" + pkgName);
            System.out.println(">>>>>>package is system package" + pkgName);
            flag = true;
        } else {
            System.out.println(">>>>>>packages is not system package" + pkgName);    
        }
        
        return flag;
    }

    @ReactMethod
    public void getTodayStats(Promise promise) {
        long phoneUsageToday = 0;
        List<AppUsageInfo> smallInfoList;
        UsageEvents.Event currentEvent;
        List<UsageEvents.Event> allEvents = new ArrayList<>();
        HashMap<String, AppUsageInfo> map = new HashMap <String, AppUsageInfo> ();
        ZoneId defaultZone = ZoneId.systemDefault();
        long currTime = System.currentTimeMillis();
        ZonedDateTime startDate = LocalDate.now().atStartOfDay(defaultZone);
        long startTime = startDate.toInstant().toEpochMilli();

        UsageStatsManager mUsageStatsManager =  (UsageStatsManager)
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

        assert mUsageStatsManager != null;
        UsageEvents usageEvents = mUsageStatsManager.queryEvents(startTime, currTime);

        //capturing all events in a array to compare with next element

        while (usageEvents.hasNextEvent()) {
            currentEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currentEvent);
            if (currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND ||
                    currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                allEvents.add(currentEvent);
                String key = currentEvent.getPackageName();
        // taking it into a collection to access by package name
                if (map.get(key)==null)
                    map.put(key,new AppUsageInfo(key));
            }
        }

        //iterating through the arraylist
        for (int i=0;i<allEvents.size()-1;i++){
            UsageEvents.Event E0=allEvents.get(i);
            UsageEvents.Event E1=allEvents.get(i+1);

        //for launchCount of apps in time range
            if (!E0.getPackageName().equals(E1.getPackageName()) && E1.getEventType()==1){
        // if true, E1 (launch event of an app) app launched
                map.get(E1.getPackageName()).launchCount++;
            }

        //for UsageTime of apps in time range
            if (E0.getEventType()==1 && E1.getEventType()==2
                    && E0.getClassName().equals(E1.getClassName())){
                long diff = E1.getTimeStamp()-E0.getTimeStamp();
                phoneUsageToday+=diff; //gloabl Long var for total usagetime in the timerange
                map.get(E0.getPackageName()).timeInForeground+= diff;
            }
        }
        //transferred final data into modal class object
        smallInfoList = new ArrayList<>(map.values());
        WritableMap result = new WritableNativeMap();
        for (AppUsageInfo us : smallInfoList) {
            Log.d("UsageStats", us.getPackageName() + " = " + us.getTimeInForeground());
            WritableMap usageStats = new WritableNativeMap();
            int launchCount = us.getLaunchCount();
            usageStats.putString("packageName", us.getPackageName());
            // usageStats.putString("appName", getAppNameFromPkgName(reactContext, us.getPackageName()));
            usageStats.putDouble("totalTimeInForeground", us.getTimeInForeground());
            usageStats.putDouble("totalTime", phoneUsageToday);
            usageStats.putInt("launchCount", launchCount);
//            usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp());
//            usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp());
//            usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed());
//            usageStats.putInt("describeContents", us.describeContents());
            if (getIsSystemApp(us.getPackageName()) == false) {
                result.putMap(us.getPackageName(), usageStats);
            }
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void getYesterdayStats(Promise promise) {
        long phoneUsageToday = 0;
        List<AppUsageInfo> smallInfoList;
        UsageEvents.Event currentEvent;
        List<UsageEvents.Event> allEvents = new ArrayList<>();
        HashMap<String, AppUsageInfo> map = new HashMap <String, AppUsageInfo> ();
        ZoneId defaultZone = ZoneId.systemDefault();
        ZonedDateTime startDate = LocalDate.now().minusDays(1).atStartOfDay(defaultZone);
        long startTime = startDate.toInstant().toEpochMilli();
        long currTime = startTime + 86399000;

        UsageStatsManager mUsageStatsManager =  (UsageStatsManager)
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

        assert mUsageStatsManager != null;
        UsageEvents usageEvents = mUsageStatsManager.queryEvents(startTime, currTime);

        //capturing all events in a array to compare with next element

        while (usageEvents.hasNextEvent()) {
            currentEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currentEvent);
            if (currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND ||
                    currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                allEvents.add(currentEvent);
                String key = currentEvent.getPackageName();
                // taking it into a collection to access by package name
                if (map.get(key)==null)
                    map.put(key,new AppUsageInfo(key));
            }
        }

        //iterating through the arraylist
        for (int i=0;i<allEvents.size()-1;i++){
            UsageEvents.Event E0=allEvents.get(i);
            UsageEvents.Event E1=allEvents.get(i+1);

            //for launchCount of apps in time range
            if (!E0.getPackageName().equals(E1.getPackageName()) && E1.getEventType()==1){
                // if true, E1 (launch event of an app) app launched
                map.get(E1.getPackageName()).launchCount++;
            }

            //for UsageTime of apps in time range
            if (E0.getEventType()==1 && E1.getEventType()==2
                    && E0.getClassName().equals(E1.getClassName())){
                long diff = E1.getTimeStamp()-E0.getTimeStamp();
                phoneUsageToday+=diff; //gloabl Long var for total usagetime in the timerange
                map.get(E0.getPackageName()).timeInForeground+= diff;
            }
        }
        //transferred final data into modal class object
        smallInfoList = new ArrayList<>(map.values());
        WritableMap result = new WritableNativeMap();
        for (AppUsageInfo us : smallInfoList) {
            Log.d("UsageStats", us.getPackageName() + " = " + us.getTimeInForeground());
            WritableMap usageStats = new WritableNativeMap();
            int launchCount = us.getLaunchCount();
            usageStats.putString("packageName", us.getPackageName());
            // usageStats.putString("appName", getAppNameFromPkgName(reactContext, us.getPackageName()));
            usageStats.putDouble("totalTimeInForeground", us.getTimeInForeground());
            usageStats.putDouble("totalTime", phoneUsageToday);
            usageStats.putInt("launchCount", launchCount);
//            usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp());
//            usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp());
//            usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed());
//            usageStats.putInt("describeContents", us.describeContents());
            if (getIsSystemApp(us.getPackageName()) == false) {
                result.putMap(us.getPackageName(), usageStats);
            }
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void getUsageStats(double start, double end, Promise promise) {
        long phoneUsageToday = 0;
//        Log.d("getUsageStats", String.valueOf(start) + " = " + String.valueOf(end));
        List<AppUsageInfo> smallInfoList;
        UsageEvents.Event currentEvent;
        List<UsageEvents.Event> allEvents = new ArrayList<>();
        HashMap<String, AppUsageInfo> map = new HashMap <String, AppUsageInfo> ();
        ZoneId defaultZone = ZoneId.systemDefault();
        long currTime = (long) end;
        ZonedDateTime startDate = LocalDate.now().atStartOfDay(defaultZone);
        long startTime = (long) start;
//        Log.d("getUsageStats", String.valueOf(startTime) + " = " + String.valueOf(currTime));

        UsageStatsManager mUsageStatsManager =  (UsageStatsManager)
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

        assert mUsageStatsManager != null;
        UsageEvents usageEvents = mUsageStatsManager.queryEvents(startTime, currTime);

        //capturing all events in a array to compare with next element

        while (usageEvents.hasNextEvent()) {
            currentEvent = new UsageEvents.Event();
            usageEvents.getNextEvent(currentEvent);
            if (currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND ||
                    currentEvent.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                allEvents.add(currentEvent);
                String key = currentEvent.getPackageName();
                // taking it into a collection to access by package name
                if (map.get(key)==null)
                    map.put(key,new AppUsageInfo(key));
            }
        }

        //iterating through the arraylist
        for (int i=0;i<allEvents.size()-1;i++){
            UsageEvents.Event E0=allEvents.get(i);
            UsageEvents.Event E1=allEvents.get(i+1);

            //for launchCount of apps in time range
            if (!E0.getPackageName().equals(E1.getPackageName()) && E1.getEventType()==1){
                // if true, E1 (launch event of an app) app launched
                map.get(E1.getPackageName()).launchCount++;
            }

            //for UsageTime of apps in time range
            if (E0.getEventType()==1 && E1.getEventType()==2
                    && E0.getClassName().equals(E1.getClassName())){
                long diff = E1.getTimeStamp()-E0.getTimeStamp();
                phoneUsageToday+=diff; //gloabl Long var for total usagetime in the timerange
                map.get(E0.getPackageName()).timeInForeground+= diff;
            }
        }
        //transferred final data into modal class object
        smallInfoList = new ArrayList<>(map.values());
        WritableMap result = new WritableNativeMap();
        for (AppUsageInfo us : smallInfoList) {
            Log.d("UsageStats", us.getPackageName() + " = " + us.getTimeInForeground());
            WritableMap usageStats = new WritableNativeMap();
            int launchCount = us.getLaunchCount();
            usageStats.putString("packageName", us.getPackageName());
            // usageStats.putString("appName", getAppNameFromPkgName(reactContext, us.getPackageName()));
            usageStats.putDouble("totalTimeInForeground", us.getTimeInForeground());
            usageStats.putDouble("totalTime", phoneUsageToday);
            usageStats.putInt("launchCount", launchCount);
//            usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp());
//            usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp());
//            usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed());
//            usageStats.putInt("describeContents", us.describeContents());
            if (getIsSystemApp(us.getPackageName()) == false) {
                result.putMap(us.getPackageName(), usageStats);
            }
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void getDailyStats(Promise promise) {
        // The timezones we'll need
        UsageStatsManager usageStatsManager = (UsageStatsManager)reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        ZoneId utc = ZoneId.of("UTC");
        ZoneId defaultZone = ZoneId.systemDefault();
        // Set the starting and ending times to be midnight in UTC time
//        Date startDate = date.atStartOfDay(defaultZone).withZoneSameInstant(utc)
        ZonedDateTime startDate = LocalDate.now().atStartOfDay(defaultZone).withZoneSameInstant(utc);
        long start = startDate.toInstant().toEpochMilli();
        long end = LocalDateTime.now().atZone(defaultZone).withZoneSameInstant(utc).toInstant().toEpochMilli();

        // This will keep a map of all of the events per package name
        Map<String, List<UsageEvents.Event>> sortedEvents = new HashMap<>();

        // Query the list of events that has happened within that time frame
        UsageEvents systemEvents = usageStatsManager.queryEvents(start, end);
        while (systemEvents.hasNextEvent()) {
            UsageEvents.Event event = new UsageEvents.Event();
            systemEvents.getNextEvent(event);


            // Get the list of events for the package name, create one if it doesn't exist
            List<UsageEvents.Event> packageEvents = (sortedEvents.get(event.getPackageName()) != null) ? sortedEvents.get(event.getPackageName()) : new ArrayList<UsageEvents.Event>();
            packageEvents.add(event);
            sortedEvents.put(event.getPackageName(), packageEvents);
        }

        // This will keep a list of our final stats
        List<Stat> stats = new ArrayList<Stat>();

        // Go through the events by package name
        for (Map.Entry<String, List<UsageEvents.Event>> set :
                sortedEvents.entrySet()) {

            // Printing all elements of a Map
//            Log.d(set.getKey() + " = " + set.getValue());

            // Keep track of the current start and end times
            long startTime = 0L;
            long endTime = 0L;
            // Keep track of the total usage time for this app
            long totalTime = 0L;
            // Keep track of the start times for this app
            List<ZonedDateTime> startTimes = new ArrayList<>();
            for (UsageEvents.Event it : set.getValue()) {
                int eventType = it.getEventType();
                if (eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                    // App was moved to the foreground: set the start time
                    startTime = it.getTimeStamp();
                    // Add the start time within this timezone to the list
                    startTimes.add(Instant.ofEpochMilli(startTime).atZone(utc)
                            .withZoneSameInstant(defaultZone));
                } else if (eventType == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                    // App was moved to background: set the end time
                    endTime = it.getTimeStamp();
                }

                // If there's an end time with no start time, this might mean that
                //  The app was started on the previous day, so take midnight
                //  As the start time
                if (startTime == 0L && endTime != 0L) {
                    startTime = start;
                }

                // If both start and end are defined, we have a session
                if (startTime != 0L && endTime != 0L) {
                    // Add the session time to the total time
                    totalTime += endTime - startTime;
                    // Reset the start/end times to 0
                    startTime = 0L;
                    endTime = 0L;
                }
            }
            // If there is a start time without an end time, this might mean that
            //  the app was used past midnight, so take (midnight - 1 second)
            //  as the end time
            if (startTime != 0L && endTime == 0L) {
                totalTime = totalTime + end - 1000 - startTime;
            }
            stats.add(new Stat(set.getKey(), totalTime, startTimes));
        }

        WritableMap result = new WritableNativeMap();
        for (Stat us : stats) {
            Log.d("UsageStats", us.getPackageName() + " = " + us.getTotalTime());
            WritableMap usageStats = new WritableNativeMap();
            List<ZonedDateTime> sTimes = us.getStartTimes();
            String sTimesString = sTimes == null ? "" : sTimes.toString();
            usageStats.putString("packageName", us.getPackageName());
            // usageStats.putString("appName", getAppNameFromPkgName(reactContext, us.getPackageName()));
            usageStats.putDouble("totalTimeInForeground", us.getTotalTime());
            usageStats.putString("startTimes", sTimesString);
//            usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp());
//            usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp());
//            usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed());
//            usageStats.putInt("describeContents", us.describeContents());
            if (getIsSystemApp(us.getPackageName()) == false) {
                result.putMap(us.getPackageName(), usageStats);
            }
        }
        promise.resolve(result);
//        return stats;
    }

    @ReactMethod
    public void getPreviousDayStats(Promise promise) {
        // The timezones we'll need
        UsageStatsManager usageStatsManager = (UsageStatsManager)reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        ZoneId utc = ZoneId.of("UTC");
        ZoneId defaultZone = ZoneId.systemDefault();
        // Set the starting and ending times to be midnight in UTC time
//        Date startDate = date.atStartOfDay(defaultZone).withZoneSameInstant(utc)
        ZonedDateTime startDate = LocalDate.now().minusDays(1).atStartOfDay(defaultZone).withZoneSameInstant(utc);
        long start = startDate.toInstant().toEpochMilli();
//        long end = LocalDate.now().atStartOfDay(defaultZone).minusSeconds(1).withZoneSameInstant(utc).toInstant().toEpochMilli();
        long end = start + 86399000;
        // This will keep a map of all of the events per package name
        Map<String, List<UsageEvents.Event>> sortedEvents = new HashMap<>();

        // Query the list of events that has happened within that time frame
        UsageEvents systemEvents = usageStatsManager.queryEvents(start, end);
        while (systemEvents.hasNextEvent()) {
            UsageEvents.Event event = new UsageEvents.Event();
            systemEvents.getNextEvent(event);

            // Get the list of events for the package name, create one if it doesn't exist
            List<UsageEvents.Event> packageEvents = (sortedEvents.get(event.getPackageName()) != null) ? sortedEvents.get(event.getPackageName()) : new ArrayList<UsageEvents.Event>();
            packageEvents.add(event);
            sortedEvents.put(event.getPackageName(), packageEvents);
        }

        // This will keep a list of our final stats
        List<Stat> stats = new ArrayList<Stat>();

        // Go through the events by package name
        for (Map.Entry<String, List<UsageEvents.Event>> set :
                sortedEvents.entrySet()) {

            // Printing all elements of a Map
//            Log.d(set.getKey() + " = " + set.getValue());

            // Keep track of the current start and end times
            long startTime = 0L;
            long endTime = 0L;
            // Keep track of the total usage time for this app
            long totalTime = 0L;
            // Keep track of the start times for this app
            List<ZonedDateTime> startTimes = new ArrayList<>();
            for (UsageEvents.Event it : set.getValue()) {
                int eventType = it.getEventType();
                if (eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                    // App was moved to the foreground: set the start time
                    startTime = it.getTimeStamp();
                    // Add the start time within this timezone to the list
                    startTimes.add(Instant.ofEpochMilli(startTime).atZone(utc)
                            .withZoneSameInstant(defaultZone));
                } else if (eventType == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                    // App was moved to background: set the end time
                    endTime = it.getTimeStamp();
                }

                // If there's an end time with no start time, this might mean that
                //  The app was started on the previous day, so take midnight
                //  As the start time
                if (startTime == 0L && endTime != 0L) {
                    startTime = start;
                }

                // If both start and end are defined, we have a session
                if (startTime != 0L && endTime != 0L) {
                    // Add the session time to the total time
                    totalTime += endTime - startTime;
                    // Reset the start/end times to 0
                    startTime = 0L;
                    endTime = 0L;
                }
            }
            // If there is a start time without an end time, this might mean that
            //  the app was used past midnight, so take (midnight - 1 second)
            //  as the end time
            if (startTime != 0L && endTime == 0L) {
                totalTime = totalTime + end - 1000 - startTime;
            }
            stats.add(new Stat(set.getKey(), totalTime, startTimes));
        }

        WritableMap result = new WritableNativeMap();
        for (Stat us : stats) {
            Log.d("UsageStats", us.getPackageName() + " = " + us.getTotalTime());
            WritableMap usageStats = new WritableNativeMap();
            List<ZonedDateTime> sTimes = us.getStartTimes();
            String sTimesString = sTimes == null ? "" : sTimes.toString();
            usageStats.putString("packageName", us.getPackageName());
            // usageStats.putString("appName", getAppNameFromPkgName(reactContext, us.getPackageName()));
            usageStats.putDouble("totalTimeInForeground", us.getTotalTime());
            usageStats.putString("startTimes", sTimesString);
//            usageStats.putDouble("firstTimeStamp", us.getFirstTimeStamp());
//            usageStats.putDouble("lastTimeStamp", us.getLastTimeStamp());
//            usageStats.putDouble("lastTimeUsed", us.getLastTimeUsed());
//            usageStats.putInt("describeContents", us.describeContents());
            if (getIsSystemApp(us.getPackageName()) == false) {
                result.putMap(us.getPackageName(), usageStats);
            }
        }
        promise.resolve(result);
//        return stats;
    }


// // Helper class to keep track of all of the stats 
// class Stat(val packageName: String, val totalTime: Long, val startTimes: List<ZonedDateTime>)


    private NetworkStatsManager networkStatsManager;

    @ReactMethod
    public void checkForPermission(Promise promise) {
        AppOpsManager appOps = (AppOpsManager) reactContext.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(OPSTR_GET_USAGE_STATS, Process.myUid(), reactContext.getPackageName());
        promise.resolve(mode == MODE_ALLOWED);
    }

    private double getDataUsage(int networkType, String subscriberId, int packageUid, long startTime, long endTime) {
        NetworkStats networkStatsByApp;
        double currentDataUsage = 0;
        try {
            networkStatsByApp = networkStatsManager.querySummary(networkType, subscriberId, startTime, endTime);
            do {
                NetworkStats.Bucket bucket = new NetworkStats.Bucket();
                networkStatsByApp.getNextBucket(bucket);
                if (bucket.getUid() == packageUid) {
                    currentDataUsage += (bucket.getRxBytes() + bucket.getTxBytes());
                }
            } while (networkStatsByApp.hasNextBucket());

        } catch (RemoteException e) {
            e.printStackTrace();
        }
        return currentDataUsage;
    }

    @ReactMethod
    public void getAppDataUsage(String packageName, int networkType, double startTime, double endTime, Promise promise) {
        // get sim card
        int uid = getAppUid(packageName);
        if (networkType == ConnectivityManager.TYPE_MOBILE) {
            promise.resolve(getDataUsage(ConnectivityManager.TYPE_MOBILE,  null, uid, (long) startTime, (long) endTime));
        } else if (networkType == ConnectivityManager.TYPE_WIFI) {
            promise.resolve(getDataUsage(ConnectivityManager.TYPE_WIFI, "", uid, (long) startTime, (long) endTime));
        } else {
            promise.resolve(getDataUsage(ConnectivityManager.TYPE_MOBILE,  "", uid, (long) startTime, (long) endTime)
                    + getDataUsage(ConnectivityManager.TYPE_WIFI, "", uid, (long) startTime, (long) endTime)
            );
        }
    }

    private int getAppUid (String packageName) {
        // get app uid
        PackageManager packageManager = reactContext.getPackageManager();
        ApplicationInfo info = null;
        try {
            info = packageManager.getApplicationInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        int uid = 0;
        if (info != null) {
            uid = info.uid;
        }
        return uid;
    }
}
