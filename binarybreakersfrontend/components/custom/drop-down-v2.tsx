"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const platforms = [
  {
    platform: "Windows",
    label: "Windows",
  },
  {
    platform: "Linux",
    label: "Linux",
  },
]

export function DropDownPlatform({ platform, setPlatform }: { platform: string; setPlatform: (platform: string) => void }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="pt-6">
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            >
            {platform
                ? platforms.find((platformTuple) => platformTuple.platform === platform)?.label
                : "Select platform..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
            <CommandInput placeholder="Search platform..." />
            <CommandList>
                <CommandEmpty>No platform found.</CommandEmpty>
                <CommandGroup>
                {platforms.map((platformTuple) => (
                    <CommandItem
                    key={platformTuple.platform}
                    value={platformTuple.platform}
                    onSelect={(currentValue) => {
                        setPlatform(currentValue === platform ? "" : currentValue)
                        setOpen(false)
                    }}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        platform === platformTuple.platform ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {platformTuple.label}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
    </div>
  )
}
