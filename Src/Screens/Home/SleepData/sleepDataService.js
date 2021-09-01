
import moment from 'moment';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import { SetSleepDataSyncStatus, SleepPerm } from '../../../redux/actions/actions';
import {
  Platform
} from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-community/async-storage';
import {AppPermissions, googleFitScopes} from '../../../services/appPermissions';

export const sleepDataPermissionsIOS = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.SleepAnalysis],
    write: [],
  },
};

let sleepDataLastThirtyDays = [];

export function setSleepDataLastThirtyDays(data) {
  if (Array.isArray(data) && data.length > 0) {
    sleepDataLastThirtyDays = null;
    sleepDataLastThirtyDays = data;
  }
}

export function getSleepDataLastThirtyDays() {
  return sleepDataLastThirtyDays;
}

export function fetchSleepDataForLastThirtyDays({ askPermission, onUpdate, dispatch }) {
  if (Platform.OS === 'ios') {
    getSleepDataAfterPermissionIOS({ askPermission, onUpdate, dispatch });
  } else if (Platform.OS === 'android') {
    getSleepDataAfterPermissionAndroid({ askPermission, onUpdate, dispatch });
  }
}

export async function getSleepDataAfterPermissionAndroid({ askPermission, onUpdate, dispatch }) {
  if (askPermission) {
    AppPermissions.requestActivityPermission(dispatch);
    return;
  }
  const getSleepData = (callback) => {
    const sleepOptions = {
      // startDate: (moment().startOf('day').subtract(1, 'days').toDate()).toISOString(), // required
      startDate: (moment().startOf('day').subtract(30, 'days').toDate()).toISOString(), // required
      endDate: (new Date()).toISOString(), // optional; default now
    };
    GoogleFit.getSleepSamples(sleepOptions)
      .then(results => {
        if (results) {
          // console.log('Google Fit getSleepSamples success +++++++++======>>>>', results);
          calculateSleepData(results, callback);
        }
      })
  }
  try {
    await GoogleFit.checkIsAuthorized();
    console.log('Google Fit isAuthorized sleep service: ', GoogleFit.isAuthorized);
    if (GoogleFit.isAuthorized) {
      dispatch?.(SleepPerm(true));
      setSleepDataSync(dispatch);
      getSleepData(onUpdate);
    } else {
      const options = googleFitScopes;
      await GoogleFit.authorize(options)
        .then((authResult) => {
          if (authResult.success) {
            dispatch?.(SleepPerm(true));
            setSleepDataSync(dispatch);
            getSleepData(onUpdate);
          } else {
            console.log('GoogleFit authorize AUTH_DENIED', authResult.message);
          }
        })
        .catch((error) => {
          console.log('GoogleFit authorize AUTH_ERROR', error);
        });
    }
  } catch (error) {
    console.log('Google Fit checkAuthorization error: ', error);
  }
}

export function getSleepDataAfterPermissionIOS({ askPermission, onUpdate, dispatch }) {
  if (Platform.OS === 'ios') {
    const getSleepData = (callback) => {
      const sleepOptions = {
        // startDate: (moment().startOf('day').subtract(1, 'days').toDate()).toISOString(), // required
        startDate: (moment().startOf('day').subtract(30, 'days').toDate()).toISOString(), // required
        endDate: (new Date()).toISOString(), // optional; default now
      };
      AppleHealthKit.getSleepSamples(
        sleepOptions,
        async (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getSleepAnalysis error: ', err);
          }
          if (results) {
            calculateSleepData(results, callback);
            // console.log('Sleep Analysis +++++++++======>>>>', results);
          }
          if (Array.isArray(results) && results.length > 0) {
            setSleepDataSync(dispatch, true);
          } else {
            setSleepDataSync(dispatch, false);
          }
        },
      );
    }

    AppleHealthKit.getAuthStatus(sleepDataPermissionsIOS, (err, result) => {
      // {"permissions": {"read": [0], "write": []}}
      if (err) {
        console.log('getSleepAnalysis getAuthStatus error: ', err);
      }
      // console.log('Sleep Analysis getAuthStatus +++++++++======>>>>', result);
      if (result?.permissions?.read?.[0] === 1) {
        dispatch?.(SleepPerm(true));
        getSleepData(onUpdate);
      } else if (askPermission === true) {
        AppleHealthKit.initHealthKit(sleepDataPermissionsIOS, (err, results) => {
          // setLoading(true);
          // console.log(
          //   `healthKitOptions`,
          //   sleepDataPermissionsIOS.permissions.read,
          //   results,
          //   err,
          // );
          // if ((sleepDataPermissionsIOS?.permissions?.read?.length ?? -1) === results) {
          // }
          if (err) {
            console.log('error initializing Healthkit: ', err);
            return;
          }

          if (results === 1) {
            AsyncStorage.setItem('GiveSleepPerm', 'true')
              .then(() => {
                dispatch?.(SleepPerm(true));
              })
              .catch((error) => {
                console.log('Async storage set GiveSleepPerm Error', error);
              });
          }
          // console.log('getting sleepData from IOS health app');
          getSleepData(onUpdate);
        });
      }
    });
  }
}

export function calculateSleepData(sleepData, onUpdate) {
  //sleep data for last 30 days
  if (Array.isArray(sleepData) && sleepData.length > 0) {
    let weeklySleep = null;
    let monthlySleep = null;
    let formattedData = [];
    sleepData.forEach((e, idx) => {
      const startTimeInMillis = e?.startDate ? new Date(e.startDate).getTime() : null;
      const endTimeInMillis = e?.endDate ? new Date(e.endDate).getTime() : null;
      const startDate = startTimeInMillis != null ? moment(startTimeInMillis) : null;
      const endDate = endTimeInMillis != null ? moment(endTimeInMillis) : null;
      let diff = 0;
      // console.log('calculateSleepData: ', e);
      if (startDate && endDate && Array.isArray(e?.granularity) && e?.granularity?.length > 0) {
        let asleepData = null;
        let startTimes = [];
        let endTimes = [];
        let asleepStartTime = null;
        let asleepEndTime = null;
        const awakeSleepStages = [2, 4, 5]
        e?.granularity.forEach(g => {
          const gData = g?.startDate;
          const start_date = gData?.startDate ? new Date(gData.startDate).getTime() : null;
          const end_date = gData?.endDate ? new Date(gData.endDate).getTime() : null;
          if (gData.sleepStage && awakeSleepStages.indexOf(gData.sleepStage) !== -1) {
            if (start_date !== null) {
              startTimes.push(start_date);
            }
            if (end_date !== null) {
              endTimes.push(end_date);
            }
          }
        });

        if (startTimes.length > 0 && endTimes.length > 0) {
          asleepStartTime = Math.min(...startTimes);
          asleepEndTime = Math.max(...endTimes);
        }

        asleepData = (asleepStartTime && asleepEndTime) ? {
          start_date: moment(asleepStartTime).toDate(),
          end_date: moment(asleepEndTime).toDate(),
          type: 'ASLEEP',
          duration: moment(asleepEndTime).diff(moment(asleepStartTime), 'minutes')
        } : asleepData;
        if (asleepData && asleepStartTime && asleepEndTime) {
          if (moment(asleepStartTime).date() !== moment(asleepEndTime).date()) {
            formattedData.push({
              start_date: asleepData.start_date,
              end_date: moment(asleepStartTime).endOf('day').toDate(),
              type: 'ASLEEP',
              duration: moment(asleepStartTime).endOf('day').diff(moment(asleepStartTime), 'minutes')
            });
            formattedData.push({
              start_date: moment(asleepEndTime).startOf('day').toDate(),
              end_date: endDate.toDate(),
              type: 'ASLEEP',
              duration: moment(asleepEndTime).diff(moment(asleepEndTime).startOf('day'), 'minutes'),
            });
          } else {
            formattedData.push(asleepData);
          }
        }
      }
      if (startDate && endDate) {
        const type = e?.value ?? 'INBED';
        const startOfToday = moment().startOf('day');
        if (startDate.clone().date() !== endDate.clone().date()) {
          formattedData.push({
            start_date: startDate.clone().toDate(),
            end_date: moment(startTimeInMillis).endOf('day').toDate(),
            type,
            duration: moment(startTimeInMillis).endOf('day').diff(startDate, 'minutes')
          });
          formattedData.push({
            start_date: moment(endTimeInMillis).startOf('day').toDate(),
            end_date: endDate.clone().toDate(),
            type,
            duration: endDate.diff(moment(endTimeInMillis).startOf('day'), 'minutes'),
          });
        } else {
          diff = endDate.diff(startDate, 'minutes');
          formattedData.push({
            start_date: startDate.clone().toDate(),
            end_date: endDate.clone().toDate(),
            type,
            duration: diff
          });
        }
      }
    });
    formattedData.sort(function (a, b) {
      const aDateMillis = a?.start_date ? new Date(a.start_date).getTime() : null;
      const bDateMillis = b?.start_date ? new Date(b.start_date).getTime() : null;
      if (aDateMillis === null || bDateMillis === null) {
        return 0;
      }
      return aDateMillis - bDateMillis;
    });
    setSleepDataLastThirtyDays(formattedData);
    // console.log('calculateSleepData: ', JSON.stringify(formattedData));
    onUpdate?.({
      sleepData: formattedData,
      isPermissionAsked: true
    });
  } else {
    onUpdate?.({
      sleepData: null,
      isPermissionAsked: true
    });
  }
}

export function getMonthlySleepData() {
  if (!(Array.isArray(sleepDataLastThirtyDays) && sleepDataLastThirtyDays.length > 0)) {
    return null;
  }
  let formatMonthlySleep = [];
  let monthDates = [];
  let today = moment().startOf('days');
  for (let x = 1; x <= moment().endOf('months').date(); x++) {
    monthDates.push(today.clone().date(x).toDate().getTime());
  }
  if (monthDates.length > 0) {
    monthDates.forEach((e, idx) => {
      const eData = moment(e);
      let data = null;
      sleepDataLastThirtyDays.forEach((d, idx) => {
        const startDateMillis = d?.start_date ? new Date(d.start_date).getTime() : null;
        const endDateMillis = d?.end_date ? new Date(d.end_date).getTime() : null;
        if (startDateMillis !== null && moment(startDateMillis).startOf('days').isSame(eData)) {
          if (data === null) {
            data = { ...d };
          } else {
            data = { ...data, duration: data.duration + d.duration };
          }
        }
      });
      if (data === null) {
        data = {
          start_date: eData.toDate(),
          end_date: eData.clone().endOf('days').toDate(),
          duration: 0,
        };
      }
      formatMonthlySleep.push(data);
    })
  }
  formatMonthlySleep.sort(function (a, b) {
    const aDateMillis = a?.start_date ? new Date(a.start_date).getTime() : null;
    const bDateMillis = b?.start_date ? new Date(b.start_date).getTime() : null;
    if (aDateMillis === null || bDateMillis === null) {
      return 0;
    }
    return aDateMillis - bDateMillis;
  });
  return formatMonthlySleep;
}

export function getWeeklySleepData() {
  if (!(Array.isArray(sleepDataLastThirtyDays) && sleepDataLastThirtyDays.length > 0)) {
    return null;
  }
  let formatWeeklySleep = [];
  let weekDates = [];
  let dates = [6, 5, 4, 3, 2, 1, 0];
  dates.forEach((e, idx) => {
    const d = moment().startOf('day').subtract(e, 'days').toDate().getTime();
    weekDates.push(d);
  });
  if (weekDates.length > 0 && sleepDataLastThirtyDays.length > 0) {
    weekDates.forEach((e, idx) => {
      const eData = moment(e);
      let data = null;
      sleepDataLastThirtyDays.forEach((d, idx) => {
        const startDateMillis = d?.start_date ? new Date(d.start_date).getTime() : null;
        const endDateMillis = d?.end_date ? new Date(d.end_date).getTime() : null;
        if (startDateMillis !== null && moment(startDateMillis).startOf('days').isSame(eData)) {
          if (data === null) {
            data = { ...d };
          } else {
            data = { ...data, duration: data.duration + d.duration };
          }
        }
      });
      if (data === null) {
        data = {
          start_date: eData.toDate(),
          end_date: eData.clone().endOf('days').toDate(),
          duration: 0,
        }
      }
      formatWeeklySleep.push(data);
    })
  }
  formatWeeklySleep.sort(function (a, b) {
    const aDateMillis = a?.start_date ? new Date(a.start_date).getTime() : null;
    const bDateMillis = b?.start_date ? new Date(b.start_date).getTime() : null;
    if (aDateMillis === null || bDateMillis === null) {
      return 0;
    }
    return aDateMillis - bDateMillis;
  });
  // console.log('weeklySleepData: ', formatWeeklySleep);
  return formatWeeklySleep;
}

export function getSleepGraphData({ weeklyData: { INBED: WeeklyInBed = [], ASLEEP: weeklyAsleep = [] }, monthlyData }) {
  let weeklySleepGraphData = { INBED: [], ASLEEP: [] };
  let monthlySleepGraphData = [];
  // if (Array.isArray(weeklyData) && weeklyData.length > 0 && weeklyData.length === 7 && weeklyData?.[0]?.end_date) {
  //   if(weeklyData.length === 7) {
  //     weeklySleepGraphData = [];
  //     weeklyData.forEach((e, idx) => {
  //       let day = '';
  //       if(e?.start_date){
  //         day = moment(new Date(e.start_date).getTime()).format('dd');
  //       }
  //       weeklySleepGraphData.push({
  //         x: idx + 1,
  //         y: weeklyData?.[idx]?.duration ? convertMinutesToHours(weeklyData[idx].duration) : 0,
  //         day,
  //       });
  //     });
  //   }
  // } 
  // else if(Array.isArray(weeklyData) && weeklyData.length > 0){
  const inBed = WeeklyInBed ?? [];
  const asleep = weeklyAsleep ?? [];
  // if(Array.isArray(weeklyData) && inBed > 0){
  let weekDates = [];
  let dates = [6, 5, 4, 3, 2, 1, 0];
  dates.forEach((e, idx) => {
    const d = moment().startOf('day').subtract(e, 'days').toDate().getTime();
    weekDates.push(d);
  });
  weekDates.forEach((e, idx) => {
    const eData = moment(e);
    let inBedData = null;
    let asleepData = null;
    let day = '';
    day = eData.format('dd');
    // INBED
    inBed.forEach((d) => {
      const startDateMillis = d?.start_date ? new Date(d.start_date).getTime() : null;
      if (startDateMillis !== null && moment(startDateMillis).startOf('days').isSame(eData)) {
        inBedData = {
          x: idx + 1,
          y: d?.duration ? convertMinutesToHours(d.duration) : 0,
          day,
        }
      }
    });
    if (inBedData === null) {
      inBedData = {
        x: idx + 1,
        y: 0,
        day
      }
    }
    weeklySleepGraphData.INBED.push(inBedData);

    // ASLEEP
    asleep.forEach((d) => {
      const startDateMillis = d?.start_date ? new Date(d.start_date).getTime() : null;
      if (startDateMillis !== null && moment(startDateMillis).startOf('days').isSame(eData)) {
        asleepData = {
          x: idx + 1,
          y: d?.duration ? convertMinutesToHours(d.duration) : 0,
          day,
        }
      }
    });
    if (asleepData === null) {
      asleepData = {
        x: idx + 1,
        y: 0,
        day
      }
    }
    weeklySleepGraphData.ASLEEP.push(asleepData);
  });
  // }

  // if (Array.isArray(monthlyData) && monthlyData.length > 0 && monthlyData.length >= 28) {
  //   monthlySleepGraphData = [];
  //   monthlyData.forEach((e, idx) => {
  //     let day = '';
  //     if(e?.start_date){
  //       day = moment(new Date(e.start_date).getTime()).format('D');
  //     }
  //     monthlySleepGraphData.push({
  //       x: idx + 1,
  //       y: monthlyData?.[idx]?.duration ? convertMinutesToHours(monthlyData[idx].duration) : 0,
  //       day,
  //     });
  //   });
  // }
  let graphData = null
  if (weeklySleepGraphData?.INBED?.length > 0 || weeklySleepGraphData?.ASLEEP?.length > 0) {
    graphData = { weeklyData: weeklySleepGraphData };
  }
  // if (monthlySleepGraphData.length > 0) {
  //   graphData = Object.assign({}, (graphData ?? {}), { monthlyData: monthlySleepGraphData });
  // }
  // console.log('sleep graph data: ', graphData);
  return graphData;
}

export function convertMinutesToTime(minutes) {
  if (isNaN(minutes)) {
    return 'Sync';
  }
  let hours = Number.parseInt(String(minutes / 60));
  const min = minutes % 60;
  if (min > 0) {
    const hoursOffset = (((min * 10) / 60) / 10)
    if (hoursOffset >= 0.1) {
      hours += hoursOffset;
      hours = hours.toFixed(1);
    }
  }
  if (minutes === 0) {
    return 'Sync';
  }
  return `${hours}${Number(hours) > 1 ? 'hrs' : 'hr'}`;
}

export function convertMinutesToHours(minutes) {
  if (isNaN(minutes)) {
    return 0;
  }
  let hours = Number.parseInt(String(minutes / 60));
  const min = minutes % 60;
  if (min > 0) {
    const hoursOffset = (((min * 10) / 60) / 10)
    if (hoursOffset >= 0.1) {
      hours += hoursOffset;
      hours = hours.toFixed(1);
    }
  }
  return Number(hours);
}

export function getSleepDataForUpdateApi() {
  if (!(Array.isArray(sleepDataLastThirtyDays) && sleepDataLastThirtyDays.length > 0)) {
    return null;
  }
  let formatData = [];
  let weekDates = [];
  let dates = [
    moment().startOf('days').subtract(1, 'days').toDate().getTime(),
    moment().startOf('days').toDate().getTime(),
  ];
  dates.forEach((e, idx) => {
    const d = moment().startOf('day').subtract(e, 'days').toDate().getTime();
    weekDates.push(d);
  });
  if (dates.length > 0 && sleepDataLastThirtyDays.length > 0) {
    dates.forEach((e, idx) => {
      const eData = moment(e);
      let data = null;
      sleepDataLastThirtyDays.forEach((d, idx) => {
        const startDateMillis = d?.start_date ? new Date(d.start_date).getTime() : null;
        const endDateMillis = d?.end_date ? new Date(d.end_date).getTime() : null;
        if (startDateMillis !== null && moment(startDateMillis).startOf('days').isSame(eData)) {
          data = {
            "start_date": moment(startDateMillis).format("YYYY-MM-DD HH:mm:ss"),
            "end_date": moment(endDateMillis).format("YYYY-MM-DD HH:mm:ss"),
            "type": (d?.type?.toLowerCase() === "inbed" || d?.type?.toLowerCase() === "asleep") ? d.type?.toUpperCase?.() : "INBED"
          };
          formatData.push(data);
        }
      });
    })
  }
  formatData.sort(function (a, b) {
    const aDateMillis = a?.start_date ? new Date(a.start_date).getTime() : null;
    const bDateMillis = b?.start_date ? new Date(b.start_date).getTime() : null;
    if (aDateMillis === null || bDateMillis === null) {
      return 0;
    }
    return aDateMillis - bDateMillis;
  });
  // console.log('api sleep data for update api: ', formatData);
  return formatData;
}

export const setSleepDataSync = async (dispatch, isDataComing) => {
  if (Platform.OS === 'android') {
    let SleepPer = await AsyncStorage.getItem('GiveSleepPerm');
    let SleepP = await JSON.parse(SleepPer);
    dispatch?.(SetSleepDataSyncStatus(!!SleepP));
    return;
  }
  let flag;
  try {
    flag = await AsyncStorage.getItem('IsSleepDataSync');
    flag = await JSON.parse(flag);
  } catch (error) {
    console.log('error getting IsSleepDataSync from Async storage');
  }
  if (!flag && isDataComing === true) {
    try {
      await AsyncStorage.setItem('IsSleepDataSync', JSON.stringify(true));
    } catch (error) {
      console.log('error setting IsSleepDataSync in Async storage');
    }
  }
  dispatch?.(SetSleepDataSyncStatus(isDataComing === true || !!flag));
};
