import { SITE_BTN_COLOR } from "@/constants/colors";
export const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Solidity: "#AA6746",
    Go: "#00ADD8",
    Rust: "#dea584",
    "C#": "#239120",
    Java: "#b07219",
    "C++": "#f34b7d",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Vue: "#4FC08D",
    React: "#61DAFB",
    Swift: "#FA7343",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    PHP: "#777BB4",
    Ruby: "#701516",
    Shell: "#89e051",
  };
  return colors[language] || SITE_BTN_COLOR;
};
