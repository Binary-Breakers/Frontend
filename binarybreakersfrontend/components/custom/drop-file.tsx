"use client";

import { useRef, useState } from "react";

export default function DragAndDrop({files, setFiles}: {files: any, setFiles: (value: any) => void}) {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [dragText, setDragTextActive] = useState<boolean>(false);
    const inputRef = useRef<any>(null);

    function handleChange(e: any) {
        e.preventDefault();
        console.log("File has been added");
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files);
            if (e.target.files.length === 1) {
                setFiles(() => [e.target.files[0]]);
                setDragTextActive(true);
            } else {
                console.log("Please select only one file");
            }
        }
    }

    function handleSubmitFile(e: any) {
        if (files.length === 0) {
            // no file has been submitted  
        } else {
            // write submit logic here  
        }
    }

    function handleDrop(e: React.DragEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (e.dataTransfer.files.length === 1) {
                setFiles(() => [e.dataTransfer.files[0]]);
                setDragTextActive(true);
            } else {
                console.log("Please select only one file");
            }
        }
    }

    function handleDragLeave(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }

    function handleDragOver(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }

    function handleDragEnter(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }

    function removeFile(fileName: any, idx: any) {
        const newArr = [...files];
        newArr.splice(idx, 1);
        setFiles([]);
        setFiles(newArr);
        setDragTextActive(false);
    }

    function openFileExplorer() {
        inputRef.current.value = "";
        inputRef.current.click();
    }

    return (
        <>
            <form
                className={`p-4 text-center flex flex-col items-center justify-center`}
                onDragEnter={handleDragEnter}
                onSubmit={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
            >
                <div className="p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600  flex-col w-4/5 h-2/3" data-hs-file-upload-trigger="">
                    <div className="text-center" id="dragText">
                        <svg className="w-16 text-gray-400 mx-auto dark:text-neutral-400" width="70" height="46" viewBox="0 0 70 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z" fill="currentColor" stroke="currentColor" strokeWidth="2" className="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"></path>
                            <path d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z" fill="currentColor" stroke="currentColor" strokeWidth="2" className="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"></path>
                            <rect x="17.0656" y="1.62305" width="35.8689" height="42.7541" rx="5" fill="currentColor" stroke="currentColor" strokeWidth="2" className="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"></rect>
                            <path d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z" stroke="currentColor" strokeWidth="2" className="stroke-gray-400 dark:stroke-neutral-500"></path>
                            <circle cx="39.5902" cy="14.9672" r="4.16393" stroke="currentColor" strokeWidth="2" className="stroke-gray-400 dark:stroke-neutral-500"></circle>
                        </svg>

                        {dragText === false && (
                            <div className="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">

                                <input
                                    placeholder="fileInput"
                                    className="hidden"
                                    ref={inputRef}
                                    type="file"
                                    multiple={true}
                                    onChange={handleChange}
                                    accept=".c"
                                />

                                <span className="pe-1 font-medium text-gray-800 dark:text-neutral-200">
                                    Drag & Drop file or{" "}
                                    <span
                                        className="font-bold text-blue-600 cursor-pointer"
                                        onClick={openFileExplorer}
                                    >
                                        <u>Select file</u>
                                    </span>{" "}
                                    to upload
                                </span>
                                {/* <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:bg-neutral-800 dark:text-blue-500 dark:hover:text-blue-600">browse</span> */}
                            </div>
                        )}

                        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-400">
                            Pick a file up to 2MB.
                        </p>
                    </div>
                    <div className="flex flex-col items-center p-3">
                        {files.map((file: any, idx: any) => (
                            <div key={idx} className="flex flex-row space-x-5">
                                <span>{file.name}</span>
                                <span
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => removeFile(file.name, idx)}
                                >
                                    remove
                                </span>
                            </div>
                        ))}
                    </div>
                </div >
                
            </form>
        </>
    );
}