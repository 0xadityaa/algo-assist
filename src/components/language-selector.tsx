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

const languages = [
  {
    id: 63,
    value: "javascript",
    label: "Javascript",
  },
  {
    id: 54,
    value: "cpp",
    label: "C++",
  },
  {
    id: 51,
    value: "csharp",
    label: "C#",  
  },
  {
    id: 60,
    value: "go",
    label: "Go",
  },
  {
    id: 62,
    value: "java",
    label: "Java",
  },
  {
    id: 34,
    value: "python",
    label: "Python",
  },
  {
    id: 73,
    value: "rust",
    label: "Rust",
  },
  {
    id: 74,
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
          {selectedLanguage ? languages.find((language) => language.value === selectedLanguage)?.label : "Select theme..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search theme..." className="h-9" />
          <CommandList>
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={(currentValue) => {
                    onLanguageChange(currentValue === selectedLanguage ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {language.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedLanguage === language.value ? "opacity-100" : "opacity-0"
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

export default languages;