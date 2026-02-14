import React, { useState, useCallback } from "react";
import {
  render,
  Box,
  Text,
  Input,
  Button,
  Keybind,
  useInput,
  useApp,
  ScrollView,
} from "@semos-labs/glyph";
import type { Key } from "@semos-labs/glyph";

interface KeyEvent {
  id: number;
  key: Key;
  rawHex: string;
  consumedBy: string;
}

let eventId = 0;

function App() {
  const { exit } = useApp();
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [shiftRCount, setShiftRCount] = useState(0);
  const [shiftDCount, setShiftDCount] = useState(0);
  const [shiftACount, setShiftACount] = useState(0);
  const [mode, setMode] = useState<"global" | "input">("global");
  const [inputValue, setInputValue] = useState("");

  const addEvent = useCallback((key: Key, consumedBy: string) => {
    const rawHex = [...key.sequence]
      .map((c) => {
        const code = c.charCodeAt(0);
        if (code < 32 || code === 127) return `\\x${code.toString(16).padStart(2, "0")}`;
        if (code > 126) return `\\u${code.toString(16).padStart(4, "0")}`;
        return c;
      })
      .join("");

    setEvents((prev) => [
      { id: ++eventId, key, rawHex, consumedBy },
      ...prev.slice(0, 29),
    ]);
  }, []);

  useInput((key) => {
    addEvent(key, "useInput");
  });

  return (
    <Box style={{ flexDirection: "column", width: "100%", height: "100%" }}>
      {/* Header */}
      <Box style={{ bg: "cyan" }}>
        <Text style={{ bold: true, color: "black" }}>
          {" "}🔍 Key Debug{" "}
        </Text>
        <Text style={{ color: "black" }}>
          {" "}Shift+R:{shiftRCount} Shift+D:{shiftDCount} Shift+A:{shiftACount}{" "}
        </Text>
        <Box style={{ flexGrow: 1 }} />
        <Text style={{ color: "black", dim: true }}> Ctrl+C quit </Text>
      </Box>

      {/* Keybinds (invisible) */}
      <Keybind
        keypress="shift+r"
        onPress={() => {
          setShiftRCount((c) => c + 1);
          addEvent({ name: "r", shift: true, sequence: "R" }, "⚡ Keybind[shift+r]");
        }}
      />
      <Keybind
        keypress="shift+d"
        onPress={() => {
          setShiftDCount((c) => c + 1);
          addEvent({ name: "d", shift: true, sequence: "D" }, "⚡ Keybind[shift+d]");
        }}
      />
      <Keybind
        keypress="shift+a"
        onPress={() => {
          setShiftACount((c) => c + 1);
          addEvent({ name: "a", shift: true, sequence: "A" }, "⚡ Keybind[shift+a]");
        }}
      />

      {/* Mode bar */}
      <Box style={{ bg: mode === "global" ? "blue" : "magenta" }}>
        <Button
          label=" Global "
          onPress={() => setMode("global")}
          style={{ bg: mode === "global" ? "white" : undefined, color: mode === "global" ? "black" : "white" }}
        />
        <Button
          label=" Input "
          onPress={() => setMode("input")}
          style={{ bg: mode === "input" ? "white" : undefined, color: mode === "input" ? "black" : "white" }}
        />
        <Text style={{ color: "white" }}>
          {mode === "global" ? " keys → useInput" : " keys → Input component"}
        </Text>
      </Box>

      {/* Input (only in input mode) */}
      {mode === "input" && (
        <Input
          value={inputValue}
          onChange={setInputValue}
          autoFocus
          style={{ bg: "#1a1a2e" }}
          focusedStyle={{ bg: "#16213e" }}
          placeholder="Type here..."
          onKeyPress={(key) => {
            addEvent(key, "Input.onKeyPress");
            return false;
          }}
        />
      )}

      {/* Event log */}
      <Box style={{ flexDirection: "column", flexGrow: 1 }}>
        <ScrollView>
          {events.length === 0 && (
            <Text style={{ dim: true }}> Press any key...</Text>
          )}
          {events.map((ev) => (
            <Box key={ev.id}>
              <Text style={{ color: "cyan" }}>
                {" "}{ev.key.name}
              </Text>
              <Text style={{ color: "yellow" }}>
                {ev.key.shift ? " S" : "  "}
                {ev.key.ctrl ? " C" : "  "}
                {ev.key.alt ? " A" : "  "}
                {ev.key.meta ? " M" : "  "}
              </Text>
              <Text style={{ dim: true }}> seq={ev.rawHex}</Text>
              <Text style={{ color: ev.consumedBy.startsWith("⚡") ? "green" : "white", bold: ev.consumedBy.startsWith("⚡") }}>
                {" "}→ {ev.consumedBy}
              </Text>
            </Box>
          ))}
        </ScrollView>
      </Box>
    </Box>
  );
}

render(<App />);
