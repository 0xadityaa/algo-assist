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
    value: "vs-dark",
    label: "VS Dark",
  },
  {
    value: "blackboard",
    label: "Blackboard",
  },
  {
    value: "github",
    label: "Github",
  },
  {
    value: "monokai-bright",
    label: "Monokai Bright",  
  },
  {
    value: "monokai",
    label: "Monokai",
  },
  {
    value: "spacecadet",
    label: "SpaceCadet",
  },
]

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
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
          {selectedTheme ? themes.find((theme) => theme.value === selectedTheme)?.label : "Select theme..."}
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
                    onThemeChange(currentValue === selectedTheme ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {theme.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedTheme === theme.value ? "opacity-100" : "opacity-0"
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
