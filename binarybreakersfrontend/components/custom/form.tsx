"use client";
import Dropfile from "@/components/custom/drop-file";
import VulnType from "@/components/custom/vuln-type";
import VariantType from "@/components/custom/variant-type";
import CompilerOptions from "@/components/custom/compile-options";
import  SubmitButton from "@/components/custom/submit-btn";
import {DropDownPlatform} from "@/components/custom/drop-down-v2";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";


export default function Form() {
    const [variantType, setVariantType] = useState<number>(0);
    const [compilerOptions, setCompilerOptions] = useState<string>("");
    const [vulnType, setVulnType] = useState<string>("");
    const [platform, setPlatform] = useState("")
    const [files, setFiles] = useState<any>([]);
    const [progress, setProgress] = useState<number>(0);
    const [progressLabel, setProgressLabel] = useState<string>("Idle");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);



    async function onclick() {
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
            setProgress(10);
            setProgressLabel("Reading File");
            const fileContent = await readFileContent(files[0]);
            setProgress(30);
            setProgressLabel("Analyzing Source Code");
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
            setProgress(60);
            setProgressLabel("Now generating variants");

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
                maxVariants: variantType,
                CompileParameters: compilerOptions
            };

            await fetch("http://localhost:5294/api/Generation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            }).then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob(); // Convert the response into a Blob
              })
              .then(blob => {
                // Create a URL for the Blob
                const blobUrl = URL.createObjectURL(blob);
            
                // Create an anchor element to trigger the download
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'downloaded-file'; // Specify the file name for the download
                setProgress(90);
                setProgressLabel("Downloading Results");
                // Trigger the download
                document.body.appendChild(a);
                a.click();
            
                // Cleanup
                a.remove();
                URL.revokeObjectURL(blobUrl);
                setProgress(100);
                setProgressLabel("Completed");
              })
              .catch(error => console.error('There was a problem with the fetch operation:', error));

    
        } catch (error: any) {
            showError(error.message);
        }
    }

    function showError(errorMessage: string) {
        console.log(errorMessage);

    }

    

    //fetch here

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
                    {/* <DropDown label="Platform" array={["Windows", "Linux"]} className="w-full"></DropDown> */}
                    <DropDownPlatform platform={platform} setPlatform={setPlatform}></DropDownPlatform>
                </div>
            </div>
            <div>
                <CompilerOptions setCompilerOptions={setCompilerOptions}></CompilerOptions>
            </div>
            {/* er moeten nog error messages weergeven worden aan de user */}
            <Dropfile files={files} setFiles={setFiles}></Dropfile> 
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