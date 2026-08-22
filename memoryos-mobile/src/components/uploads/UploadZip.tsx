

import { useEffect, useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function UploadLinks({onBack}:{onBack : ()=>void}) {
    return(
        <View style={styles.container}>
            <Pressable onPress={()=>{onBack}}>
                <Ionicons name="arrow-back"/>
            </Pressable>
            <Text>Import Zip</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B0F16',
        paddingBottom: 100,
        paddingTop: 100,
        paddingHorizontal: 30,

    },
})