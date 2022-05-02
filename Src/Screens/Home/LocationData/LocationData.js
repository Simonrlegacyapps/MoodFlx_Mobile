import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  AppState,
} from 'react-native';
import Constants from '../../../Constants';
import {
  RubikExtraBold,
  RubikLight,
  RubikMedium,
  RubikRegular,
} from '../../../Constants/fonts/Fonts';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import PopUp from '../../../Components/PopUp/PopUp';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import {getFontSize, horizontalScale} from '../../../Constants/sizeChoose';
import isEmpty from 'lodash.isempty';
import getStore from '../../../redux';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import {getMyDeviceId} from '../../../services/commonService';
import {AppPermissions} from '../../../services/appPermissions';
import GetLocation from 'react-native-get-location';
import {dataTypes, defaultLocation, isCountryIndia} from '../../../Constants/constants';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import Images from '../../../Constants/Images/Images';
import Colors from '../../../Constants/Colors/Colors';
import PreviousArrow from '../../../../assets/svg/PreviousArrow';
import NextArrow from '../../../../assets/svg/NextArrow';
import Svg, {Image as SvgImage} from 'react-native-svg';
let mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  // {
  //   featureType: 'road',
  //   elementType: 'geometry',
  //   stylers: [
  //     {
  //       color: '#e5e5e5',
  //     },
  //   ],
  // },
  // {
  //   featureType: 'road.highway',
  //   elementType: 'geometry',
  //   stylers: [
  //     {
  //       color: '#e5e5e5',
  //     },
  //   ],
  // },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  // {
  //   featureType: 'road',
  //   elementType: 'geometry.stroke',
  //   stylers: [
  //     {
  //       color: '#C0C0C0',
  //     },
  //   ],
  // },
  // {
  //   featureType: 'road.highway',
  //   elementType: 'geometry.stroke',
  //   stylers: [
  //     {
  //       color: '#C0C0C0',
  //     },
  //   ],
  // },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#858585',
      },
    ],
  },
];

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');
const defaultLoc = {
  latitude: Number.parseFloat(defaultLocation.latitude),
  longitude: Number.parseFloat(defaultLocation.longitude),
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const CustomMarker = ({e, idx, setRef, markerIndex, markers
  // setIsTrackChanges
}) => {
  if (
    idx !== markerIndex &&
    !Number.isNaN(markerIndex) &&
    Array.isArray(markers) &&
    markers.length > 0 &&
    String(markers?.[markerIndex]?.location?.latitude) === String(e.location.latitude ?? -1) &&
    String(markers?.[markerIndex]?.location?.longitude) === String(e.location.longitude ?? -1)
  ) {
    return null;
  }
  return (
    <Marker
      key={idx}
      ref={setRef}
      coordinate={e.location}
    // image={Images?.[e?.icon]}
    // title={e?.title}
    // description={marker.description}
    >
      {!!e?.icon && (
        <Image source={Images?.[e?.icon]} style={styles.moodIcon} />
      )}
      <Callout style={styles.calloutStyle}>
        <View style={styles.labelContainer}>
          {!!e?.icon && (
            <Svg height={horizontalScale(25)} width={horizontalScale(25)}>
              <SvgImage
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                href={Images?.[e?.icon]}
              />
            </Svg>
          )}
          <View style={styles.labelSubContainer}>
            {e?.title && <Text style={styles.moodName}>{e?.title}</Text>}
            {e?.timestamp && (
              <Text style={styles.timeStamp}>{e?.timestamp ?? '20-04-2022 · 12:30PM'}</Text>
            )}
          </View>
        </View>
      </Callout>
    </Marker>
  );
};

const LocationData = ({
  index,
  swiperIndex,
  isMoodUpdate,
  MoodCount,
}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [region, setRegion] = useState({...defaultLoc});
  const [markers, setMarkers] = useState(null);
  const [markerIndex, setMarkerIndex] = useState(null);
  const mapRef = useRef(null);
  const markerInitialCalloutFlag = useRef(false);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (UserData.lat && UserData.lon) {
  //     console.log('LocationData lat ----', UserData?.lat);
  //     console.log('LocationData lon ----', UserData?.lon);
  //   }
  // }, [UserData.lat, UserData.lon]);

  const setLocationData = async () => {
    const userData = getStore?.()?.getState?.()?.First;
    const lat = userData.lat;
    const lon = userData.lon;
    let location;
    if (lat && lon) {
      location = {
        latitude: Number.parseFloat(lat),
        longitude: Number.parseFloat(lon),
      };
    } else {
      location = {
        latitude: Number.parseFloat(defaultLocation.latitude),
        longitude: Number.parseFloat(defaultLocation.longitude),
      };
    }
    // const isIndia = isCountryIndia();
    // if (isIndia) {
    //   location.latitude = Number.parseFloat(defaultLocation.latitude);
    //   location.longitude = Number.parseFloat(defaultLocation.longitude);
    // }
    console.log('getCurrentPosition success', location);
    // setlat(location.latitude);
    let _region = {
      ...defaultLoc,
      ...location,
    };
    setRegion(_region);
    // setMarkers([...[{location: {..._region}, icon: 'default'}]]);
  };

  const getSorteLocationData = l => {
    let sortedList = [...l];
    sortedList.sort(function (a, b) {
      let itemOneData = a.timestamp ? moment(a.timestamp, 'YY-MM-DD HH:mm') : null;
      let itemTwoData = b.timestamp ? moment(b.timestamp, 'YY-MM-DD HH:mm') : null;
      if (!itemOneData || !itemTwoData || itemOneData.isSame(itemTwoData)) {
        return 0;
      } else {
        return itemOneData.isAfter(itemTwoData) ? -1 : 1;
      }
    });
    sortedList = sortedList.map(e => ({
      ...e,
      timestamp: e.timestamp
        ? moment(e.timestamp, 'YY-MM-DD HH:mm')
            ?.subtract?.(600, 'minute')
            ?.add?.(moment().utcOffset(), 'minute')
            ?.format?.('YYYY-MM-DD - hh:mm A')
        : null,
    }));
    // console.log('sortedList --> ', sortedList);
    return sortedList;
  };

  const getLocationDataApi = () => {
    const params = {
      device_id: getMyDeviceId(),
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
      from_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      to_date: moment().utcOffset(600).format('YYYY-MM-DD'),
    };
    console.log('getLocationContextData params --->', params);
    PostRequestApi('getLocationContextData', params)
      .then((data) => {
        console.log('✅ ✅ ✅ ✅ getLocationContextData api success✅ ✅ ✅ ✅ -data---->', data?.data?.location_data);
        if (
          Array.isArray(data?.data?.location_data) &&
          data.data.location_data.length > 0
        ) {
          let m = data.data.location_data.map((e) => {
            let l = {};
            if (!isNaN(e?.latitude)) {
              l.latitude = Number.parseFloat(e.latitude);
            }
            if (!isNaN(e?.longitude)) {
              l.longitude = Number.parseFloat(e.longitude);
            }
            return {
              location: l,
              icon: e?.name?.toLowerCase?.(),
              title: e?.name,
              timestamp: e?.timestamp,
              // isTrackChanges: false,
            };
          });
          const isPropValuesEqual = (subject, target, propNames) => {
            return propNames.every(
              (propName) =>
                subject?.location?.[propName] !== undefined && subject?.location?.[propName] === target?.location?.[propName]
            );
          };
          const getUniqueItemsByProperties = (items) => {
            const propNamesArray = ['latitude', 'longitude'];
            return items.filter((item, idx, array) => {
              return idx === array.findIndex(foundItem => isPropValuesEqual(foundItem, item, propNamesArray));
            })?.map?.((e, idx) => {
              let l = {};
              if (!isNaN(e?.location?.latitude)) {
                l.latitude = Number.parseFloat(e.location.latitude);
              }
              if (!isNaN(e?.location?.longitude)) {
                l.longitude = Number.parseFloat(e.location.longitude);
              }
              return { ...e, location: l };
            }) ?? [];
          };
          // let _markers = [...getUniqueItemsByProperties(m)];
          let _markers = getSorteLocationData(m);
          // console.log('m --->', m);
          // console.log('markers --->', _markers);
          setMarkers(_markers);
          if (!isNaN(_markers?.[0]?.location?.latitude)) {
            setRegion({ ...defaultLoc, ..._markers[0].location });
            setMarkerIndex(0);
          }
        } else {
          setLocationData();
        }
      })
      .catch((error) => {
        setLocationData();
        console.log('❌ ❌ ❌ ❌ Error in getLocationContextData api❌ ❌ ❌ ❌ : ', error);
      });
  };

  useEffect(() => {
    if (UserData.WeatherPermission === true) {
      // setLocationData(UserData.lat, UserData.lon);
      getLocationDataApi();
    }
  }, [UserData.WeatherPermission]);

  const showPrevMood = idx => {
    if (!(Array.isArray(markers) && idx <= (markers.length - 1))) {
      return;
    }
    setRegion({...defaultLoc, ...markers[idx].location});
    setMarkerIndex(idx);
    markers?.[idx - 1]?.markerRef?.hideCallout?.();
    const timeoutId = setTimeout(() => {
      markers?.[idx]?.markerRef?.showCallout?.();
      clearTimeout(timeoutId);
    }, 500);
  };

  const showNextMood = idx => {
    if (!(Array.isArray(markers) && idx >= 0)) {
      return;
    }
    setRegion({...defaultLoc, ...markers[idx].location});
    setMarkerIndex(idx);
    markers?.[idx + 1]?.markerRef?.hideCallout?.();
    const timeoutId = setTimeout(() => {
      markers[idx]?.markerRef?.showCallout?.();
      clearTimeout(timeoutId);
    }, 500);
  };

  useEffect(() => {
    if (markerInitialCalloutFlag.current !== true && markers?.[0]?.markerRef) {
      const timeoutId = setTimeout(() => {
        markers[0]?.markerRef?.showCallout?.();
        markerInitialCalloutFlag.current = true;
        clearTimeout(timeoutId);
      }, 1000);
    }
  }, [markers?.[0]?.markerRef]);

  const VerifyDone = async () => {
    // await AsyncStorage.setItem('GiveSleepPerm', 'true');

    setopenActionSheet(false);
    const timeoutId = setTimeout(async () => {
      try {
        await AppPermissions.requestLocationPermission(dispatch);
      } catch (error) {
        console.log('request location permission error ->', error);
      }
      clearTimeout(timeoutId);
    }, 400);
  };

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  const isPreviousMoodButtonDisabled = (markerIndex === null || markerIndex >= (markers.length - 1));
  const isNextMoodButtonDisabled = (markerIndex === null || markerIndex <= 0);
  
  return (
    <View style={styles.container}>
      <HomeSyncHeader
        label={'Location'}
        isPermissionGiven={UserData.WeatherPermission}
        setOpenActionSheet={setopenActionSheet}
        setAnonymousClick={setAnonymousClick}
      />
      <View style={styles.ProgressBarView}>
        <ProgressBar
          progress={
            // swiperIndex == 1
            ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) * 100
            // : 0
          }
          MoodCount={JSON.parse(MoodCount)}
          height={10}
        // backgroundColor="#CB9866"
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.SmallThinText, { flex: 1 }]}>
            Try add 3 moods per day
          </Text>
          <Text
            style={
              (styles.SmallThinText, { paddingTop: 10, paddingVertical: 0 })
            }>
            {JSON.parse(MoodCount) === null ? 0 : JSON.parse(MoodCount)}/3
          </Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={region}
          initialRegion={defaultLoc}
          moveOnMarkerPress={false}
          customMapStyle={mapStyle}
          // mapType={MAP_TYPES.HYBRID}
          showsScale>
          {UserData.WeatherPermission &&
            Array.isArray(markers) &&
            markers.map((e, idx) => (
              <CustomMarker
                e={e}
                idx={idx}
                setRef={ref => {
                  markers[idx].markerRef = null;
                  markers[idx].markerRef = ref;
                }}
                markerIndex={markerIndex}
                markers={markers}
              />
            ))}
        </MapView>
      </View>
      {markerIndex !== null &&
        !Number.isNaN(markerIndex) &&
        Array.isArray(markers) &&
        markers.length > 0 && (
          <View style={styles.rowContainer}>
            <TouchableOpacity
              disabled={isPreviousMoodButtonDisabled}
              style={[styles.buttonContainer, { opacity: isPreviousMoodButtonDisabled ? 0 : 1 }]}
              onPress={() => showPrevMood((markerIndex + 1))}>
              <PreviousArrow
                width={horizontalScale(10)}
                height={horizontalScale(10)}
              />
              <Text
                style={[styles.buttonText, { marginLeft: horizontalScale(9) }]}>
                Previous Mood
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isNextMoodButtonDisabled}
              style={[styles.buttonContainer, { opacity: isNextMoodButtonDisabled ? 0 : 1 }]}
              onPress={() => showNextMood((markerIndex - 1))}>
              <Text
                style={[styles.buttonText, { marginRight: horizontalScale(9) }]}>
                Next Mood
              </Text>
              <NextArrow
                width={horizontalScale(10)}
                height={horizontalScale(10)}
              />
            </TouchableOpacity>
          </View>
        )}
      {!UserData.WeatherPermission && (
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => setopenActionSheet(true)}
          style={styles.actionSheetView}
        />
      )}

      <PopUp
        ComingUp={false}
        permission={UserData.WeatherPermission}
        image={Constants.Images.ScreenPopUpImg}
        dataType={dataTypes.location}
        modalVisible={openActionSheet}
        dismissModalHandler={() => setopenActionSheet(false)}
        verifyDone={() => VerifyDone()}
      />

      <AnonymousPopUp
        modalVisible={AnonymousClick}
        dismissModalHandler={() => AnonymousPopUpcancelled()}
        verifyDone={() => AnonymousPopUpcancelled()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Math.ceil(SIZE),
  },
  actionSheetView: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0,
  },
  mapContainer: {
    width: '100%',
    paddingHorizontal: horizontalScale(45),
    alignSelf: 'center',
    overflow: 'hidden',
    flex: 1,
  },
  map: {
    borderRadius: horizontalScale(20),
    width: '100%',
    height: '100%',
  },
  calloutStyle: {
    // height: horizontalScale(60),
    width: Platform.OS === 'android' ? horizontalScale(185) : horizontalScale(175),
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: horizontalScale(6),
  },
  moodIconWrapper: {
    // alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'red',
    alignSelf: 'stretch',
    textAlign: 'center',
    paddingBottom: horizontalScale(5),
    // lineHeight: horizontalScale(28),
  },
  moodIcon: {
    height: horizontalScale(25),
    width: horizontalScale(25),
    resizeMode: 'stretch',
  },
  labelSubContainer: {
    marginLeft: horizontalScale(8),
  },
  moodName: {
    fontSize: getFontSize(14),
    color: Colors.blackColorCode,
    fontWeight: '500',
    fontFamily: RubikMedium,
  },
  timeStamp: {
    marginTop: horizontalScale(6),
    fontSize: getFontSize(12),
    color: Colors.greyColorCode,
    fontWeight: '400',
    fontFamily: RubikRegular,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: horizontalScale(20),
    paddingHorizontal: horizontalScale(45),
    marginBottom: horizontalScale(100),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 0.45,
    paddingVertical: horizontalScale(10),
    borderRadius: horizontalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4DFFF',
  },
  buttonText: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    fontFamily: RubikMedium,
    color: Colors.blueTextColor,
  },
  ProgressBarView: {
    width: '88%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: Colors.greyColorCode,
  },
});

export default LocationData;
