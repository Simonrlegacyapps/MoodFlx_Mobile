import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RubikMedium, RubikRegular } from '../../Constants/fonts/Fonts';

const BoldHeader = ({ label }) => {
    return (
        <View style={{ marginTop: 15 }}>
            <Text style={{ fontFamily: RubikMedium }}>{label}</Text>
        </View>
    );
};

const SimpleText = ({ label, text }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, marginTop: 5, fontFamily: RubikMedium, color: "#7265E3" }}>{label}</Text>
            <Text style={{ marginTop: 5, color: "#9C9EB9" }}>{text}</Text>
        </View>
    );
};

const HowTo = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{
            height: '100%',
            width: '100%',
            paddingBottom: 100
        }}>
            <View
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingLeft: 20,
                }}>
                <Text
                    style={{
                        textAlign: 'center',
                        fontFamily: RubikMedium,
                        marginVertical: 10,
                        fontSize: 16,
                    }}>
                    Earn Flo Coins!
      </Text>

                <BoldHeader label={'Save your mood :'} />
                <SimpleText label={'3+ times per day'} text={'+10 Flo Coins'} />
                <BoldHeader label={'Add a note (mood journaling):'} />
                <SimpleText label={'2 Hours'} text={'+8 Flo Coins'} />
                <SimpleText label={'3 Hours'} text={'+6 Flo Coins'} />
                <SimpleText label={'4 Hours'} text={'+4 Flo Coins'} />
                <SimpleText label={'5 Hours'} text={'+2 Flo Coins'} />
                <SimpleText label={'6 Hours'} text={'+0 Flo Coins'} />
                <BoldHeader label={'Ranking Levels:'} />
                <SimpleText label={'Mood Activator'} text={'0-100 Flo Coins'} />
                <SimpleText label={'Mood Navigator'} text={'100-1000 Flo Coins'} />
                <SimpleText label={'Mood Fit'} text={'1,000-5,000 Flo Coins'} />
                <SimpleText label={'Mood Unleashed'} text={'5,000-10,000 Flo Coins'} />
                <SimpleText label={'Mood Powerhouse'} text={'10,000-20,000 Flo Coins'} />
                <BoldHeader label={'Ranking discounts:'} />
                <SimpleText label={'Mood Activator'} text={' 2% Discount'} />
                <SimpleText label={'Mood Navigator'} text={' 5% Discount'} />
                <SimpleText label={'Mood Fit'} text={'10% Discount'} />
                <SimpleText label={'Mood Unleashed'} text={'20% Discount'} />
                <SimpleText label={'Mood Powerhouse'} text={'25 % Discount'} />
                <BoldHeader label={'Each rank unlocks more rewards'} />
            </View>
            <View style={{ marginBottom: 120 }} />
        </ScrollView>
    );
};

export default HowTo;
