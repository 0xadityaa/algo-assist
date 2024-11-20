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

const themes = [
  {
    value: "javascript",
    label: "Javascript (Node.js 12.14.0)",
  },
  {
    value: "cpp",
    label: "C++ (GCC 9.2.0)",
  },
  {
    value: "csharp",
    label: "C# (Mono 6.6.0.161)",  
  },
  {
    value: "go",
    label: "Go (1.13.5)",
  },
  {
    value: "java",
    label: "Java (OpenJDK 13.0.1)",
  },
  {
    value: "python",
    label: "Python (2.7.17)",
  },
  {
    value: "rust",
    label: "Rust (1.40.0)",
  },
  {
    value: "typescript",
    label: "TypeScript (3.7.4)",
  },
]

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (theme: string) => void
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedLanguage ? themes.find((theme) => theme.value === selectedLanguage)?.label : "Select theme..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search theme..." className="h-9" />
          <CommandList>
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandGroup>
              {themes.map((theme) => (
                <CommandItem
                  key={theme.value}
                  value={theme.value}
                  onSelect={(currentValue) => {
                    onLanguageChange(currentValue === selectedLanguage ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {theme.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedLanguage === theme.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
