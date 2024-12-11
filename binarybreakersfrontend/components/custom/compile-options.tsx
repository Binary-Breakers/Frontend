"use client";
import { Input } from "@/components/ui/input";

export default function CompilerOptions({ setCompilerOptions }: { setCompilerOptions: (value: string) => void }) {
    return (
        <>
            <p className="mb-2 text-sm text-gray-500">
                Add compile arguments (optional). For example: <code>-O2 -Wall</code>
            </p>
            <Input
                onChange={(e) => setCompilerOptions(e.target.value)}
                className="w-full"
                type="text"
                placeholder="e.g., -O2 -Wall"
                aria-label="Add compile arguments (optional)"
            />
        </>
    );
}
