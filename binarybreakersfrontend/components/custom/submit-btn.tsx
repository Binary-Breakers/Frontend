"use client";

export default function SubmitButton({ onclick, disabled }: { onclick: () => void; disabled: boolean }) {
    return (
        <>
            <button
                className={`p-2 mt-3 inline-block w-1/5 border-2 rounded-lg ${
                    disabled ? "bg-gray-400 cursor-not-allowed" : "bg-black"
                }`}
                onClick={!disabled ? onclick : undefined} // Prevent clicking when disabled
                disabled={disabled} // Disable the button
            >
                <span className="p-2 text-white">Submit</span>
            </button>
        </>
    );
}
