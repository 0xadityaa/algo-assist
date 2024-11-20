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
    label: "Javascript",
  },
  {
    value: "cpp",
    label: "C++",
  },
  {
    value: "csharp",
    label: "C#",  
  },
  {
    value: "go",
    label: "Go",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "rust",
    label: "Rust",
  },
  {
    value: "typescript",
    label: "Typescript",
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
