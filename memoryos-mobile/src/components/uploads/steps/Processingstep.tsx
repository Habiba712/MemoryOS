import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

// Shared by ZIP flow and link flow — this component doesn't know or care
// which one it came from, it just needs a total count and something to
// call when done. That's what makes it reusable.

type ProcessingResult = {
    processedCount: number;
    successCount: number;
    failedCount: number;
    failedThumbnails: string[];
};

export default function ProcessingStep({
    total,
    onDone,
}: {
    total: number;
    onDone: (result: ProcessingResult) => void;
}) {
    const [processed, setProcessed] = useState(0);
    const [success, setSuccess] = useState(0);
    const [failed, setFailed] = useState(0);
    const spin = useRef(new Animated.Value(0)).current;

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

    // Placeholder progress loop — swap this for your real upload/processing
    // subscription (e.g. websocket or polling job status).
    useEffect(() => {
        if (total <= 0) return;
        const interval = setInterval(() => {
            setProcessed((prev) => {
                const next = Math.min(prev + Math.ceil(total / 40), total);

                const willFail = Math.random() < 0.07;
                if (willFail) setFailed((f) => f + 1);
                else setSuccess((s) => s + 1);

                if (next >= total) {
                    clearInterval(interval);
                    setTimeout(() => {
                        onDone({
                            processedCount: next,
                            successCount: success,
                            failedCount: failed,
                            failedThumbnails: [], // fill with real failed post thumbnails
                        });
                    }, 400);
                }
                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, [total]);

    const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
    const remaining = Math.max(total - processed, 0);

    const rotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
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
                        {processed} / {total}
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
                        Post {Math.min(processed + 1, total)} of {total}: Analyzing image and caption...
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
    noteText: { color: "#c9b8f5", fontSize: 11.5, flex: 1, flexWrap: "wrap" },
});