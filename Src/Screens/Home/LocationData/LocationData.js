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
import {horizontalScale} from '../../../Constants/sizeChoose';
import isEmpty from 'lodash.isempty';
import getStore from '../../../redux';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import {getMyDeviceId} from '../../../services/commonService';
import {AppPermissions} from '../../../services/appPermissions';
import GetLocation from 'react-native-get-location';
import {defaultLocation, isCountryIndia} from '../../../Constants/constants';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Images from '../../../Constants/Images/Images';
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
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#C0C0C0',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#C0C0C0',
      },
    ],
  },
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

const LocationData = ({
  index,
  swiperIndex,
  isMoodUpdate,
  MoodCount,
}) => {
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [region, setRegion] = useState({...defaultLoc});
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (UserData.lat && UserData.lon) {
  //     console.log('LocationData lat ----', UserData?.lat);
  //     console.log('LocationData lon ----', UserData?.lon);
  //   }
  // }, [UserData.lat, UserData.lon]);

  const getUserLocation = async () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
    })
      .then((location) => {
        const isIndia = isCountryIndia();
        if (isIndia) {
          location = {
            latitude: Number.parseFloat(defaultLocation.latitude),
            longitude: Number.parseFloat(defaultLocation.longitude),
          };
        }
        console.log('getCurrentPosition success', location);
        // setlat(location.latitude);
        setRegion({
          ...defaultLoc,
          ...location,
        });
      })
      .catch(async (error) => {
        const { code, message } = error;
        console.log('getCurrentPosition error', code, message);
      });
  };

  const getLocationDataApi = () => {
    const params = {
      device_id: getMyDeviceId(),
      email: getStore?.()?.getState?.()?.First?.UserEmail,
      user_id: getStore?.()?.getState?.()?.First?.UserId,
      from_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      to_date: moment().format('YYYY-MM-DD'),
    };
    PostRequestApi('getLocationContextData', params)
      .then((data) => {
        console.log('✅ ✅ ✅ ✅ getLocationContextData api success✅ ✅ ✅ ✅ -data---->', data?.data?.location_data);
        if (
          Array.isArray(data?.data?.location_data) &&
          data.data.location_data.length > 0
        ) {
          let m = data.data.location_data.map((e) => {
            return {
              location: {
                latitude: e?.latitude,
                longitude: e?.longitude,
              },
              icon: e?.name?.toLowerCase?.(),
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
              return idx === array.findIndex(foundItem => isPropValuesEqual(foundItem, item, propNamesArray))
            })?.map?.((e) => {
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
          setMarkers([...getUniqueItemsByProperties(m)]);
        }
      })
      .catch((error) => {
        console.log('❌ ❌ ❌ ❌ Error in getLocationContextData api❌ ❌ ❌ ❌ : ', error);
      });
  };

  useEffect(() => {
    if (UserData.WeatherPermission === true) {
      getUserLocation();
      getLocationDataApi();
    }
  }, [UserData.WeatherPermission]);

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

  // console.log('markers --->', markers);
  return (
    <View style={styles.container}>
      <HomeSyncHeader
        label={'Location'}
        isPermissionGiven={false}
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
          customMapStyle={mapStyle}
          // mapType={MAP_TYPES.HYBRID}
          showsScale>
          {markers.map((e, idx) => (
            <Marker
              key={idx}
              coordinate={e.location}
              image={Images?.[e?.icon]}
            // title={marker.title}
            // description={marker.description}
            />
          ))}
        </MapView>
      </View>
      {!UserData.WeatherPermission && (
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => setopenActionSheet(true)}
          style={styles.actionSheetView}
        />
      )}

      <PopUp
        ComingUp={false}
        permission={UserData.StandTimePermission}
        image={Constants.Images.ScreenPopUpImg}
        dataType={'standing'}
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
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  ProgressBarView: {
    width: '88%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SmallThinText: {
    paddingVertical: 12,
    fontFamily: RubikLight,
    color: '#747690',
  },
});

export default LocationData;
