import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { ImportState } from "../UploadZip";

// Shared by ZIP flow and link flow — this component doesn't know or care
// which one it came from, it just needs a totalData count and something to
// call when done. That's what makes it reusable.

type ProcessingResult = {
    processedCount: number;
    successCount: number;
    failedCount: number;
    failedThumbnails: string[];
};

export default function ProcessingStep({
    onBack,
    totalData,
    onDone,
    user,
}: {
    totalData: ImportState;
    onDone: (result: ProcessingResult) => void;
    onBack: () => void;
    user: string;
}) {
    const [processed, setProcessed] = useState(0);
    const [success, setSuccess] = useState(0);
    const [failed, setFailed] = useState(0);
    const spin = useRef(new Animated.Value(0)).current;
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);

    useEffect(() => {
        Animated.loop(
            Animated.timing(spin, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

const processPosts = async () => {
    const selectedPosts = totalData.posts.slice(
        0,
        totalData.chosenAmount
    );

    const successfulPosts = [];
    const failedPosts = [];

    setProcessed(0);
    setSuccess(0);
    setFailed(0);

    for (const post of selectedPosts) {
        try {
            console.log("Processing:", post.url);

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/video/saveVideo`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user,
                        videoUrl: post.url,
                        caption: post.caption,
                    }),
                }
            );

            if (response.ok) {
                successfulPosts.push(post);

                setSuccess(successfulPosts.length);

                console.log(
                    `✅ Successful: ${successfulPosts.length}`
                );
            } else {
                setFailed(failedPosts.length);const errorText = await response.text();

                failedPosts.push({
                    post,
                    error: errorText || response.statusText,
                });

                

                console.log(
                    `⏭️ Failed, skipping: ${post.url}`
                );
            }

        } catch (error: any) {
            failedPosts.push({
                post,
                error: error.message,
            });

            setFailed(failedPosts.length);

            console.log(
                `⏭️ Problematic post, skipping: ${post.url}`
            );
        }

         setProcessed(
            successfulPosts.length + failedPosts.length
        );
    }

    onDone({
        processedCount:
            successfulPosts.length + failedPosts.length,
        successCount: successfulPosts.length,
        failedCount: failedPosts.length,
 
        failedThumbnails: [],
    });
};
useEffect(() => {
    if (totalData.chosenAmount <= 0) return;

    processPosts();
}, []);
    const pct = totalData.chosenAmount > 0 ? Math.round((processed / totalData.chosenAmount) * 100) : 0;
    const remaining = Math.max(totalData.chosenAmount - processed, 0);

    const rotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                  <Pressable onPress={onBack} >
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>
            </View>
           
            <Text style={styles.header}>Importing your memories...</Text>
            <Text style={styles.subHeader}>
                AI is working hard! You can see real-time progress and details.
            </Text>

            <View style={styles.ringWrap}>
                <Svg width={160} height={160}>
                    <Circle cx={80} cy={80} r={68} stroke="#1f2740" strokeWidth={10} fill="none" />
                    <Circle
                        cx={80}
                        cy={80}
                        r={68}
                        stroke="#7c5cf5"
                        strokeWidth={10}
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 68}`}
                        strokeDashoffset={2 * Math.PI * 68 * (1 - pct / 100)}
                        strokeLinecap="round"
                    />
                </Svg>
                <View style={styles.ringCenter}>
                    <Text style={styles.ringPct}>{pct}%</Text>
                    <Text style={styles.ringCount}>
                        {processed} / {totalData.chosenAmount}
                    </Text>
                    <Text style={styles.ringLabel}>posts processed</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                    <Text style={styles.statLabel}>Successful</Text>
                    <Text style={styles.statValue}>{success}</Text>
                </View>
                <View style={styles.statBox}>
                    <Ionicons name="close-circle" size={16} color="#f87171" />
                    <Text style={styles.statLabel}>Failed</Text>
                    <Text style={styles.statValue}>{failed}</Text>
                </View>
                <View style={styles.statBox}>
                    <Ionicons name="ellipse-outline" size={16} color="#8a94a8" />
                    <Text style={styles.statLabel}>Remaining</Text>
                    <Text style={styles.statValue}>{remaining}</Text>
                </View>
            </View>

            <View style={styles.currentCard}>
                <Text style={styles.currentLabel}>Currently processing</Text>
                <View style={styles.currentRow}>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <Ionicons name="sync" size={18} color="#a78bfa" />
                    </Animated.View>
                    <Text style={styles.currentText}>
                       Post {Math.min(processed + 1, totalData.chosenAmount)} of {totalData.chosenAmount}
                    </Text>
                </View>
            </View>

            <View style={styles.noteBox}>
                <Ionicons name="information-circle" size={16} color="#a78bfa" />
                <Text style={styles.noteText}>
                    You can close the app. We'll notify you when it's complete.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0F16", paddingHorizontal: 22, paddingTop: 70, alignItems: "center" },
    header: { fontSize: 19, fontWeight: "700", color: "#fff", marginBottom: 6, textAlign: "center" },
    subHeader: { fontSize: 12.5, color: "#8a94a8", marginBottom: 24, textAlign: "center", paddingHorizontal: 10 },
    ringWrap: { alignItems: "center", justifyContent: "center", marginBottom: 26 },
    ringCenter: { position: "absolute", alignItems: "center" },
    ringPct: { color: "#fff", fontSize: 26, fontWeight: "800" },
    ringCount: { color: "#8a94a8", fontSize: 11.5, marginTop: 2 },
    ringLabel: { color: "#5c6478", fontSize: 10.5 },
    statsRow: { flexDirection: "row", gap: 10, marginBottom: 20, width: "100%" },
    statBox: {
        flex: 1,
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 14,
        padding: 10,
        alignItems: "center",
        gap: 4,
    },
    statLabel: { color: "#8a94a8", fontSize: 10.5 },
    statValue: { color: "#fff", fontSize: 15, fontWeight: "700" },
    currentCard: {
        width: "100%",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
    },
    currentLabel: { color: "#8a94a8", fontSize: 11, marginBottom: 6 },
    currentRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    currentText: { color: "#fff", fontSize: 12, flex: 1 },
    noteBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#171225",
        borderWidth: 1,
        borderColor: "#2a2140",
        borderRadius: 14,
        padding: 12,
        gap: 8,
        width: "100%",
    },
    backButtonContainer:{width:"100%", justifyContent:"flex-start"},
    noteText: { color: "#c9b8f5", fontSize: 11.5, flex: 1, flexWrap: "wrap" },
});