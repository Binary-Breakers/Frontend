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

export default function Form() {
    const [variantType, setVariantType] = useState<number>(0);
    const [compilerOptions, setCompilerOptions] = useState<string>("");
    const [vulnType, setVulnType] = useState<string>("");
    const [platform, setPlatform] = useState("");
    const [files, setFiles] = useState<any>([]);
    const [progress, setProgress] = useState<number>(0);
    const [progressLabel, setProgressLabel] = useState<string>("Idle");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    async function onclick() {
        console.log("clicked");
        if (variantType < 1 || variantType > 75) {
            showError("please enter a variant number between 1 and 75");
            return;
        }
        if (vulnType === "") {
            showError("No vulnerability type chosen");
            return;
        }
        if (platform === "") {
            showError("please choose a platform");
            return;
        }
        if (files.length === 0) {
            showError("No files chosen");
            return;
        }

        // Disable inputs when request starts
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
                console.error("Request failed:", {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                });

                const errorDetails = await response.text();
                console.error("Error details from server:", errorDetails);

                toast.error(`Error: ${response.status} - ${response.statusText}`, {
                    duration: 5000,
                });

                throw new Error(`Request failed with status ${response.status} - ${response.statusText}`);
            }

            setProgress(60);
            setProgressLabel("Now generating variants");

            const data = await response.json();
            console.log(data);

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
                console.error("Generation failed:", {
                    status: generationResponse.status,
                    statusText: generationResponse.statusText,
                    url: generationResponse.url,
                });

                const generationErrorDetails = await generationResponse.text();
                console.error("Generation error details:", generationErrorDetails);

                toast.error(`Error: ${generationResponse.status} - ${generationResponse.statusText}`, {
                    duration: 5000,
                });

                throw new Error(`Generation failed: ${generationResponse.status} - ${generationResponse.statusText}`);
            }

            const blob = await generationResponse.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "generated-variants.zip";
            setProgress(90);
            setProgressLabel("Downloading Results");
            document.body.appendChild(a);
            a.click();

            a.remove();
            URL.revokeObjectURL(blobUrl);
            setProgress(100);
            setProgressLabel("Completed");
        } catch (error: any) {
            // Reset progress on error
            setProgress(0);
            setProgressLabel("Idle");

            if (error.message === "Failed to fetch") {
                toast.error("Unable to connect to the server. Please check if the backend is running.", {
                    duration: 5000,
                });
                console.error("Network error: Failed to fetch. Possible backend issue or incorrect URL.");
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
            <div className="mt-6">
                <div className="text-center mb-2 text-lg font-semibold">
                    {progressLabel} - {progress}%
                </div>
                <Progress value={progress} max={100} className="w-full" />
            </div>
        </>
    );
}
