"use client";
import { Input } from "@/components/ui/input";



export default function VariantType({setVariantType}: {setVariantType: (value: number) => void}) {
    return (
        <>            
            Variants
            <Input onChange={(e) => setVariantType(e.target.valueAsNumber)} className="w-full" type="number" min={1}></Input>
        </>
    );
}