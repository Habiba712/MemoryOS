import { View, Text, Pressable, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// One screen, three visual "modes" depending on file.fileType.
// This mirrors the same reuse idea as ProcessingStep/ResultsStep:
// one component, driven by a `type` field, instead of three near-duplicate screens.

type FileType = "image" | "pdf" | "reel" | "video" | "Instagram";

export type MemoryFile = {
    fileType: FileType;
    title: string;
    size: string; // e.g. "2.4 MB"
    date: string; // e.g. "May 13, 2024"
    videoUrl?: string; // image/reel thumbnail source — not needed for pdf
    // pdf-only preview fields, since we can't render a real PDF inline here
    pdfPreview?: {
        title: string;
        subtitle?: string;
        sections: { heading: string; lines: number }[];
    };
    thumbnailUrl?: string;
    uri?: string;

    aiDescription?: string;
    summary?: string;
    tags?: string[];
    category?: string;

};

export default function FileDetailScreen({
    file,
    onBack,
    onShare,
    onDownload,
    onRename,
    onDelete,
}: {
    file: MemoryFile;
    onBack: () => void;
    onShare: () => void;
    onDownload: () => void;
    onRename: () => void;
    onDelete: () => void;
}) {

    console.log('file',file);
    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Pressable onPress={onBack} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </Pressable>
                <Text style={styles.topTitle} numberOfLines={1}>
                    {file.title || 'title'}
                </Text>
                <Pressable style={styles.iconButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.previewCard}>
                    {file.fileType === "image" && (
                        <Image
                            source={{uri: file.thumbnailUrl}}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                    )}

                    {file.fileType === "reel" && (
                        <View style={styles.reelPreview}>
                            <Image
                                source={{ uri: file.uri }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                            <View style={styles.playOverlay}>
                                <Ionicons name="play" size={26} color="#fff" />
                            </View>
                        </View>
                    )}
                     {file.fileType === "Instagram" && (
                        <View style={styles.reelPreview}>
                            <Image
                                source={{ uri: file.thumbnailUrl }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                            <View style={styles.playOverlay}>
                                <Ionicons name="play" size={26} color="#fff" />
                            </View>
                        </View>
                    )}

                    {file.fileType === "pdf" && (
                        <View style={styles.pdfPreview}>
                            <Text style={styles.pdfTitle}>
                                {file.pdfPreview?.title ?? "Document"}
                            </Text>
                            {!!file.pdfPreview?.subtitle && (
                                <Text style={styles.pdfSubtitle}>{file.pdfPreview.subtitle}</Text>
                            )}
                            {(file.pdfPreview?.sections ?? []).map((section, i) => (
                                <View key={i} style={styles.pdfSection}>
                                    <Text style={styles.pdfHeading}>{section.heading}</Text>
                                    {Array.from({ length: section.lines }).map((_, li) => (
                                        <View
                                            key={li}
                                            style={[
                                                styles.pdfLine,
                                                { width: `${70 + ((li * 13) % 25)}%` },
                                            ]}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.fileBadge}>
                        {file.fileType === "pdf" ? (
                            <View style={[styles.badgeIcon, { backgroundColor: "#e2483d" }]}>
                                <Text style={styles.badgeIconText}>PDF</Text>
                            </View>
                        ) : (
                            <View style={[styles.badgeIcon, { backgroundColor: "#3494e7" }]}>
                                <Ionicons
                                    name={file.fileType === "reel" ? "film" : "image"}
                                    size={16}
                                    color="#fff"
                                />
                            </View>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {file.title}
                        </Text>
                        <Text style={styles.fileMeta}>
                            {file.sizeLabel || '0.0'} • {file.date}
                        </Text>
                    </View>
                    <Pressable style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={18} color="#8a94a8" />
                    </Pressable>
                </View>

                <View style={styles.actionsRow}>
                    <ActionButton icon="share-outline" label="Share" onPress={onShare} />
                    <ActionButton icon="download-outline" label="Download" onPress={onDownload} />
                    <ActionButton icon="pencil-outline" label="Rename" onPress={onRename} />
                    <ActionButton
                        icon="trash-outline"
                        label="Delete"
                        onPress={onDelete}
                        danger
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function ActionButton({
    icon,
    label,
    onPress,
    danger,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    danger?: boolean;
}) {
    return (
        <Pressable style={styles.actionButton} onPress={onPress}>
            <Ionicons name={icon} size={20} color={danger ? "#f87171" : "#fff"} />
            <Text style={[styles.actionLabel, danger && { color: "#f87171" }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0F16" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 14,
    },
    iconButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    topTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 8,
    },
    scrollContent: { paddingHorizontal: 18, paddingBottom: 40 },
    previewCard: {
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        marginBottom: 18,
        minHeight: 340,
    },
    imagePreview: { width: "100%", height: 340 },
    reelPreview: { width: "100%", height: 340, justifyContent: "center", alignItems: "center" },
    playOverlay: {
        position: "absolute",
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
    },
    pdfPreview: {
        backgroundColor: "#f4f2ef",
        padding: 20,
        minHeight: 340,
    },
    pdfTitle: { fontSize: 16, fontWeight: "800", color: "#1a1a1a", marginBottom: 2 },
    pdfSubtitle: { fontSize: 11.5, color: "#6b6b6b", marginBottom: 16 },
    pdfSection: { marginBottom: 14 },
    pdfHeading: { fontSize: 12.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
    pdfLine: { height: 6, borderRadius: 3, backgroundColor: "#d8d4cd", marginBottom: 6 },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 16,
        padding: 12,
        gap: 12,
        marginBottom: 18,
    },
    fileBadge: {},
    badgeIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeIconText: { color: "#fff", fontSize: 10, fontWeight: "800" },
    fileName: { color: "#fff", fontSize: 14, fontWeight: "700" },
    fileMeta: { color: "#8a94a8", fontSize: 11.5, marginTop: 2 },
    actionsRow: {
        flexDirection: "row",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 16,
        paddingVertical: 14,
    },
    actionButton: { flex: 1, alignItems: "center", gap: 6 },
    actionLabel: { color: "#fff", fontSize: 11.5, fontWeight: "600" },
});