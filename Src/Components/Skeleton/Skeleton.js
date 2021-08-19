import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const { width: SIZE, height: HEIGHT } = Dimensions.get('window');

const Skeleton = () => {
    return (
        <View
     style={{
       backgroundColor: '#F4F6FA',
        // width: '90%',
       alignSelf: 'center',
       minHeight: 200,
       marginTop: 50,
       padding: 20,
       borderRadius: 20,
     }}>
     <SkeletonPlaceholder>
       <View
         style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom:5}}>
         <SkeletonPlaceholder.Item
           alignSelf={'center'}
           width={SIZE / 3.2}
           height={35}
           marginTop={0}
           borderRadius={10}
         />
         <SkeletonPlaceholder.Item
           alignSelf={'center'}
           width={SIZE / 3.2}
           height={35}
           marginTop={0}
           borderRadius={10}
         />
       </View>
       <View
         style={{flexDirection: 'column', justifyContent: 'space-around'}}>
       <SkeletonPlaceholder.Item
         alignSelf={'center'}
         width={SIZE / 1.5}
         height={20}
         marginTop={10}
         borderRadius={5}></SkeletonPlaceholder.Item>
       <SkeletonPlaceholder.Item
         alignSelf={'center'}
         width={SIZE / 1.5}
         height={20}
         marginTop={5}
         borderRadius={5}></SkeletonPlaceholder.Item>
       <SkeletonPlaceholder.Item
         alignSelf={'center'}
         width={SIZE / 1.5}
         height={20}
         marginTop={5}
         borderRadius={5}></SkeletonPlaceholder.Item>
       <SkeletonPlaceholder.Item
         alignSelf={'center'}
         width={SIZE / 1.5}
         height={20}
         marginTop={5}
         borderRadius={5}></SkeletonPlaceholder.Item>
         </View>
         
       <View
         style={{flexDirection: 'row', justifyContent: 'space-around'}}>
         <SkeletonPlaceholder.Item
           alignSelf={'center'}
           width={SIZE / 1.5}
           height={80}
           marginTop={20}
           borderRadius={10}
         />
         
       </View>
     </SkeletonPlaceholder>
   </View>
    )
}

export default Skeleton
