
import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { View, Text, StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import ImportIntro from "../../components/uploads/ImportIntro";
import ImportProgress from "@/components/uploads/ImportPtogress";
import ImportSettings from "@/components/uploads/ImportSettings";
import ImportZip from "@/components/uploads/ImportZip";
import ImportOptions from "@/components/uploads/importOptions";
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const SLIDES = [
    {
        key: '1',
        Illustation: ImportSettings,
        titleWhite: 'Bmring your saved content to MemoryOS',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: `INSTAGRAM`
    },
    {
        key: '2',
        Illustation: ImportIntro,
        titleWhite: 'Search your saved posts',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.'
    },
    {
        key: '3',
        Illustation: ImportOptions,
        titleWhite: 'Search your saved posts',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.'
    },
    {
        key: '4',
        Illustation: ImportZip,
        titleWhite: 'Bring your saved content to MemoryOS',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.'
    },
    {
        key: '5',
        Illustation: ImportProgress,
        titleWhite: 'Bring your saved content to MemoryOS',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.'
    },

]
const ZIP_SLIDES = [
    {
        key: '1',
        Illustation: ImportSettings,
        titleWhite: 'Bring your saved content to MemoryOS',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: `INSTAGRAM`
    }
]
function AnimatedSlideText({ slide }: { slide: (typeof SLIDES)[number] }) {
    const fade = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(16)).current;

    useEffect(() => {
        fade.setValue(0);
        translateY.setValue(16);
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, [slide.key, fade, translateY]);

    return (
        <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
            <Text style={styles.title}>
                {slide.titleWhite}
                {'\n'}
                {slide.description ? (
                    <>
                        <Text style={styles.titleWhite}>{slide.description}</Text>
                        <Text style={styles.titleWhite}>{slide.titleWhite}</Text>
                    </>
                ) : (
                    <Text style={styles.titleWhite}>{slide.titleWhite}</Text>
                )}
            </Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </Animated.View>
    );
}
const Uploads = () => {
    const listRef = useRef<FlatList>(null);
    const [index, setIndex] = useState(0);
    const [importFromLink, setImportFromLink] = useState(false);
    const [importFromZip, setImportFromZip] = useState(false);
    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    };
    const finishOnboarding = async () => {
        await SecureStore.setItemAsync('hasOnboarded', 'true');
        router.replace('/tabs');
    };
    const next = () => {
        if (index < SLIDES.length - 1) {
            listRef.current?.scrollToIndex({ index: index + 1 });
        } else {
            finishOnboarding();
        }
    };

    return (
        <View style={styles.container}>


            <View style={styles.main}>
                <Ionicons name="sparkles" size={100} color="#a78bfa" />
                <Text style={styles.header}> Add memories</Text>
                <Text style={styles.subHeader}>
                    Bring anything into MemoryOS.
                    We'll turn it into a searchable library for you.
                </Text>

                <View style={styles.links}>
                    <Pressable style={styles.button}>
                       <View style={styles.linkIcon}>
                         <Ionicons name="link" size={35} color ="#fff" />
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
                        <Ionicons name="chevron-forward" size={40} color ="#fff" />
                      </View>
                    </Pressable>
                     <Pressable style={styles.button}>
                       <View style={styles.linkIcon}>
                         <Ionicons name="link" size={35} color ="#fff" />
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
                        <Ionicons name="chevron-forward" size={40} color ="#fff" />
                      </View>
                    </Pressable>
                     <Pressable style={styles.button}>
                       <View style={styles.linkIcon}>
                         <Ionicons name="link" size={35} color ="#fff" />
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
                        <Ionicons name="chevron-forward" size={40} color ="#fff" />
                      </View>
                    </Pressable>

                </View>
            </View>
            {/* normal links share flatlist*/}
            {
                importFromLink ?  
                <>
                
                <FlatList
                data={SLIDES}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.key}
                ref={listRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item }) => {
                    const Illustation = item.Illustation;
                    return (
                        <View style={[styles.slide, { width }]}>
                            <View style={styles.IllustationWrap}>
                                <Illustation />
                            </View>
                            <AnimatedSlideText slide={item} />
                        </View>
                    );
                }}

            />
            <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                    <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
            </View>

            <View style={styles.footer}>
                <Pressable onPress={finishOnboarding}>
                    <Text style={styles.skip}>Skip</Text>
                </Pressable>
                <Pressable style={styles.nextButton} onPress={next}>
                    <Text style={styles.nextText}>
                        {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </Pressable>
            </View>
            </>
            :
            null
            }
          
            {/* instagram zip flatlist */}
            {
                importFromZip ?
                    <>
                
                <FlatList
                data={SLIDES}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.key}
                ref={listRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item }) => {
                    const Illustation = item.Illustation;
                    return (
                        <View style={[styles.slide, { width }]}>
                            <View style={styles.IllustationWrap}>
                                <Illustation />
                            </View>
                            <AnimatedSlideText slide={item} />
                        </View>
                    );
                }}

            />
            <View style={styles.dots}>
                {ZIP_SLIDES.map((_, i) => (
                    <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
            </View>

            <View style={styles.footer}>
                <Pressable onPress={finishOnboarding}>
                    <Text style={styles.skip}>Skip</Text>
                </Pressable>
                <Pressable style={styles.nextButton} onPress={next}>
                    <Text style={styles.nextText}>
                        {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </Pressable>
            </View>
            </>
            :
            null
            }

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
        borderColor: '#8f66a9',
    display: 'flex',
       flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,

        
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
         color: '#fff',
         borderWidth: 1,
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
        borderWidth: 1,
       display: 'flex',
       flexDirection: 'column',
       flexWrap: 'wrap',
       paddingLeft: 18,
       width: 250,
       margin: 5,
    },
    linkIcon:{
        color: '#fff',
        backgroundColor: '#8f66a9',
        padding: 18,
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

export default Uploads;