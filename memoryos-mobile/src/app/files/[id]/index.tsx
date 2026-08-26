import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FileDetailScreen, { MemoryFile } from "@/components/uploads/Filedetailscreen";
import { Share } from "react-native";
import { FaInstagram, FaYoutube } from "react-icons/fa";


// Whatever shape your backend actually returns for a single file.
// Adjust field names to match your real API response.
type ApiFile = {
    id: string;
    fileType: "image" | "pdf" | "reel";
    platform: "Instagram" | "Youtube" | "Facebook" | "Twitter" | "TikTok" | "Other";
    title: string;
    name: string;
    size: number;
    createdAt: string;
    videoUrl?: string;
    url?: string;
    pdfPreview?: string;
    thumbnailUrl?: string;
    aiDescription?: string;
    summary?: string;
    tags?: string[];
    category?: string;
    embedding?: number[];
};

function formatBytes(bytes: number) {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function FilePage() {
    const { id,
        //  type
    } = useLocalSearchParams<{
        id: string,
        // type: string
    }>();
    const router = useRouter();

    const [file, setFile] = useState<MemoryFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    console.log('id', id)

   useEffect(() => {
    if (!id) return;

    (async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. First try to find it as a video
            let response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/video/getOneVideoFile/${id}`,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // 2. If it isn't a video, try the files collection
            if (!response.ok) {
                console.log("Not found as video, trying files...");

                response = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/api/file/getFile/${id}`,
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }

            // Neither endpoint found it
            if (!response.ok) {
                throw new Error(`File not found (${response.status})`);
            }

            const data: ApiFile = await response.json();
            const { embedding, ...dataWithoutEmbedding } = data;

console.log("FINAL DATA:", dataWithoutEmbedding);

            

            setFile({
                fileType: data.fileType || data.platform || "Other",
                title: data.title || data.name || "Untitled",
                size: formatBytes(data.size),
                date: data.createdAt ? formatDate(data.createdAt) : "",
                videoUrl: data.videoUrl || data.url,
                thumbnailUrl: data.thumbnailUrl,
                summary: data.summary,
                aiDescription: data.aiDescription,
                tags: data.tags,
                category: data.category,
                
            });

        } catch (e: any) {
            console.log("File loading error:", e);
            setError(e.message ?? "Failed to load file");
        } finally {
            setLoading(false);
        }
    })();
}, [id]);

    useEffect(() => {
        (async () => {
            const raw = await SecureStore.getItemAsync('sessionData');
            // console.log('raw', raw)
            if (raw) setUserId(JSON.parse(raw).userId);
        })();
    }, []);
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#7c5cf5" />
            </View>
        );
    }

    if (error || !file) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error ?? "File not found"}</Text>
            </View>
        );
    }

    return (
        <FileDetailScreen
            file={file}
            onBack={() => router.back()}
            onShare={async () => {
                try {
                    await Share.share({
                        title: file.title,
                        message: `${file.title}\n${file.videoUrl}`,
                        url: file.videoUrl,
                    })
                } catch (e) {
                    console.log('e', e)
                }
            }}
            onDownload={() => {
                // Hook up expo-file-system download here.
            }}
            onRename={() => {
                // Open a rename modal/prompt, then PATCH /api/files/[id].
            }}
            onDelete={async () => {
                await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/files/${id}`, {
                    method: "DELETE",
                });
                router.back();
            }}
        />
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        backgroundColor: "#0B0F16",
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: { color: "#f87171", fontSize: 13 },
});