import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import ProfileCoinModal from '../../Components/PopUp/profileCoinModal';
import Constants from '../../Constants';
import { RubikLight } from '../../Constants/fonts/Fonts';

const Rewards = () => {
    const [openActionSheet, setopenActionSheet] = useState(false)
    const data = ['a', 'b', 'c', 'd', 'e'];

    const VerifyDone = () => {
        setopenActionSheet(false)
    }

    const renderItem = () => {
        return (
            <TouchableOpacity onPress={() => setopenActionSheet(true)} activeOpacity={0.7} style={styles.card}>
                <Image
                    source={require('../../../assets/newImage/tempImage/image1.png')}
                    style={[styles.image, { opacity: 0.6 }]}
                />
                <View style={{ marginVertical: 15, flex: 1 }}>
                    <Text numberOfLines={2} style={{ width: '80%', fontFamily: RubikLight, color: '#4C5980', flex: 1 }}>30% off your first year membership at BFT</Text>
                    <Text numberOfLines={2} style={{ width: '80%', fontFamily: RubikLight, color: true ? "#D7D7D7" : '#7265E3', fontSize: 13 }}>10 points</Text>
                </View>
                <Image source={require('../../../assets/newImage/arrow/arrow.png')}
                    style={[styles.imageArrow, { tintColor: '#D7D7D7' }]} />
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={{
                backgroundColor: 'white',
                padding: 14,
                height: '100%',
                width: '100%',
            }}>
            <FlatList data={data} renderItem={renderItem} showsVerticalScrollIndicator={false} />
            <View style={{ padding: 40 }} />
            <ProfileCoinModal
                permission={"Hang in there you'll be able to cash in your Flo soon!"}
                // image={Constants.Images.FitnessPopUp}
                dataType={'fitness'}
                modalVisible={openActionSheet}
                dismissModalHandler={() => setopenActionSheet(false)}
                verifyDone={() => VerifyDone()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 80,
        width: 80,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginHorizontal: 20,
    },
    imageArrow: {
        height: 17,
        width: 17,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginHorizontal: 20,
    },
    card: {
        height: 100,
        width: '100%',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        marginHorizontal: 2,
        elevation: 2,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
    },
});

export default Rewards;
