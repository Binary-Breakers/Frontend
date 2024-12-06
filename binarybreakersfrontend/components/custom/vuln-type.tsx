"use client";
import { Input } from "@/components/ui/input";

export default function VulnerabilityType({setVulnType}: {setVulnType: (value: string) => void}) {
    return (
        <>            
            Vulnerability type
            <Input onChange={(e) => setVulnType(e.target.value)} className="w-full"></Input>
        </>
    );
}