"use client";

export default function SubmitButton({onclick}: any) {
    let files = ["file1"];
    function handleSubmitFile(e: any) {
        if (files.length === 0) {
            // no file has been submitted  
        } else {
            // write submit logic here  
        }
    }

    return (
        <>
            <button
                className="bg-black p-2 mt-3 inline-block w-1/5 border-2 rounded-lg"
                onClick={onclick}
            >
                <span className="p-2 text-white">Submit</span>
            </button>  
        </>
    );
}