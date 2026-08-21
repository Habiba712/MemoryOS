

import { useEffect, useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function UploadsHome({onLinkPress, onZipPress}:{onLinkPress:()=>void, onZipPress:()=>void}) {
    return(
        <View style={styles.container}>
                         <View style={styles.main}>
                            <Ionicons name="sparkles" size={100} color="#a78bfa" />
                            <Text style={styles.header}> Add memories</Text>
                            <Text style={styles.subHeader}>
                                Bring anything into MemoryOS.
                                We'll turn it into a searchable library for you.
                            </Text>
            
                            <View style={styles.links}>
                                <Pressable style={styles.button} 
                                onPress={()=>onLinkPress()}
                                >
                               
            
                                   <View backgroundColor="#8f66a9" style={styles.linkIconContainer}
                                   
                                   >
                                     <Ionicons name="link" size={35} color="#fff"
                                     style={styles.linkIcon}
                                     /> 
                                   </View>
                                   <View style={styles.textContainer}>
                                     
                                        <Text style={styles.buttonText}>
                                            From a link
                                            </Text>
                                        
                                        <Text style={styles.buttonSubText}>
                                            Paste a link from Insagram, Youtube, Pinterest or the web.
                                        </Text>
                                
                                   </View>
                                  <View style={styles.chevron}>
                                    <Ionicons name="arrow-forward" size={30} color ="#fff" />
                                  </View>
                                </Pressable>
                                 <Pressable style={styles.button}
                                onPress={()=>onZipPress()}
                                 
                                 >
                                   <View backgroundColor="#6db099" style={styles.linkIconContainer}>
                                     <Ionicons style={styles.linkIcon} name="zip-file" size={35} color="#fff" />
                                   </View>
                                   <View style={styles.textContainer}>
                                     
                                        <Text style={styles.buttonText}>
                                            Import your ZIP file
                                            </Text>
                                        
                                        <Text style={styles.buttonSubText}>
                                            Paste a link from Insagram, Youtube, Pinterest or the web.
                                        </Text>
                                
                                   </View>
                                  <View style={styles.chevron}>
                                    <Ionicons name="arrow-forward" size={30} color ="#fff" />
                                  </View>
                                </Pressable>
                                 <Pressable style={styles.button}>
                                   <View backgroundColor="#3494e7" style={styles.linkIconContainer}>
                                     <Ionicons style={styles.linkIcon} name="link" size={35} color="#fff" />
                                   </View>
                                   <View style={styles.textContainer}>
                                     
                                        <Text style={styles.buttonText}>
                                            From your device
                                            </Text>
                                        
                                        <Text style={styles.buttonSubText}>
                                            Paste a link from Insagram, Youtube, Pinterest or the web.
                                        </Text>
                                
                                   </View>
                                  <View style={styles.chevron}>
                                    <Ionicons name="arrow-forward" size={30} color ="#fff" />
                                  </View>
                                </Pressable>
            
                            </View>
                        </View> 
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
    main:{
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    header:{
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        fontFamily: 'sans-serif-medium'
    },
    subHeader:{
        color: '#e9e2e2f7',
        width: 300,
        textAlign: 'center',
        fontWeight: 'semibold',
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'sans-serif-medium'

        
    },
    button:{
        // backgroundColor: '#8f66a9',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 20,
        borderWidth: 1,
    display: 'flex',
       flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        borderColor: '#1f2740',
        backgroundColor: '#141a2b'

        
    }
    ,
    buttonText:{
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'sans-serif-medium',
        display: 'flex',
        flexDirection: 'column',

        // flexWrap: 'wrap',
        // width: '100%',
        // marginBottom: 10,
    },
    chevron:{
    },

    buttonSubText:{
        color: '#ccc9c9ac',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'sans-serif-medium',
         display: 'flex',
         flexWrap: 'wrap',
         width: 250
        // display: 'flex',
        // flexDirection: 'column',
        // marginBottom: 10,
    },
    textContainer:{
       display: 'flex',
       flexDirection: 'column',
       flexWrap: 'wrap',
       paddingLeft: 18,
       width: 250,
       margin: 5,
    },
    linkIcon:{
        color: '#fff',
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-45deg' }],

    },
    linkIconContainer:{
        borderWidth: 1,
        borderColor: '#1f2740',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
    IllustationWrap: { marginBottom: 36, alignItems: 'center', justifyContent: 'center' },

    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 8,
        paddingBottom: 40
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4
    },
    links:{

    },
    titleWhite: {
        color: '#fff'
    },
    description: {
        fontSize: 14.5,
        color: '#8a94a8',
        marginTop: 5,
        marginBottom: 24,
        minHeight: 100,
    },
    subtitle: {
        fontSize: 14.5,
        color: '#8a94a8',
        textAlign: 'center',
        lineHeight: 21,
        paddingHorizontal: 8,
    },
    dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22314d', marginHorizontal: 4 },
    dotActive: { backgroundColor: '#4d9cff', width: 20 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    skip: { color: '#6a7488', fontSize: 14 },
    nextButton: {
        backgroundColor: '#4d9cff',
        paddingHorizontal: 26,
        paddingVertical: 13,
        borderRadius: 14,
    },
    nextText: { color: '#fff', fontWeight: '600', fontSize: 14 },

})