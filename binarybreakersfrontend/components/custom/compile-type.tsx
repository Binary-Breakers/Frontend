"use client";
import { Input } from "@/components/ui/input";

export default function CompileType() {
    return (
        <>            
            Please add compile arguments
            <Input className="w-full" type="text" aria-label="Please add compile arguments"></Input>
        </>
    );
}