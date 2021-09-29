import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {RubikBold, RubikLight, RubikMedium, RubikRegular} from '../../Constants/fonts/Fonts';
import {getFontSize, getLineHeight, horizontalScale, iPhoneXPadding, isIphoneX, metrics} from '../../Constants/sizeChoose';
import DeviceInfo, { isTablet } from 'react-native-device-info';
import ProgressBar from "react-native-animated-progress";
import SelectDivisionModal from '../Modals/SelectDivisionModal/SelectDivisionModal';
import {useDispatch} from 'react-redux';
import { Division, ResetLinkToCompanyParams, UserDivision } from '../../redux/actions/actions';
import AsyncStorage from '@react-native-community/async-storage';
import PostRequestApi from '../../apirequest/PostRequestApi';
import {setDivisionSetFlag} from '../../services/commonService';

const getMarginTop = () => {
  let top = horizontalScale(44)
  if (Platform.OS === 'android' || isTablet()) {
    return top;
  }
  if (isIphoneX) {
    return top;
  }
  top = top + StatusBar.currentHeight;
  return top;
};

function PulseProgressBar() {
  return (
    <View>
      <View style={styles.progressBarcontainer}>
        <View style={styles.progressBar} />
      </View>
    </View>
  )
}

function PulseConnectTop() {
  return (
    <View style={styles.topContainer}>
      <Text style={styles.teamPulseText}>TEAM PULSE</Text>
      <Text style={styles.asACollectiveText}>
        Have your say as a collective
      </Text>
      <View style={styles.progressBarView}>
        <PulseProgressBar
          progress={10}
          height={horizontalScale(7)}
          backgroundColor="#7265E3"
          animated={false}
        />
      </View>
      <View style={styles.answerOnTimeView}>
        <Text style={styles.answerOnTimeText}>
          Answer on time to earn more coins
        </Text>
        <Text style={styles.progressCountText}>0/0</Text>
      </View>
    </View>
  );
}

export function PulseConnect({onConnect}) {
  return (
    <View style={styles.container}>
      <PulseConnectTop />
      <View style={styles.pulseConnectBodyContainer}>
        <Text style={styles.connectDetailsText}>
          Connect with your company to answer Team Pulses anonymously
        </Text>
        <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getDivisionData(divisions, userDivisionName) {
  let d = divisions?.filter?.((e) => e.name === userDivisionName)?.[0] ?? null;
  return d;
}

export function PulseSelectDivision({divisions, userEmail, userDivisionName, setCount}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userDivision, setUserDivision] = useState(getDivisionData(divisions, userDivisionName));
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const companyName = userEmail?.split?.('@')?.pop?.().split?.('.')?.[0]?.toUpperCase?.() ?? 'your company';
  const onSaveDivision = useCallback(() => {
    let division_id = userDivision?.id;
    setUserDivision((e) => {
      division_id = e?.id;
      return e;
    });
    const params = {
      division_id,
      email: userEmail,
    };
    console.log('updateStaffDivision api params', params);
    setIsLoading(true);
    PostRequestApi('updateStaffDivision', params)
      .then(async (resp) => {
        if (resp.status == 200) {
          dispatch(Division(userDivision.id));
          console.log('updateStaffDivision api success res.data========>>>>>>>>', resp?.data);
          if (typeof resp?.data?.divisionName === 'string') {
            try {
              await AsyncStorage.setItem(
                'Division',
                JSON.stringify(resp.data.divisionName),
              );
            } catch (error) {
              console.log('Async Storage setItem Division error: ', error);
            }
            setDivisionSetFlag(true);
            dispatch(UserDivision(resp.data.divisionName));
            dispatch(ResetLinkToCompanyParams(true));
            setCount?.((e) => e + 1);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log('updateStaffDivision api error', err);
      });
  }, [dispatch, userDivision?.id, userEmail]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* <View style={styles.container}> */}
        <PulseConnectTop />
        <View style={styles.selectDivisionBodyContainer}>
          <Text style={styles.whatDivisionText}>What division are you in?</Text>
          <Text style={styles.divisionDescription}>
            {`Your division and region are the only things ${companyName} know about you`}
          </Text>

          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.selectDivisionButton}>
            <Text style={styles.divisionName}>
              {userDivision?.name && typeof userDivision.name === 'string'
                ? userDivision.name
                : 'Select division'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.egText}>
            I.e. Anonymous in Melbourne is Excited
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={onSaveDivision}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ScrollView>
      <SelectDivisionModal
        setModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        Divisions={divisions}
        setDivision={setUserDivision}
      />
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color="#9889F9" size="large" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  //top
  topContainer: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: horizontalScale(20),
  },
  teamPulseText: {
    marginTop: getMarginTop(),
    fontSize: getFontSize(12),
    color: '#7265E3',
    fontFamily: RubikRegular,
  },
  asACollectiveText: {
    marginTop: horizontalScale(9),
    fontSize: getFontSize(32),
    color: '#2D3142',
    fontFamily: RubikMedium,
  },
  progressBarView: {
    marginTop: horizontalScale(25),
    width: '100%',
  },
  progressBarcontainer: {
    width: "100%",
    height: horizontalScale(9),
    overflow: "hidden",
    borderRadius: horizontalScale(5),
    backgroundColor: "#ccd0d9",
  },
  progressBar: {
    flex: 1,
    width: '10%',
    borderRadius: horizontalScale(9) / 2,
    backgroundColor: '#7265E3',
  },
  answerOnTimeView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: horizontalScale(14),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: horizontalScale(28),
  },
  answerOnTimeText: {
    fontSize: getFontSize(14),
    color: '#9C9EB9',
    fontFamily: RubikRegular,
  },
  progressCountText: {
    fontSize: getFontSize(14),
    color: '#9C9EB9',
    fontFamily: RubikRegular,
  },
  //Connect
  pulseConnectBodyContainer: {
    flex: 1,
    paddingHorizontal: '15%',
    alignSelf: 'center',
    alignItems: 'center',
    borderTopLeftRadius: horizontalScale(30),
    borderTopRightRadius: horizontalScale(30),
    backgroundColor: '#FFFFFF',
  },
  connectDetailsText: {
    marginTop: horizontalScale(33),
    fontSize: getFontSize(14),
    lineHeight: getLineHeight(getFontSize(14)),
    color: '#2D3142',
    textAlign: 'center',
    fontFamily: RubikLight,
  },
  connectButton: {
    marginTop: horizontalScale(38),
    paddingVertical: horizontalScale(19),
    paddingHorizontal: horizontalScale(35),
    borderRadius: horizontalScale(16),
    backgroundColor: '#E4DFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    fontSize: getFontSize(16),
    color: '#7265E3',
    fontFamily: RubikRegular,
  },
  // Select Division
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: '#E5E5E5',
  },
  selectDivisionBodyContainer: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: horizontalScale(30),
    borderTopRightRadius: horizontalScale(30),
  },
  whatDivisionText: {
    marginHorizontal: '10%',
    marginTop: horizontalScale(26),
    fontSize: getFontSize(24),
    color: '#2D3142',
    fontFamily: RubikRegular,
  },
  divisionDescription: {
    marginHorizontal: '20%',
    marginTop: horizontalScale(14),
    fontSize: getFontSize(16),
    lineHeight: getFontSize(16) + 6,
    textAlign: 'center',
    color: '#4C5980',
    fontFamily: RubikLight,
  },
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectDivisionButton: {
    marginTop: horizontalScale(30),
    paddingVertical: horizontalScale(19),
    paddingHorizontal: horizontalScale(17),
    width: '70%',
    backgroundColor: 'white',
    borderRadius: horizontalScale(16),
    justifyContent: 'center',
    elevation: 5,
    // flexDirection: 'row',
    shadowColor: 'black',
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
  },
  divisionName: {
    fontSize: getFontSize(16),
    fontFamily: RubikRegular,
    color: '#4C5980',
  },
  egText: {
    marginTop: horizontalScale(20),
    fontSize: getFontSize(14),
    fontFamily: RubikRegular,
    color: '#4C5980',
  },
  doneButton: {
    marginTop: horizontalScale(40),
    paddingVertical: horizontalScale(19),
    width: '66%',
    backgroundColor: '#7265E3',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: horizontalScale(16),
    marginBottom: horizontalScale(120),
  },
  doneButtonText: {
    fontSize: getFontSize(16),
    color: '#FFFFFF',
    fontFamily: RubikRegular,
  },
});
