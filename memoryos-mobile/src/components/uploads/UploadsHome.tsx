import { useEffect, useRef, useState } from "react";
import { Pressable, View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function UploadsHome({onLinkPress, onZipPress}:{onLinkPress:()=>void, onZipPress:()=>void}) {
    return(
        <View style={styles.container}>
                         <View style={styles.main}>
                            <Ionicons name="sparkles" size={60} color="#a78bfa" />
                            <Text style={styles.header}>Add memories</Text>
                            <Text style={styles.subHeader}>
                                Bring anything into MemoryOS.
                                We'll turn it into a memory you can search forever.
                            </Text>
            
                            <View style={styles.links}>
                                <Pressable style={styles.button} 
                                onPress={()=>onLinkPress()}
                                >
                                   <View style={[styles.linkIconContainer, {backgroundColor:"#8f66a9"}]}>
                                     <Ionicons name="link" size={22} color="#fff"
                                     style={styles.linkIcon}
                                     /> 
                                   </View>
                                   <View style={styles.textContainer}>
                                        <Text style={styles.buttonText}>
                                            From a link
                                            </Text>
                                        <Text style={styles.buttonSubText}>
                                            Paste a link from Instagram, YouTube, Pinterest or the web.
                                        </Text>
                                   </View>
                                  <View style={styles.chevron}>
                                    <Ionicons name="chevron-forward" size={20} color="#5a6480" />
                                  </View>
                                </Pressable>
                                 <Pressable style={styles.button}
                                onPress={()=>onZipPress()}
                                 >
                                   <View style={[styles.linkIconContainer, {backgroundColor:"#6db099"}]}>
                                     <Ionicons style={styles.linkIcon} name="archive" size={22} color="#fff" />
                                   </View>
                                   <View style={styles.textContainer}>
                                        <Text style={styles.buttonText}>
                                            Import your history
                                            </Text>
                                        <Text style={styles.buttonSubText}>
                                            Upload your Instagram data ZIP and bring hundreds of memories at once.
                                        </Text>
                                   </View>
                                  <View style={styles.chevron}>
                                    <Ionicons name="chevron-forward" size={20} color="#5a6480" />
                                  </View>
                                </Pressable>
                                 <Pressable style={styles.button}>
                                   <View style={[styles.linkIconContainer, {backgroundColor:"#3494e7"}]}>
                                     <Ionicons style={styles.linkIcon} name="phone-portrait" size={22} color="#fff" />
                                   </View>
                                   <View style={styles.textContainer}>
                                        <Text style={styles.buttonText}>
                                            From your device
                                            </Text>
                                        <Text style={styles.buttonSubText}>
                                            Upload photos, documents or screenshots.
                                        </Text>
                                   </View>
                                  <View style={styles.chevron}>
                                    <Ionicons name="chevron-forward" size={20} color="#5a6480" />
                                  </View>
                                </Pressable>

                                <View style={styles.privacyBox}>
                                  <Ionicons name="shield-checkmark" size={20} color="#a78bfa" />
                                  <Text style={styles.privacyText}>
                                    Your data is private and secure.{"\n"}We only use your data to create your memories.
                                  </Text>
                                </View>
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
        alignItems: 'center',
        // width: Dimensions.get('window').width,
        // paddingHorizontal: 10,
        // borderWidth: 1,
        // borderColor: '#1f2740',
    },
    header:{
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        marginTop: 12,
        marginBottom: 6,
        fontFamily: 'sans-serif-medium'
    },
    subHeader:{
        color: '#a3a9bb',
        width: 260,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 14.5,
        lineHeight: 20,
        marginBottom: 24,
        fontFamily: 'sans-serif-medium'
    },
    button:{
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderColor: '#1f2740',
        backgroundColor: '#141a2b'
    },
    buttonText:{
        color: '#fff',
        fontSize: 15.5,
        fontWeight: '700',
        fontFamily: 'sans-serif-medium',
    },
    chevron:{
        marginLeft: 6,
    },
    buttonSubText:{
        color: '#8a94a8',
        fontSize: 12.5,
        fontWeight: '500',
        fontFamily: 'sans-serif-medium',
        flexWrap: 'wrap',
        width: 210,
        marginTop: 2,
    },
    textContainer:{
       flexDirection: 'column',
       flexWrap: 'wrap',
       paddingLeft: 12,
       width: 210,
    },
    linkIcon:{
        color: '#fff',
    },
    linkIconContainer:{
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    privacyBox:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2140',
        backgroundColor: '#171225',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 4,
        gap: 10,
    },
    privacyText:{
        color: '#c9b8f5',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
        flexWrap: 'wrap',
    },
    links:{},
})