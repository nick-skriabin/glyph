import React, { useState } from "react";
import {
  render,
  Box,
  Text,
  Input,
  Button,
  Checkbox,
  Select,
  JumpNav,
  Keybind,
} from "@nick-skriabin/glyph";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("us");
  const [newsletter, setNewsletter] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name && email && terms) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setCountry("us");
    setNewsletter(false);
    setTerms(false);
    setSubmitted(false);
  };

  return (
    <JumpNav activationKey="ctrl+o">
      <Box style={{ flexDirection: "column", padding: 1 }}>
        {/* Header */}
        <Box style={{ marginBottom: 1 }}>
          <Text style={{ bold: true, color: "cyan" }}>
            JumpNav Demo - Press Ctrl+O to quick-jump
          </Text>
        </Box>

        {/* Instructions */}
        <Box style={{ marginBottom: 1 }}>
          <Text style={{ color: "gray", dim: true }}>
            Tab to navigate • Ctrl+O for jump hints • Escape to cancel
          </Text>
        </Box>

        {submitted ? (
          // Success state
          <Box style={{ flexDirection: "column", gap: 1 }}>
            <Text style={{ color: "green", bold: true }}>
              ✓ Form submitted successfully!
            </Text>
            <Box style={{ flexDirection: "column", paddingLeft: 2 }}>
              <Text>Name: {name}</Text>
              <Text>Email: {email}</Text>
              <Text>Country: {country}</Text>
              <Text>Newsletter: {newsletter ? "Yes" : "No"}</Text>
            </Box>
            <Box style={{ marginTop: 1 }}>
              <Button
                onPress={handleReset}
                style={{ paddingX: 2, bg: "blackBright" }}
                focusedStyle={{ bg: "cyan", color: "black" }}
              >
                <Text>Reset Form</Text>
              </Button>
            </Box>
          </Box>
        ) : (
          // Form
          <Box style={{ flexDirection: "column", gap: 1 }}>
            {/* Name field */}
            <Box style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Text style={{ width: 12, color: "gray" }}>Name</Text>
              <Input
                value={name}
                onChange={setName}
                placeholder="Enter your name"
                style={{ bg: "blackBright", width: 30 }}
                focusedStyle={{ bg: "white", color: "black" }}
              />
            </Box>

            {/* Email field */}
            <Box style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Text style={{ width: 12, color: "gray" }}>Email</Text>
              <Input
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                style={{ bg: "blackBright", width: 30 }}
                focusedStyle={{ bg: "white", color: "black" }}
              />
            </Box>

            {/* Country select */}
            <Box style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Text style={{ width: 12, color: "gray" }}>Country</Text>
              <Select
                items={[
                  { label: "United States", value: "us" },
                  { label: "Canada", value: "ca" },
                  { label: "United Kingdom", value: "uk" },
                  { label: "Germany", value: "de" },
                  { label: "France", value: "fr" },
                  { label: "Japan", value: "jp" },
                  { label: "Australia", value: "au" },
                ]}
                value={country}
                onChange={setCountry}
                style={{ bg: "blackBright", width: 30 }}
                focusedStyle={{ bg: "white", color: "black" }}
                highlightColor="cyan"
              />
            </Box>

            {/* Checkboxes */}
            <Box style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Text style={{ width: 12, color: "gray" }}> </Text>
              <Checkbox
                checked={newsletter}
                onChange={setNewsletter}
                label="Subscribe to newsletter"
                focusedStyle={{ color: "cyan" }}
              />
            </Box>

            <Box style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Text style={{ width: 12, color: "gray" }}> </Text>
              <Checkbox
                checked={terms}
                onChange={setTerms}
                label="I agree to the terms"
                focusedStyle={{ color: "cyan" }}
              />
            </Box>

            {/* Buttons */}
            <Box style={{ flexDirection: "row", gap: 2, marginTop: 1 }}>
              <Text style={{ width: 12 }}> </Text>
              <Button
                onPress={handleSubmit}
                style={{ paddingX: 2, bg: "blackBright" }}
                focusedStyle={{ bg: "green", color: "black", bold: true }}
                disabled={!name || !email || !terms}
              >
                <Text>Submit</Text>
              </Button>
              <Button
                onPress={handleReset}
                style={{ paddingX: 2, bg: "blackBright" }}
                focusedStyle={{ bg: "red", color: "white" }}
              >
                <Text>Cancel</Text>
              </Button>
            </Box>

            {/* Validation hint */}
            {(!name || !email || !terms) && (
              <Box style={{ marginTop: 1, paddingLeft: 13 }}>
                <Text style={{ color: "yellow", dim: true }}>
                  * Fill all required fields and accept terms
                </Text>
              </Box>
            )}
          </Box>
        )}

        {/* Footer */}
        <Box style={{ marginTop: 2 }}>
          <Text style={{ color: "gray", dim: true }}>
            Press Ctrl+C to exit
          </Text>
        </Box>
      </Box>

      <Keybind keypress="ctrl+c" onPress={() => process.exit(0)} />
    </JumpNav>
  );
}

render(<App />);
