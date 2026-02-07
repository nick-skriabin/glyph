import React, { useState, useEffect } from "react";
import {
  render,
  Box,
  Text,
  Select,
  Keybind,
  Spacer,
  useApp,
} from "@nick-skriabin/glyph";

const LANGUAGES = [
  { label: "TypeScript", value: "ts" },
  { label: "JavaScript", value: "js" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Python", value: "python" },
  { label: "Ruby", value: "ruby" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Swift", value: "swift" },
  { label: "Zig", value: "zig" },
  { label: "Haskell", value: "haskell" },
  { label: "COBOL", value: "cobol", disabled: true },
];

const EDITORS = [
  { label: "Neovim", value: "nvim" },
  { label: "VS Code", value: "vscode" },
  { label: "Zed", value: "zed" },
  { label: "Helix", value: "helix" },
  { label: "Emacs", value: "emacs" },
];

const THEMES = [
  { label: "Catppuccin", value: "catppuccin" },
  { label: "Gruvbox", value: "gruvbox" },
  { label: "Nord", value: "nord" },
  { label: "Dracula", value: "dracula" },
  { label: "Solarized", value: "solarized" },
  { label: "Tokyo Night", value: "tokyo-night" },
];

const DYNAMIC_ITEMS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

const CONDITIONAL_ITEMS = [
  { label: "Calendar 1", value: "cal1" },
  { label: "Calendar 2 (primary)", value: "cal2" },
  { label: "Calendar 3", value: "cal3" },
];

function App() {
  const { exit } = useApp();
  const [lang, setLang] = useState<string | undefined>(undefined);
  const [editor, setEditor] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<string | undefined>(undefined);
  
  // Dynamic items - starts empty, loads after 2 seconds
  const [dynamicItems, setDynamicItems] = useState<typeof DYNAMIC_ITEMS>([]);
  const [dynamicValue, setDynamicValue] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Conditional select - mimics user's implementation where Select doesn't exist until items load
  const [conditionalItems, setConditionalItems] = useState<typeof CONDITIONAL_ITEMS>([]);
  const [conditionalValue, setConditionalValue] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDynamicItems(DYNAMIC_ITEMS);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Load conditional items after 3 seconds (separate from dynamic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setConditionalItems(CONDITIONAL_ITEMS);
      setConditionalValue(CONDITIONAL_ITEMS[0]?.value);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        border: "round",
        borderColor: "cyan",
        padding: 1,
        gap: 1,
      }}
    >
      <Text style={{ bold: true, color: "cyanBright", textAlign: "center" }}>
        Select Component Demo
      </Text>

      <Box style={{ flexDirection: "row", gap: 2 }}>
        <Box style={{ flexDirection: "column", gap: 1, width: 30 }}>
          <Text style={{ bold: true, color: "yellow" }}>Language</Text>
          <Select
            items={LANGUAGES}
            value={lang}
            onChange={setLang}
            placeholder="Pick a language..."
            maxVisible={6}
            style={{ borderColor: "yellow" }}
            focusedStyle={{ borderColor: "yellowBright" }}
            highlightColor="yellow"
          />
        </Box>

        <Box style={{ flexDirection: "column", gap: 1, width: 25 }}>
          <Text style={{ bold: true, color: "green" }}>Editor</Text>
          <Select
            items={EDITORS}
            value={editor}
            onChange={setEditor}
            placeholder="Pick an editor..."
            style={{ borderColor: "green" }}
            focusedStyle={{ borderColor: "greenBright" }}
            highlightColor="green"
          />
        </Box>

        <Box style={{ flexDirection: "column", gap: 1, width: 25 }}>
          <Text style={{ bold: true, color: "magenta" }}>Theme</Text>
          <Select
            items={THEMES}
            value={theme}
            onChange={setTheme}
            placeholder="Pick a theme..."
            style={{ borderColor: "magenta" }}
            focusedStyle={{ borderColor: "magentaBright" }}
            highlightColor="magenta"
          />
        </Box>

        <Box style={{ flexDirection: "column", gap: 1, width: 25 }}>
          <Text style={{ bold: true, color: "red" }}>
            Dynamic {isLoading ? "(loading...)" : "(loaded)"}
          </Text>
          <Select
            items={dynamicItems}
            value={dynamicValue}
            onChange={setDynamicValue}
            placeholder={isLoading ? "Loading..." : "Pick one..."}
            style={{ borderColor: "red" }}
            focusedStyle={{ borderColor: "redBright" }}
            highlightColor="red"
          />
        </Box>
      </Box>

      {/* Conditional Select - mimics user's calendar implementation */}
      <Box style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
        <Text style={{ color: "white", width: 12 }}>calendar</Text>
        {conditionalItems.length > 0 ? (
          <Select
            items={conditionalItems}
            value={conditionalValue}
            onChange={setConditionalValue}
            placeholder="Pick calendar..."
            style={{ borderColor: "blue", width: 30 }}
            focusedStyle={{ borderColor: "blueBright" }}
            highlightColor="blue"
          />
        ) : (
          <Text style={{ color: "white", dim: true }}>Loading...</Text>
        )}
      </Box>

      <Box style={{ flexDirection: "column", gap: 0 }}>
        <Text style={{ bold: true, color: "cyan" }}>Selection:</Text>
        <Text>
          {lang ? `Language: ${lang}` : "Language: (none)"} |{" "}
          {editor ? `Editor: ${editor}` : "Editor: (none)"} |{" "}
          {theme ? `Theme: ${theme}` : "Theme: (none)"} |{" "}
          {dynamicValue ? `Dynamic: ${dynamicValue}` : "Dynamic: (none)"} |{" "}
          {conditionalValue ? `Calendar: ${conditionalValue}` : "Calendar: (none)"}
        </Text>
      </Box>

      <Spacer />

      <Box style={{ bg: "cyan", justifyContent: "center" }}>
        <Text style={{ bold: true, color: "black" }}>
          Tab = next | Enter/Space = open | Type to filter | Esc = close | q =
          quit
        </Text>
      </Box>

      <Keybind keypress="q" onPress={() => exit()} />
    </Box>
  );
}

render(<App />);
