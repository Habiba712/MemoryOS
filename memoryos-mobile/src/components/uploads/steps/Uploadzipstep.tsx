import { View, Text, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// If you don't already have this installed: expo install expo-document-picker
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useRef, useState } from "react";

type PickedFile = { uri: string;
    name: string;
    sizeLabel: string;
    mimeType?: string; };

function formatBytes(bytes?: number) {
    if (!bytes) return "";
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

export default function UploadZipStep({
    onBack,
    zipFile,
    onFilePicked,
    onContinue,
}: {
    onBack: () => void;
    zipFile: PickedFile | null;
    onFilePicked: (file: PickedFile) => void;
    onContinue: () => Promise<void>;
}) {
        const spin = useRef(new Animated.Value(0)).current;
    
  const rotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleChooseFile = async () => {

        const result = await DocumentPicker.getDocumentAsync({
            type: "application/zip",
            copyToCacheDirectory: true,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        onFilePicked({
            name: asset.name,
            sizeLabel: formatBytes(asset.size ?? undefined),
            uri: asset.uri,
            mimeType: asset.mimeType,
        });
    };

    const handleContinue = async () =>{
        if(!zipFile || isLoading) return;

        try{
            setIsLoading(true);
            await onContinue();
            setIsLoading(false);
        }catch(e){
            setIsLoading(false);
        }
    }
    
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

    return (
        <View style={styles.container}>
            <Pressable onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>

            <Text style={styles.header}>Upload your ZIP file</Text>
            <Text style={styles.subHeader}>
                Select the ZIP file you downloaded from Instagram.
            </Text>

            <Pressable style={styles.dropzone} onPress={handleChooseFile}>
                <View style={styles.dropzoneIcon}>
                    <Ionicons name="cloud-upload-outline" size={30} color="#a78bfa" />
                </View>
                <Text style={styles.dropzoneTitle}>Drop your ZIP file here</Text>
                <Text style={styles.dropzoneOr}>or</Text>
                <Pressable style={styles.chooseButton} onPress={handleChooseFile}>
                    <Text style={styles.chooseButtonText}>Choose file</Text>
                </Pressable>
                <Text style={styles.dropzoneHint}>.zip file only  •  Max 10GB</Text>
            </Pressable>

            {zipFile && (
                <View style={styles.fileRow}>
                    <View style={styles.fileIcon}>
                        <Ionicons name="archive" size={18} color="#a78bfa" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.fileName}>{zipFile.name}</Text>
                        {!!zipFile.sizeLabel && (
                            <Text style={styles.fileSize}>{zipFile.sizeLabel}</Text>
                        )}
                    </View>
                    <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                </View>
            )}

            <Pressable
                style={[styles.continueButton, (!zipFile || isLoading) && styles.continueButtonDisabled]}
                disabled={!zipFile}
                onPress={handleContinue}
            >
                <Text style={[styles.continueText, isLoading && styles.loadingText]}>{
                    isLoading ? "Loading..." : "Upload & continue"

}</Text>
                <View style={styles.loadingIcons}>
                     {isLoading ? 
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <Ionicons name="sync" size={18} color="#a78bfa" />
                    </Animated.View>
                                         :
                <Ionicons name="arrow-forward" size={18} color="#fff" />
                }
                </View>
               
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0F16",
        paddingHorizontal: 22,
        paddingTop: 60,
    },
    backButton: { marginBottom: 20 },
    header: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 6 },
    subHeader: { fontSize: 13.5, color: "#8a94a8", marginBottom: 24 },
    dropzone: {
        borderWidth: 1.5,
        borderColor: "#3a2f5c",
        borderStyle: "dashed",
        borderRadius: 20,
        alignItems: "center",
        paddingVertical: 36,
        paddingHorizontal: 20,
        marginBottom: 18,
        backgroundColor: "#12101c",
    },
    dropzoneIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#1e1730",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    dropzoneTitle: { color: "#fff", fontSize: 15, fontWeight: "600", marginBottom: 4 },
    dropzoneOr: { color: "#5c6478", fontSize: 12.5, marginBottom: 14 },
    chooseButton: {
        backgroundColor: "#7c5cf5",
        paddingHorizontal: 22,
        paddingVertical: 11,
        borderRadius: 12,
        marginBottom: 12,
    },
    chooseButtonText: { color: "#fff", fontWeight: "700", fontSize: 13.5 },
    dropzoneHint: { color: "#5c6478", fontSize: 11.5 },
    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 14,
        padding: 12,
        gap: 10,
        marginBottom: 24,
    },
    fileIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#1e1730",
        alignItems: "center",
        justifyContent: "center",
    },
    fileName: { color: "#fff", fontSize: 13.5, fontWeight: "600" },
    fileSize: { color: "#8a94a8", fontSize: 11.5, marginTop: 2 },
    continueButton: {
        backgroundColor: "#7c5cf5",
        borderRadius: 16,
        paddingVertical: 15,
        display: "flex",
        flexDirection: "row",
        borderColor: "#fff",
        justifyContent: "center",
        gap: 8,
    },
    continueButtonDisabled: {
        opacity: 0.4,
          display: "flex",
        flexDirection: "row",
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    continueText: { color: "#fff", fontWeight: "700", fontSize: 15},
    loadingContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B0F16",
    },
    loadingText:{
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        // marginBottom: 20,
    },
    loadingIcons:{
    }
});