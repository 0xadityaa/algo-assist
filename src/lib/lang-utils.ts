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
];

export function getLanguageId(languageValue: string): number | undefined {
  const language = languages.find(lang => lang.value === languageValue);
  return language ? language.id : undefined;
}
