"use client";

import Dropfile from "@/components/custom/drop-file";
import VulnType from "@/components/custom/vuln-type";
import VariantType from "@/components/custom/variant-type";
import CompilerOptions from "@/components/custom/compile-options";
import SubmitButton from "@/components/custom/submit-btn";
import { DropDownPlatform } from "@/components/custom/drop-down-v2";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Form() {
    const [variantType, setVariantType] = useState<number>(0);
    const [compilerOptions, setCompilerOptions] = useState<string>("");
    const [vulnType, setVulnType] = useState<string>("");
    const [platform, setPlatform] = useState("");
    const [files, setFiles] = useState<any>([]);
    const [progress, setProgress] = useState<number>(0);
    const [progressLabel, setProgressLabel] = useState<string>("Idle");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    async function onclick() {
        console.log("clicked");
        if (variantType < 1 || variantType > 75) {
            showError("Please enter a variant number between 1 and 75");
            return;
        }
        if (vulnType === "") {
            showError("No vulnerability type chosen");
            return;
        }
        if (platform === "") {
            showError("Please choose a platform");
            return;
        }
        if (files.length === 0) {
            showError("No files chosen");
            return;
        }

        // Open dialog and disable inputs when request starts
        setIsDialogOpen(true);
        setIsDisabled(true);

        try {
            await sendRequest();
        } catch (error: any) {
            showError(error.message);
        } finally {
            // Re-enable inputs when request is completed
            setIsDisabled(false);
        }
    }

    function parsePlatform(platform: string) {
        switch (platform) {
            case "Windows":
                return 1;
            case "Linux":
                return 0;
            default:
                return -1;
        }
    }

    async function readFileContent(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                resolve(content);
            };
            reader.onerror = () => {
                reject(new Error("Failed to read file"));
            };
            reader.readAsText(file);
        });
    }

    async function sendRequest() {
        try {
            setProgress(10);
            setProgressLabel("Reading File");
            const fileContent = await readFileContent(files[0]);
            setProgress(30);
            setProgressLabel("Analyzing Source Code");

            const response = await fetch("http://localhost:5294/api/Analysis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    SourceCode: fileContent,
                    VulnerabilityType: vulnType,
                    Platform: parsePlatform(platform),
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Error details from server:", errorDetails);
                throw new Error(`Request failed with status ${response.status} - ${response.statusText}`);
            }

            setProgress(60);
            setProgressLabel("Now generating variants");

            const data = await response.json();

            const requestData = {
                analysisResult: {
                    id: data.id,
                    vulnerabilityType: data.vulnerabilityType,
                    isValid: data.isValid,
                    explanation: data.explanation,
                },
                seedCode: {
                    sourceCode: fileContent,
                    vulnerabilityType: vulnType,
                    platform: parsePlatform(platform),
                },
                maxVariants: variantType,
                CompileParameters: compilerOptions,
            };

            const generationResponse = await fetch("http://localhost:5294/api/Generation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (!generationResponse.ok) {
                const generationErrorDetails = await generationResponse.text();
                console.error("Generation error details:", generationErrorDetails);
                throw new Error(`Generation failed: ${generationResponse.status} - ${generationResponse.statusText}`);
            }

            const blob = await generationResponse.blob();
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);

            setProgress(100);
            setProgressLabel("Completed");
        } catch (error: any) {
            setProgress(0);
            setProgressLabel("Idle");
            if (error.message === "Failed to fetch") {
                toast.error("Unable to connect to the server. Please check if the backend is running.", {
                    duration: 5000,
                });
            } else {
                showError(error.message);
            }
        }
    }

    function showError(errorMessage: string) {
        toast.error(errorMessage, { duration: 5000 });
        console.error(errorMessage);
        setProgress(0); // Reset progress on general errors
        setProgressLabel("Idle");
    }

    return (
        <>
            <div className="w-full flex justify-center items-center gap-10">
                <div className="w-3/12">
                    <VariantType setVariantType={setVariantType} />
                </div>
                <div className="w-1/2">
                    <VulnType setVulnType={setVulnType} />
                </div>
                <div className="w-3/12">
                    <DropDownPlatform platform={platform} setPlatform={setPlatform} />
                </div>
            </div>
            <div>
                <CompilerOptions setCompilerOptions={setCompilerOptions} />
            </div>
            <Dropfile files={files} setFiles={setFiles} />
            <div className="flex justify-center">
                <SubmitButton onclick={onclick} disabled={isDisabled} />
            </div>

            {/* Modal for progress */}
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                if (progress === 100) {
                    setIsDialogOpen(isOpen); // Allow closing only when progress is complete
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Processing Request</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <p className="text-lg font-semibold text-center">{progressLabel}</p>
                        <Progress value={progress} max={100} className="w-full mt-2" />
                    </div>
                    {progress === 100 && blobUrl && (
                        <div className="mt-4 text-center">
                            <a
                                href={blobUrl}
                                download="generated-variants.zip"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save Results
                            </a>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
