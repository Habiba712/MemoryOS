
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

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        key: '1',
        Illustation: ImportSettings,
        titleWhite: 'Bring your saved content to MemoryOS',
        subtitle: 'Instagram doesn\'t let you search your saved posts by meaning. MemoryOS canExport your Instagram saved posts and we\'ll turn them into a searchable library.',
        description: `INSTAGRAM
   │
   │  User requests their Instagram data
   ▼
Instagram / Meta export
   │
   │  ZIP / downloaded data
   ▼
MEMORYOS IMPORT
   │
   ├── inspect files
   ├── identify saved-post data
   ├── extract URLs / metadata
   ├── identify media
   └── let user choose WHAT to import
   ▼
IMPORT QUEUE
   │
   ├── Post 1
   ├── Post 2
   ├── Post 3
   └── ...
   ▼
MEMORYOS PROCESSING
   │
   ├── fetch/process content
   ├── generate title
   ├── generate summary
   ├── generate tags
   ├── generate category
   └── generate embedding
   ▼
MONGODB
   │
   ▼
SEARCHABLE MEMORYOS LIBRARY`
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
export default function Uploads() {
    const listRef = useRef<FlatList>(null);
    const [index, setIndex] = useState(0);
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

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0F16',
        paddingBottom: 100
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