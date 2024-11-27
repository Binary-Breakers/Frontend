"use client";
import { Input } from "@/components/ui/input";

export default function VariantType() {
    return (
        <>            
            Variants
            <Input className="w-full" type="number" min={1}></Input>
        </>
    );
}