"use client";
import { Input } from "@/components/ui/input";

export default function CompileType({setCompileType}: {setCompileType: (value: string) => void}) {
    return (
        <>            
            Please add compile arguments
            <Input onChange={(e) => setCompileType(e.target.value)} className="w-full" type="text" aria-label="Please add compile arguments"></Input>
        </>
    );
}