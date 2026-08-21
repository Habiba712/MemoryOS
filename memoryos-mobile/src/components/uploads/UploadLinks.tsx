

import { useEffect, useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';

type Props = {
    onBack: () => void;
};
export default function UploadLinks({ onBack }: Props) {
    return(
        <View style={styles.container}>
            <Text style={styles.header}> Import links</Text>
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
    header:{
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        fontFamily: 'sans-serif-medium'
    },
})