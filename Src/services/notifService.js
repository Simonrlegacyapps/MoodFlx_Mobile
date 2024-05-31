import PushNotification from 'react-native-push-notification';
// import NotificationHandler from './NotificationHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

let rA = [];

function getRandomInt(num = 16) {
  if (Array.isArray(rA) && rA.length >= 6) {
    rA = null;
    rA = [];
  }

  let n = Math.floor(Math.random() * num);
  for (let x = 1; x <= 3 && rA.includes(n); x++) {
    n = Math.floor(Math.random() * num);
  }
  rA.push(n);
  return n;
}

const notifMessages = [
  "How are you feeling?",
  "Is this a good time for a flx moment?",
  "flx time?",
  "Mood input time?",
  "Time to flx?",
  "How are you?",
  "All your feelings count - flx it",
  "Just go ahead and flx it!",
  "To flx is to let it all out!",
  "The research says when you flx you feel better",
  "What is your mood right now?",
  "All moods are important - input yours now",
  "I feel ……",
  "moodflx could use some love right now😊",
  "What if I told you that you feel better when you flx",
  "When we flx we just tell it how it is",
  "I wonder if it's a flx kind of moment",
];

export default class NotifService {
  static notifData = {
    one: {
      id: 1,
      title:
        notifMessages?.[getRandomInt(16)] ??
        'flx would love to know how you feel',
      timeInHour: 7,
      timeInMin: 0,
    },
    two: {
      id: 2,
      title: notifMessages?.[getRandomInt(16)] ?? 'Time to check in with flx',
      timeInHour: 12,
      timeInMin: 0,
    },
    // three: {
    //   id: 3,
    //   title: notifMessages?.[getRandomInt(16)] ?? "It's flx time",
    //   timeInHour: 13,
    //   timeInMin: 15,
    // },
  };

  static setNotifData() {
    if (NotifService.notifData !== null) {
      NotifService.notifData = null;
    }
    NotifService.notifData = {
      one: {
        id: 1,
        title:
          notifMessages?.[getRandomInt(16)] ??
          'flx would love to know how you feel',
        timeInHour: 7,
        timeInMin: 0,
      },
      two: {
        id: 2,
        title: notifMessages?.[getRandomInt(16)] ?? 'Time to check in with flx',
        timeInHour: 12,
        timeInMin: 0,
      },
      // three: {
      //   id: 3,
      //   title: notifMessages?.[getRandomInt(16)] ?? "It's flx time",
      //   timeInHour: 0,
      //   timeInMin: 0,
      // },
    };
  }

  static latestNotificationData = null;

  constructor() {
    this.lastId = 0;
    // this.lastChannelCounter = 0;

    // NotificationHandler.attachRegister(onRegister);
    // NotificationHandler.attachNotification(onNotification);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
    const self = this;
    PushNotification.getChannels(function (channels) {
      if (channels.indexOf('channel-one-id') === -1) {
        self.createDefaultChannels();
      }
      // console.log('channelsssssa', channels);
    });
  }

  static setLatestNotificationData(data) {
    if (data) {
      NotifService.latestNotificationData = data;
    }
  }

  static getLatestNotificationData() {
    return NotifService.latestNotificationData;
  }

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'channel-one-id', // (required)
        channelName: `Channel One`, // (required)
        channelDescription: 'Channel One', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created =>
        console.log(`createChannel 'channel-one-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    // PushNotification.createChannel(
    //   {
    //     channelId: "sound-channel-id", // (required)
    //     channelName: `Sound channel`, // (required)
    //     channelDescription: "A sound channel", // (optional) default: undefined.
    //     soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
    //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
    //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    //   },
    //   (created) => console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    // );
  }

  //   createOrUpdateChannel() {
  //     this.lastChannelCounter++;
  //     PushNotification.createChannel(
  //       {
  //         channelId: "custom-channel-id", // (required)
  //         channelName: `Custom channel - Counter: ${this.lastChannelCounter}`, // (required)
  //         channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
  //         soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //         importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //         vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //       },
  //       (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  //     );
  //   }

  popInitialNotification() {
    PushNotification.popInitialNotification(notification =>
      console.log('InitialNotication:', notification),
    );
  }

  localNotif(soundName, id) {
    this.lastId++;
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'channel-one-id',
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      subText: 'This is a subText', // (optional) default: none
      color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //   tag: 'some_tag', // (optional) add tag to message
      //   group: 'group', // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      //   actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      ignoreInForeground: true,
      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      /* iOS only properties */
      category: '', // (optional) default: empty string

      /* iOS and Android properties */
      id: id ?? this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: 'Local Notification', // (optional)
      message: 'My Notification Message', // (required)
      userInfo: {screen: 'home'}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      //   playSound: !!soundName, // (optional) default: true
      soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  }

  scheduleNotif({soundName, id, time, title = '', message}) {
    this.lastId++;
    PushNotification.localNotificationSchedule({
      date: time, // in 30 secs

      /* Android Only Properties */
      channelId: 'channel-one-id',
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      //   bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      //   subText: 'This is a subText', // (optional) default: none
      //   color: 'blue', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //   tag: 'some_tag', // (optional) add tag to message
      //   group: 'group', // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      //   actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      ignoreInForeground: true,
      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      /* iOS only properties */
      category: '', // (optional) default: empty string

      /* iOS and Android properties */
      // id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      id: id !== undefined ? id : this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: title ?? 'Scheduled Notification', // (optional)
      message: message ?? '', // (required)
      //   userInfo: { sceen: "home" }, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: !!soundName, // (optional) default: true
      soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: 'day',
    });
  }

  static async getDeviceToken() {
    let fcmToken = '';
    try {
      const value = await AsyncStorage.getItem('device_token');
      if (value !== null) {
        fcmToken = value;
      }
      console.log('fcmtoken', fcmToken);
    } catch (e) {
      console.log('error getting device_token from storage', error);
    }
    return fcmToken;
  }

  scheduleMoodFloLocalNotif() {
    NotifService.cancelAll();
    NotifService.setNotifData();
    this.scheduleMoodFloNotifWithId(NotifService.notifData.one.id);
    this.scheduleMoodFloNotifWithId(NotifService.notifData.two.id);
    // this.scheduleMoodFloNotifWithId(NotifService.notifData.three.id);
    this.getScheduledLocalNotifications(notifications => {
      console.log(
        'scheduleMoodFloLocalNotif after update: ',
        JSON.stringify(notifications),
      );
    });
  }

  checkTimeAndUpdateNotif() {
    const now = moment();
    let time = null;

    let first = new Date(
      new Date().setHours(
        NotifService.notifData.one.timeInHour,
        NotifService.notifData.one.timeInMin,
        0,
        0,
      ),
    );
    const firstTime = moment(first.getTime());
    let firstDuration = Math.ceil(
      moment.duration(firstTime.diff(now)).asMinutes(),
    );

    let second = new Date(
      new Date().setHours(
        NotifService.notifData.two.timeInHour,
        NotifService.notifData.two.timeInMin,
        0,
        0,
      ),
    );
    const secondTime = moment(second.getTime());
    let secondDuration = Math.ceil(
      moment.duration(secondTime.diff(now)).asMinutes(),
    );

    // let third = new Date(
    //   new Date().setHours(
    //     NotifService.notifData.three.timeInHour,
    //     NotifService.notifData.three.timeInMin,
    //     0,
    //     0,
    //   ),
    // );
    let third = new Date(new Date().setHours(15, 19, 0, 0));
    const thirdTime = moment(third.getTime());
    let thirdDuration = Math.ceil(
      moment.duration(thirdTime.diff(now)).asMinutes(),
    );

    if (firstDuration > 0 && firstDuration < 120) {
      this.cancelNotif(NotifService.notifData.one.id);
      time = firstTime.add(1, 'days').toDate();
      this.scheduleNotif({
        id: NotifService.notifData.one.id,
        time: time,
        message: NotifService.notifData.one.title,
      });
    } else if (secondDuration > 0 && secondDuration < 120) {
      this.cancelNotif(NotifService.notifData.two.id);
      time = secondTime.add(1, 'days').toDate();
      this.scheduleNotif({
        id: NotifService.notifData.two.id,
        time: time,
        message: NotifService.notifData.two.title,
      });
    }
    // else if (thirdDuration > 0 && thirdDuration < 120) {
    //   this.cancelNotif(NotifService.notifData.three.id);
    //   time = thirdTime.add(1, 'days').toDate();
    //   this.scheduleNotif({
    //     id: NotifService.notifData.three.id,
    //     time: time,
    //     message: NotifService.notifData.three.title,
    //   });
    // }
    // this.getScheduledLocalNotifications((notif) => {
    // console.log(
    //   'checkTimeAndUpdateNotif scheduledNotification: ',
    //   JSON.stringify(notif),
    // );
    // });
  }

  scheduleMoodFloNotifWithId(id) {
    if (id === NotifService.notifData.one.id) {
      // let first = new Date(new Date().setHours(12, 41, 0, 0));
      let first = new Date(
        new Date().setHours(
          NotifService.notifData.one.timeInHour,
          NotifService.notifData.one.timeInMin,
          0,
          0,
        ),
        // new Date().setHours(21, 19, 0, 0),
      );
      if (moment().isAfter(first.getTime(), 'second')) {
        first = moment(first.getTime()).add(1, 'days').toDate();
      }
      this.scheduleNotif({
        id: NotifService.notifData.one.id,
        time: first,
        message: NotifService.notifData.one.title,
      });
    } else if (id === NotifService.notifData.two.id) {
      let second = new Date(
        new Date().setHours(
          NotifService.notifData.two.timeInHour,
          NotifService.notifData.two.timeInMin,
          0,
          0,
        ),
        // new Date().setHours(21, 19, 30, 0),
      );
      // let second = new Date(new Date().setHours(12, 41, 30, 0));
      if (moment().isAfter(second.getTime(), 'second')) {
        second = moment(second.getTime()).add(1, 'days').toDate();
      }
      this.scheduleNotif({
        id: NotifService.notifData.two.id,
        time: second,
        message: NotifService.notifData.two.title,
      });
    }
    // else if (id === NotifService.notifData.three.id) {
    //   let third = new Date(
    //     new Date().setHours(
    //       NotifService.notifData.three.timeInHour,
    //       NotifService.notifData.three.timeInMin,
    //       0,
    //       0,
    //     ),
    //   );
    //   // let third = new Date(new Date().setHours(12, 41, 40, 0));
    //   if (moment().isAfter(third.getTime(), 'second')) {
    //     third = moment(third.getTime()).add(1, 'days').toDate();
    //   }
    //   this.scheduleNotif({
    //     id: NotifService.notifData.three.id,
    //     time: third,
    //     message: NotifService.notifData.three.title,
    //   });
    // }
  }

  checkAndScheduleNotif(id) {
    this.getScheduledLocalNotifications(notif => {
      let isScheduled = false;
      Array.isArray(notif) &&
        notif.forEach(e => {
          if (e.id === id) {
            let isFlagSet = false;
            if (
              (e.id === NotifService.notifData.one.id &&
                typeof e.title !== 'string') ||
              (e.id === NotifService.notifData.two.id &&
                typeof e.title !== 'string')
              // ||
              // (e.id === NotifService.notifData.three.id &&
              //   typeof e.title !== 'string')
            ) {
              this.cancelNotif(id);
              isScheduled = false;
              isFlagSet = true;
            }
            isScheduled = isFlagSet ? isScheduled : true;
          }
        });
      if (!isScheduled) {
        this.scheduleMoodFloNotifWithId(id);
      }
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  cancelNotif(id) {
    if (id === undefined) {
      return;
    }
    console.log('cancelNotif id: ', id);

    PushNotification.cancelLocalNotifications({id: '' + id});
    // this.getScheduledLocalNotifications((notif) => {
    //   console.log('cancelNotif scheduledNotification: ', JSON.stringify(notif));
    // });
  }

  static cancelAll() {
    PushNotification.cancelAllLocalNotifications();
    // this.getScheduledLocalNotifications((notif) => {
    //   console.log('cancelAll scheduledNotification: ', JSON.stringify(notif));
    // });
  }

  static cancelMoodFloSheduledNotifications() {
    NotifService.cancelDeliveredNotifications([
      String(NotifService.notifData.one.id),
      String(NotifService.notifData.two.id),
      // String(NotifService.notifData.three.id),
    ]);
  }

  static cancelDeliveredNotifications(identifiers) {
    console.log('cancelDeliveredNotifications idnetifiers', identifiers);
    if (Array.isArray(identifiers)) {
      PushNotification.removeDeliveredNotifications(identifiers);
    } else {
      if (identifiers) {
        PushNotification.removeDeliveredNotifications([String(identifiers)]);
      }
    }
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }

  getScheduledLocalNotifications(callback) {
    PushNotification.getScheduledLocalNotifications(callback);
  }

  getDeliveredNotifications(callback) {
    PushNotification.getDeliveredNotifications(callback);
  }
}