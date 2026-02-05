import React, { useState, useCallback } from "react";
import { render, Box, Text, Input, FocusScope, useInput } from "glyph";

function Modal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  useInput((key) => {
    if (key.name === "escape") {
      onClose();
    }
  });

  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        bg: "black",
        zIndex: 10,
      }}
    >
      <Box
        style={{
          width: 50,
          height: 12,
          border: "double",
          borderColor: "yellowBright",
          bg: "black",
          flexDirection: "column",
          padding: 1,
          gap: 1,
        }}
      >
        <Text style={{ bold: true, color: "yellowBright", textAlign: "center" }}>
          Modal Dialog
        </Text>

        <Text style={{ color: "white" }}>Enter your name:</Text>

        <FocusScope trap>
          <Input
            value={name}
            onChange={setName}
            placeholder="Type here..."
            style={{
              border: "single",
              borderColor: "cyan",
              padding: 0,
              width: "100%",
            }}
          />
        </FocusScope>

        {name.length > 0 && (
          <Text style={{ color: "green" }}>Hello, {name}!</Text>
        )}

        <Text style={{ dim: true, textAlign: "center" }}>
          Press ESC to close
        </Text>
      </Box>
    </Box>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  useInput((key) => {
    if (key.name === "q" && !showModal) {
      process.exit(0);
    }
    if (key.name === "m" && !showModal) {
      setShowModal(true);
    }
  });

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <Box
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        border: "round",
        borderColor: "blue",
        padding: 1,
      }}
    >
      <Text style={{ bold: true, color: "blueBright" }}>
        Modal + Input Demo
      </Text>

      <Box style={{ flexGrow: 1, padding: 1, flexDirection: "column", gap: 1 }}>
        <Text style={{ color: "white" }}>
          This demonstrates absolute positioning, zIndex, focus trapping, and text input.
        </Text>
        <Text style={{ color: "cyan" }}>
          Press 'm' to open a modal with a text input.
        </Text>
        <Text style={{ color: "cyan" }}>
          Press 'q' to quit.
        </Text>
      </Box>

      <Box
        style={{
          justifyContent: "center",
          bg: "blue",
        }}
      >
        <Text style={{ color: "white", bold: true }}>
          {showModal ? "Modal is open" : "Press 'm' for modal | 'q' to quit"}
        </Text>
      </Box>

      {showModal && <Modal onClose={handleClose} />}
    </Box>
  );
}

render(<App />);
