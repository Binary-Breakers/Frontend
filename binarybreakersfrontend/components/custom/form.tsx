"use client";
import Dropfile from "@/components/custom/drop-file";
import VulnType from "@/components/custom/vuln-type";
import VariantType from "@/components/custom/variant-type";
import CompileType from "@/components/custom/compile-type";
import  SubmitButton from "@/components/custom/submit-btn";
import {DropDownPlatform} from "@/components/custom/drop-down-v2";
import { FormEvent } from 'react';
import { useRef, useState } from "react";
import * as React from "react"

export default function Form() {
    const [variantType, setVariantType] = useState<number>(0);
    const [compileType, setCompileType] = useState<string>("");
    const [vulnType, setVulnType] = useState<string>("");
    const [platform, setPlatform] = React.useState("")
    const [files, setFiles] = useState<any>([]);

    function onclick() {
        console.log("clicked");
        if (variantType < 1 || variantType > 75) {
            showError("To much or to few number of variants chosen");
            return;
        }
        if (vulnType === "") {
            showError("No vulnerability type chosen");
            return;
        }
        if (platform === "") {
            showError("No platform chosen");
            return;
        }
        if (files.length === 0) {
            showError("No files chosen");
            return;
        }
        sendRequest();
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
        return await new Promise((resolve, reject) => {
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
            const fileContent = await readFileContent(files[0]);
            const response = await fetch("http://localhost:5294/api/Analysis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    SourceCode: fileContent, // only one file for now
                    VulnerabilityType: vulnType,
                    Platform: parsePlatform(platform)
                })
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data = await response.json();
            console.log(data);

            const analysisResult = {
                id: data.id,
                vulnerabilityType: data.vulnerabilityType,
                isValid: data.isValid,
                explanation: data.explanation
            };

            const seedCode = {
                sourceCode: fileContent,
                vulnerabilityType: vulnType,
                platform: parsePlatform(platform)
            };

            const requestData = {
                analysisResult,
                seedCode,
                maxVariants: variantType
            };

            await fetch("http://localhost:5294/api/Generation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            }).then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
              })
              .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
            
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'downloaded-file'; // Specify the file name for the download
            
                document.body.appendChild(a);
                a.click();
            
                a.remove();
                URL.revokeObjectURL(blobUrl);
              })
              .catch(error => console.error('There was a problem with the fetch operation:', error));
        } catch (error: any) {
            showError(error.message);
        }
    }

    function showError(errorMessage: string) {
        // show error message visually to user
        console.log(errorMessage);
    }

    return (
        <>            
            <div className="w-full flex justify-center items-center gap-10">
                <div className="w-3/12">
                    <VariantType setVariantType={setVariantType}></VariantType>
                </div>
                <div className="w-1/2">
                    <VulnType setVulnType={setVulnType}></VulnType>
                </div>
                <div className="w-3/12">
                    <DropDownPlatform platform={platform} setPlatform={setPlatform}></DropDownPlatform>
                </div>
            </div>
            <div>
                <CompileType setCompileType={setCompileType}></CompileType>
            </div>
            <Dropfile files={files} setFiles={setFiles}></Dropfile> 
            <div className="flex justify-center">
                <SubmitButton onclick={onclick}></SubmitButton>
            </div>
        </>
    );
}