import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import GetDataStep from "@/components/uploads/steps/GetDataStep";
import UploadZipStep from "@/components/uploads/steps/Uploadzipstep";
import ChooseAmountStep from "@/components/uploads/steps/ChooseAmountStep";
import ProcessingStep from "@/components/uploads/steps/Processingstep";
import ResultsStep from "@/components/uploads/steps/Resultsstep";
import * as SecureStore from 'expo-secure-store';


export type ImportState = {
    totalPosts: number;
    chosenAmount: number;
    processedCount: number;
    successCount: number;
    failedCount: number;
    failedThumbnails: string[];
};

const STEPS = ["getData", "upload", "amount", "processing", "results"] as const;
type Step = typeof STEPS[number];

export default function ZipImportFlow({ onBack }: { onBack: () => void }) {
    const [stepIndex, setStepIndex] = useState(1);
    const [user, setUser] = useState<string | null>(null);
    const [exportZipFile, setExportZipFile] = useState<any | null>(null);
    type ZipFile = {
        uri: string;
        name: string;
        sizeLabel: string;
        mimeType?: string;
    };
    const [zipFile, setZipFile] = useState<ZipFile | null>(null);
    const [importState, setImportState] = useState<ImportState>({
        totalPosts: 0,
        chosenAmount: 0,
        processedCount: 0,
        successCount: 0,
        failedCount: 0,
        failedThumbnails: [],
    });

    const step = STEPS[stepIndex];

    const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    const goBack = () => {
        if (stepIndex === 0) return onBack();
        console.log('stepIndex', stepIndex)
        setStepIndex((i) => Math.max(i - 1, 0));
    };

    //     const countPosts = async (file: any, user: string) => {

    //         if(!user) return;
    //         //e need to unzip it here first then calculta the posts number of the one folder we gonna use.
    //         const exportZipFile = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/insta/import`, {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 instagramZip: file,
    //                 userId: user,

    //             }),
    //             headers: {
    //                 'Content-Type': 'application/zip',
    //             },
    //         });
    //         console.log('exportZipFile', exportZipFile)
    //         setExportZipFile(exportZipFile);



    //     }

    useEffect(() => {
        (async () => {
            const raw = await SecureStore.getItemAsync('sessionData');
            console.log('raw', raw)
            if (raw) setUser(JSON.parse(raw).userId);
        })();
    }, []);

    //   useEffect(() => {
    //     (async () => {
    //       countPosts(zipFile, user);
    //     })();
    //   }, [zipFile, user]);

    console.log('user', user)
    return (
        <View style={styles.container}>
            {step === "getData" && (
                <GetDataStep onBack={goBack} onContinue={goNext} />
            )}

            {step === "upload" && (
                <UploadZipStep
                    onBack={goBack}
                    zipFile={zipFile}
                    onFilePicked={(file) => setZipFile(
                        {
                            uri: file.uri,
                            name: file.name,
                            sizeLabel: file.sizeLabel,
                            mimeType: file.mimeType,
                        }
                    )}
                    onContinue={async () => {
                        if (!zipFile || !user) return;
                        console.log('zipFile', zipFile)
                        const formData = new FormData();

                        formData.append("userId", user);

                        formData.append("instagramZip", {
                            uri: zipFile.uri,
                            name: zipFile.name || "instagram.zip",
                            type: zipFile.mimeType || "application/zip",
                        } as any);

                        console.log("user", user);
                        console.log("zipFile", zipFile);

                        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/insta/import`, {
                            method: 'POST',

                            body: formData
                        });

                        const data = await response.json();
                        console.log('data', data)

                        setImportState((s) => ({ ...s, totalPosts: data.totalFound }));
                        goNext();
                    }}

                />
            )}

            {step === "amount" && (
                <ChooseAmountStep
                    onBack={goBack}
                    totalPosts={importState.totalPosts}
                    onContinue={(amount) => {
                        setImportState((s) => ({ ...s, chosenAmount: amount }));
                        goNext();
                    }}
                />
            )}

            {step === "processing" && (
                <ProcessingStep
                    total={importState.chosenAmount}
                    // Swap this for your real upload/processing hook.
                    // It just needs to call onDone with final counts when finished.
                    onDone={(result) => {
                        setImportState((s) => ({ ...s, ...result }));
                        goNext();
                    }}
                />
            )}

            {step === "results" && (
                <ResultsStep
                    importState={importState}
                    onRetryFailed={() => {
                        // Re-run processing scoped to just the failed ones
                        setStepIndex(3);
                    }}
                    onDone={onBack}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0F16",
    },
});