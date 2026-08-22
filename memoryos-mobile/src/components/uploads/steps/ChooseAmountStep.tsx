import { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = "all" | "2years" | "1year" | "custom";

export default function ChooseAmountStep({
    onBack,
    totalPosts,
    onContinue,
}: {
    onBack: () => void;
    totalPosts: number;
    onContinue: (amount: number) => void;
}) {
    const [selected, setSelected] = useState<Option>("all");
    const [customAmount, setCustomAmount] = useState("500");
    console.log('totalPosts', totalPosts)

    // These would normally come from actually scanning post dates in the zip.
    // Hardcoded here just so the screen is functional standalone.
    const counts: Record<Exclude<Option, "custom">, number> = {
        all: totalPosts,
        "2years": Math.round(totalPosts * 0.46),
        "1year": Math.round(totalPosts * 0.17),
    };

    const resolveAmount = () => {
        if (selected === "custom") return parseInt(customAmount || "0", 10);
        return counts[selected];
    };

    const OptionRow = ({
        id,
        label,
        countLabel,
    }: {
        id: Option;
        label: string;
        countLabel: string;
    }) => (
        <Pressable style={styles.optionRow} onPress={() => setSelected(id)}>
            <View style={[styles.radio, selected === id && styles.radioActive]}>
                {selected === id && <View style={styles.radioDot} />}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.optionLabel}>{label}</Text>
                <Text style={styles.optionCount}>{countLabel}</Text>
            </View>
            {id === "custom" && selected === "custom" && (
                <TextInput
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    keyboardType="number-pad"
                    style={styles.customInput}
                />
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Pressable onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>

            <Text style={styles.header}>Choose how much to import</Text>
            <Text style={styles.subHeader}>We found your posts in the ZIP file.</Text>

            <View style={styles.foundCard}>
                <View>
                    <Text style={styles.foundLabel}>We found</Text>
                    <Text style={styles.foundNumber}>{totalPosts.toLocaleString()}</Text>
                    <Text style={styles.foundLabel}>posts in your Instagram data</Text>
                </View>
                <View style={styles.foundIcon}>
                    <Ionicons name="grid" size={20} color="#a78bfa" />
                </View>
            </View>

            <Text style={styles.question}>How many posts do you want to add to your memories?</Text>

            <View style={styles.options}>
                <OptionRow id="all" label="All posts" countLabel={`${counts.all.toLocaleString()} posts`} />
                <OptionRow id="2years" label="Last 2 years" countLabel={`${counts["2years"].toLocaleString()} posts`} />
                <OptionRow id="1year" label="Last 1 year" countLabel={`${counts["1year"].toLocaleString()} posts`} />
                <OptionRow id="custom" label="Custom amount" countLabel="Choose a specific number" />
            </View>

            <Pressable style={styles.continueButton} onPress={() => onContinue(resolveAmount())}>
                <Text style={styles.continueText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0F16", paddingHorizontal: 22, paddingTop: 60 },
    backButton: { marginBottom: 20 },
    header: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 6 },
    subHeader: { fontSize: 13.5, color: "#8a94a8", marginBottom: 20 },
    foundCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 18,
        padding: 16,
        marginBottom: 22,
    },
    foundLabel: { color: "#8a94a8", fontSize: 12.5 },
    foundNumber: { color: "#fff", fontSize: 30, fontWeight: "800", marginVertical: 2 },
    foundIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#1e1730",
        alignItems: "center",
        justifyContent: "center",
    },
    question: { color: "#fff", fontSize: 14, fontWeight: "600", marginBottom: 14 },
    options: { gap: 10, marginBottom: 26 },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#141a2b",
        borderWidth: 1,
        borderColor: "#1f2740",
        borderRadius: 14,
        padding: 14,
        gap: 12,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#3a4160",
        alignItems: "center",
        justifyContent: "center",
    },
    radioActive: { borderColor: "#7c5cf5" },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#7c5cf5" },
    optionLabel: { color: "#fff", fontSize: 14, fontWeight: "600" },
    optionCount: { color: "#8a94a8", fontSize: 12, marginTop: 2 },
    customInput: {
        color: "#fff",
        backgroundColor: "#0B0F16",
        borderWidth: 1,
        borderColor: "#3a4160",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: 70,
        textAlign: "center",
    },
    continueButton: {
        backgroundColor: "#7c5cf5",
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    continueText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});