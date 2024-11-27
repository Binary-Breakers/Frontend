"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface DropDownProps {
    array: string[]; // Array of dropdown options
    label: string;   // Label displayed above the dropdown
    className: string;
}

const DropDown = ({array, label, className}: DropDownProps) => {
    const [selection, setSelection] = useState(array[0]);

    return (
        <>
            <div className={className}>
                <div>{label}</div>
                <div className="rounded-md border-gray border-2 p-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="min-w-full flex justify-between">
                            <span className="flex-grow-1 mr-3">{selection}</span>
                            <span className="float-right flex-grow-0">V</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {array.map((option, index) => <DropdownMenuItem key={index} onClick={() => setSelection(option)}>{option}</DropdownMenuItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    )
}

export default DropDown;