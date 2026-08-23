import { View, Text, Pressable, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ImportState } from "../ZipImportFlow";

// Shared by ZIP flow and link flow — same reasoning as ProcessingStep.
export default function ResultsStep({
    importState,
    onRetryFailed,
    onDone,
    onBack,
}: {
    importState: ImportState;
    onRetryFailed: () => void;
    onDone: () => void;
    onBack: () => void;
}) {
    const { totalPosts, successCount, failedCount, failedThumbnails } = importState;
    const hasFailed = failedCount > 0;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
             <Pressable onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </Pressable>
            <Text style={styles.header}>Import completed!</Text>
            <Text style={styles.subHeader}>We added most of your memories to MemoryOS.</Text>

            <View style={styles.summaryRow}>
                <View style={styles.summaryBox}>
                    <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                    <Text style={styles.summaryLabel}>Memories created</Text>
                    <Text style={styles.summaryValue}>{successCount.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryBox}>
                    <Ionicons name="close-circle" size={16} color="#f87171" />
                    <Text style={styles.summaryLabel}>Failed</Text>
                    <Text style={styles.summaryValue}>{failedCount.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryBox}>
                    <Ionicons name="albums" size={16} color="#a78bfa" />
                    <Text style={styles.summaryLabel}>Total processed</Text>
                    <Text style={styles.summaryValue}>{totalPosts.toLocaleString()}</Text>
                </View>
            </View>

            {hasFailed && (
                <View style={styles.failedCard}>
                    <Text style={styles.failedTitle}>Failed posts ({failedCount})</Text>
                    <Text style={styles.failedDesc}>
                        These posts couldn't be processed. You can try again.
                    </Text>
                    <View style={styles.thumbRow}>
                        {failedThumbnails.slice(0, 5).map((uri, i) => (
                            <Image key={i} source={{ uri }} style={styles.thumb} />
                        ))}
                        {failedCount > 5 && (
                            <View style={[styles.thumb, styles.thumbMore]}>
                                <Text style={styles.thumbMoreText}>+{failedCount - 5}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {hasFailed && (
                <Pressable style={styles.retryButton} onPress={onRetryFailed}>
                    <Ionicons name="refresh" size={16} color="#fff" />
                    <Text style={styles.retryText}>Try failed again</Text>
                </Pressable>
            )}

            <Pressable style={styles.viewButton} onPress={onDone}>
                <Text style={styles.viewText}>View my memories</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>

            <Pressable style={styles.backLink} onPress={onDone}>
                <Text style={styles.backLinkText}>Back to dashboard</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0F16" },
    content: { paddingHorizontal: 22, paddingTop: 70, paddingBottom: 40 },
    header: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 6, textAlign: "center" },
    subHeader: { fontSize: 12.5, color: "#8a94a8", marginBottom: 22, textAlign: "center" },
    summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    summaryBox: {
        flex: 1,
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 14,
        padding: 10,
        alignItems: "center",
        gap: 4,
    },
    summaryLabel: { color: "#8a94a8", fontSize: 10, textAlign: "center" },
    summaryValue: { color: "#fff", fontSize: 16, fontWeight: "700" },
    failedCard: {
        backgroundColor: "#1c1520",
        borderWidth: 1,
        borderColor: "#3a2130",
        borderRadius: 16,
        padding: 14,
        marginBottom: 18,
    },
    failedTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 4 },
    failedDesc: { color: "#8a94a8", fontSize: 11.5, marginBottom: 12 },
    thumbRow: { flexDirection: "row", gap: 8 },
    thumb: { width: 46, height: 46, borderRadius: 10, backgroundColor: "#2a2130" },
    thumbMore: { alignItems: "center", justifyContent: "center", backgroundColor: "#241a3d" },
    thumbMoreText: { color: "#a78bfa", fontSize: 11, fontWeight: "700" },
    retryButton: {
        backgroundColor: "#7c5cf5",
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 10,
    },
    retryText: { color: "#fff", fontWeight: "700", fontSize: 14.5 },
    viewButton: {
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 14,
    },
    viewText: { color: "#fff", fontWeight: "700", fontSize: 14.5 },
    backLink: { alignItems: "center" },
    backLinkText: { color: "#8f7ee0", fontSize: 12.5, fontWeight: "600" },
    backButton: { marginBottom: 20 },

});