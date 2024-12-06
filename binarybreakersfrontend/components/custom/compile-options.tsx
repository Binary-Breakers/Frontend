"use client";
import { Input } from "@/components/ui/input";

export default function CompilerOptions({setCompilerOptions}: {setCompilerOptions: (value: string) => void}) {
    return (
        <>            
            Please add compile arguments
            <Input onChange={(e) => setCompilerOptions(e.target.value)} className="w-full" type="text" aria-label="Please add compile arguments"></Input>
        </>
    );
}