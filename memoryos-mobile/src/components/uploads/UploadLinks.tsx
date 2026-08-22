

import { useEffect, useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';

 
export default function UploadLinks({onBack}:{onBack : ()=>void}) {
    return(
        <View style={styles.container}>
            <View style={styles.header}> 
                <Pressable onPress={onBack}>
                <Ionicons name="arrow-back" color="#fff" size={25} />
            </Pressable>
           
            </View>
            <Text style={{fontSize: 30, fontWeight: '700', color: '#fff', marginLeft: 10}}>
                Import links
                </Text> 
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
        position: 'relative',

    },
    header:{
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        fontFamily: 'sans-serif-medium',
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: 40,
        width: '100%',
        justifyContent: 'space-between',
    },
})