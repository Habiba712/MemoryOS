import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STEPS = [
    { title: "Go to your Instagram profile", desc: "On the app or website." },
    { title: "Go to Settings and privacy", desc: "Your activity  ›  Download your information." },
    { title: 'Choose what to include', desc: 'Select "Some of your information" and make sure to include Posts, Photos, Videos, Captions, etc.' },
    { title: "Download ZIP file", desc: "Instagram will email you a link when your file is ready." },
];

export default function GetDataStep({
    onBack,
    onContinue,
}: {
    onBack: () => void;
    onContinue: () => void;
}) {
    return (
        <View style={styles.container}>
            <Pressable onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>

            <Text style={styles.header}>Get your Instagram data</Text>
            <Text style={styles.subHeader}>
                Follow these steps to download your data as a ZIP file.
            </Text>

            <View style={styles.stepsList}>
                {STEPS.map((s, i) => (
                    <View key={i} style={styles.stepRow}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{i + 1}</Text>
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>{s.title}</Text>
                            <Text style={styles.stepDesc}>{s.desc}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <Pressable style={styles.continueButton} onPress={onContinue}>
                <Text style={styles.continueText}>I have my ZIP file</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>

            <Pressable style={styles.helpLink}>
                <Text style={styles.helpText}>Need help?  View detailed guide</Text>
                <Ionicons name="open-outline" size={13} color="#8f7ee0" />
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
    backButton: {
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 6,
    },
    subHeader: {
        fontSize: 13.5,
        color: "#8a94a8",
        marginBottom: 24,
    },
    stepsList: {
        gap: 20,
        marginBottom: 30,
       
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: "#241a3d",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        color: "#a78bfa",
        fontWeight: "700",
        fontSize: 20,
    },
    stepTextContainer: {
        flex: 1,
    },
    stepTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 2,
    },
    stepDesc: {
        color: "#8a94a8",
        fontSize: 15,
        lineHeight: 25,
    },
    continueButton: {
        backgroundColor: "#7c5cf5",
        borderRadius: 16,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 14,
    },
    continueText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    helpLink: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    helpText: {
        color: "#8f7ee0",
        fontSize: 12.5,
        fontWeight: "500",
    },
});