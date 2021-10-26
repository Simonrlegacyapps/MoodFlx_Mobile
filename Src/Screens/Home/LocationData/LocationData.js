import React, { useRef, useState, useEffect, useCallback } from 'react';
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
// import ProgressBar from 'react-native-animated-progress';
import ProgressBar from '../../../Components/ProgressBar/ProgressBarCustom';
import HomeHeader from '../../../Components/HomeHeader/HomeHeader';
import AppleHealthKit from 'react-native-health';
import BarGraph from '../../../Components/BarChart/BarGraph';
import BezierGraphAuto from '../../../Components/BezierGraphAuto/BezierGraphAuto';
import GraphicChart from '../../../Components/GraphicChart/GraphicChart';
import WeatherGraphDurationModal from '../../../Components/Modals/WeatherGraphDurationModal/WeatherGraphDurationModal';
import GraphBezierCustom from '../../../Components/GraphBezierCustom/GraphBezierCustom';
import ScreenCircleBar from '../../../Components/ScreenCircleBar/ScreenCircleBar';
import PopUp from '../../../Components/PopUp/PopUp';
import Toast from 'react-native-toast-message';
import UsageStats from 'react-native-usage-stats';
import moment from 'moment';
import CrownBox from '../../../Components/crownBox/crownBox';
import {useSelector, useDispatch} from 'react-redux';
import AnonymousPopUp from '../../../Components/Modals/AnonymousPopUp/AnonymousPopUp';
import HomeSyncHeader from '../../../Components/HomeSyncHeader/HomeSyncHeader';
import DataInsights from '../../../Components/DataInsights/DataInsights';
import ScreenTimeBarGraph from '../../../Components/ScreenTimeGraph/ScreenTimeBarGraph';
import ScreenTimeLineGraph from '../../../Components/ScreenTimeGraph/ScreenTimeLineGraph';
import { horizontalScale } from '../../../Constants/sizeChoose';
import isEmpty from 'lodash.isempty';
import getStore from '../../../redux';
import {ScreenTimePerm, SetLocation} from '../../../redux/actions/actions';
import PostRequestApi from '../../../apirequest/PostRequestApi';
import {getMyDeviceId} from '../../../services/commonService';
import {AppPermissions} from '../../../services/appPermissions';
import GetLocation from 'react-native-get-location';
import {defaultLocation, isCountryIndia} from '../../../Constants/constants';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Images from '../../../Constants/Images/Images';

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');
const defaultLoc = {
  latitude: -24.145056,
  longitude: 133.726748,
  latitudeDelta: 30.0,
  longitudeDelta: 30.0,
};

const LocationData = ({
  index,
  swiperIndex,
  isMoodUpdate,
  MoodCount,
}) => {
  const [standTimeDuration, setStandTimeDuration] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [openActionSheet, setopenActionSheet] = useState(false);
  const [AnonymousClick, setAnonymousClick] = useState(false);
  const [region, setRegion] = useState(defaultLoc);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const UserData = useSelector((state) => state.First);
  const dispatch = useDispatch();

  const fetchLocationData = useCallback(async () => {
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
        console.log('Success', location);
        // setlat(location.latitude);
        dispatch(
          SetLocation({
            lat: location.latitude,
            lon: location.longitude,
          }),
        );
        console.log('fetchLocationData location---->', location);
        console.log('fetchLocationData isMoodUpdate---->', isMoodUpdate);
        if (isMoodUpdate === true) {
          setMarkers([
            ...markers,
            {
              location,
              icon: 'anxious',
            },
          ]);
        }
        // if (UserData.lat == null || UserData.lon == null) {
        // }
      })
      .catch(async (error) => {
        let flag;
        try {
          flag = await AppPermissions.requestLocationPermission(dispatch);
        } catch (e) {
          console.log('Request Location Permission error: ', e);
          flag = false;
        }
        console.log('error', error);
      });
  }, [dispatch]);

  // useEffect(() => {
  //   if (UserData.lat && UserData.lon) {
  //     console.log('LocationData lat ----', UserData?.lat);
  //     console.log('LocationData lon ----', UserData?.lon);
  //   }
  // }, [UserData.lat, UserData.lon]);

  useEffect(() => {
    if (UserData.WeatherPermission === true) {
      fetchLocationData();
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
    //   let Sp = await AsyncStorage.getItem('GiveSleepPerm');
    //   let SleepP = await JSON.parse(Sp);
    //   console.log(`SleepPerm`, SleepP);
    //   dispatch(SleepPerm(SleepP));
  };

  const ScreenDurations = [{ label: 'Day' }, { label: 'Week' }, { label: 'Month' }];

  const AnonymousPopUpcancelled = () => {
    setAnonymousClick(false);
  };

  const getProgress = (e, totalTime = 360) => {
    if (!isNaN(e)) {
      return Math.ceil((Number(e) * 120) / totalTime);
    }
    return 0;
  };

  const getTimeInHoursMin = (e) => {
    if (!isNaN(e)) {
      let i = Number(e);
      let hr = Math.floor(i / 60);
      let min = i % 60;
      return i > 0 ? `${hr > 0 ? `${hr}hr ` : ''}${min > 0 ? `${min}min` : ''}` : '0min';
    }
    return '0min';
  };

  console.log('markers --->', markers);
  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
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
              ((JSON.parse(MoodCount) < 3 ? JSON.parse(MoodCount) : 3) / 3) *
              100
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
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={region}
          initialRegion={defaultLoc}
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
        {!UserData.WeatherPermission && (
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => setopenActionSheet(true)}
            style={styles.actionSheetView}
          />
        )}
      </ScrollView>

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
  scrollView: {
    height: '100%',
    paddingBottom: 400,
  },
  actionSheetView: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0,
  },
  WeatherCardMain: {
    flexDirection: 'row',
    width: 320,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#F1F4F9',
    borderRadius: 18,
    paddingVertical: 20,
  },
  WeatherCard: {
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 8,
  },
  city: {
    paddingVertical: 0,
    color: '#3B456D',
    fontSize: 18,
    fontFamily: RubikRegular,
  },
  map: {
    width: '100%',
    height: horizontalScale(250),
  },
  CardsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  card2View: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },
  SmallCardImage: {
    margin: 5,
    height: 20,
    width: 20,
  },
  smallCardText: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginBottom: 5,
  },

  ColoredView: {
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    marginLeft:-10,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Card1Text: {
    fontFamily: RubikLight,
    fontWeight: '300',
    color: '#8A8BAB',
    fontSize: 16,
    marginTop: 10,
  },
  HeaderView: {
    height: 80,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  syncButtonView: {
    height: 40,
    width: 40,
    backgroundColor: '#DED6FE',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText: {
    fontSize: 13,
    color: '#8A8BAB',
    fontFamily: RubikLight,
    lineHeight: 12,
    marginVertical: 5,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: RubikRegular,
  },
  ColoredText: {
    fontSize: 16,
    color: '#5947D0',
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
  swiperText: {
    fontSize: SIZE / 14,
    fontWeight: '500',
    width: '75%',
    textAlign: 'center',
    fontFamily: RubikMedium,
    color: '#222432',
  },
  indicatorHelper: { height: 18, width: 18, borderRadius: 5 },
  indicatorHelperView: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginTop: 10,
  },
  indicatorText: {
    marginHorizontal: 10,
    color: '#4C5980',
    fontFamily: RubikRegular,
  },
  bottomView: {
    marginBottom: horizontalScale(100),
  },
});

export default LocationData;
