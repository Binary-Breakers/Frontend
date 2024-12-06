"use client";
import Dropfile from "@/components/custom/drop-file";
import VulnType from "@/components/custom/vuln-type";
import VariantType from "@/components/custom/variant-type";
import CompileType from "@/components/custom/compile-type";
import SubmitButton from "@/components/custom/submit-btn";
import { DropDownPlatform } from "@/components/custom/drop-down-v2";
import { useState } from "react";
import * as React from "react";
import { Progress } from "@/components/ui/progress";

export default function Form() {
    const [variantType, setVariantType] = useState<number>(0);
    const [compileType, setCompileType] = useState<string>("");
    const [vulnType, setVulnType] = useState<string>("");
    const [platform, setPlatform] = useState<string>("");
    const [files, setFiles] = useState<any>([]);
    const [progress, setProgress] = useState<number>(0);
    const [progressLabel, setProgressLabel] = useState<string>("Idle");

    function onclick() {
        if (variantType < 1 || variantType > 75) {
            showError("Too many or too few variants chosen");
            return;
        }
        if (!vulnType) {
            showError("No vulnerability type chosen");
            return;
        }
        if (!platform) {
            showError("No platform chosen");
            return;
        }
        if (!files.length) {
            showError("No files chosen");
            return;
        }
        sendRequest();
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    SourceCode: fileContent,
                    VulnerabilityType: vulnType,
                    Platform: parsePlatform(platform),
                }),
            });

            if (!response.ok) throw new Error("Analysis request failed");
            setProgress(60);
            setProgressLabel("Preparing Generation Request");

            const data = await response.json();
            const requestData = {
                analysisResult: data,
                seedCode: { sourceCode: fileContent, vulnerabilityType: vulnType, platform: parsePlatform(platform) },
                maxVariants: variantType,
            };

            const generationResponse = await fetch("http://localhost:5294/api/Generation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!generationResponse.ok) throw new Error("Generation request failed");
            setProgress(90);
            setProgressLabel("Downloading Results");

            // Handle file download
            const blob = await generationResponse.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "generated-file";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);

            setProgress(100);
            setProgressLabel("Completed");
        } catch (error: any) {
            showError(error.message);
            setProgress(0);
            setProgressLabel("Error");
        }
    }

    async function readFileContent(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(file);
        });
    }

    function parsePlatform(platform: string) {
        return platform === "Windows" ? 1 : platform === "Linux" ? 0 : -1;
    }

    function showError(errorMessage: string) {
        console.error(errorMessage);
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
                <CompileType setCompileType={setCompileType} />
            </div>
            <Dropfile files={files} setFiles={setFiles} />
            <div className="flex justify-center mt-4">
                <SubmitButton onclick={onclick} />
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
