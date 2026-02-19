import React from "react";
import { render, Box, Text, Table, TableRow, TableCell, useInput } from "@semos-labs/glyph";

function App() {
  useInput((key) => {
    if (key.name === "q" || (key.ctrl && key.name === "c")) {
      process.exit(0);
    }
  });

  return (
    <Box style={{ flexDirection: "column", padding: 1, gap: 2 }}>
      <Text style={{ bold: true, color: "yellowBright" }}>
        ✨ Table Component Demo
      </Text>

      {/* ── Single border (default) ── */}
      <Box style={{ flexDirection: "column", gap: 1 }}>
        <Text style={{ color: "cyan", bold: true }}>Single border:</Text>
        <Table borderColor="cyan">
          <TableRow>
            <TableCell style={{ bold: true }}>Name</TableCell>
            <TableCell style={{ bold: true }}>Role</TableCell>
            <TableCell style={{ bold: true }}>Status</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>Engineer</TableCell>
            <TableCell style={{ color: "green" }}>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob</TableCell>
            <TableCell>Designer</TableCell>
            <TableCell style={{ color: "green" }}>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Charlie</TableCell>
            <TableCell>PM</TableCell>
            <TableCell style={{ color: "red" }}>Away</TableCell>
          </TableRow>
        </Table>
      </Box>

      {/* ── Double border ── */}
      <Box style={{ flexDirection: "column", gap: 1 }}>
        <Text style={{ color: "magenta", bold: true }}>Double border:</Text>
        <Table border="double" borderColor="magenta">
          <TableRow>
            <TableCell style={{ bold: true }}>Language</TableCell>
            <TableCell style={{ bold: true }}>Year</TableCell>
            <TableCell style={{ bold: true }}>Typing</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TypeScript</TableCell>
            <TableCell>2012</TableCell>
            <TableCell>Static</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Rust</TableCell>
            <TableCell>2015</TableCell>
            <TableCell>Static</TableCell>
          </TableRow>
        </Table>
      </Box>

      {/* ── Round border ── */}
      <Box style={{ flexDirection: "column", gap: 1 }}>
        <Text style={{ color: "green", bold: true }}>Round border:</Text>
        <Table border="round" borderColor="green">
          <TableRow>
            <TableCell style={{ bold: true }}>Metric</TableCell>
            <TableCell style={{ bold: true }}>Value</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPU</TableCell>
            <TableCell>42%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Memory</TableCell>
            <TableCell>1.2 GB</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Disk</TableCell>
            <TableCell>67%</TableCell>
          </TableRow>
        </Table>
      </Box>

      <Text style={{ dim: true }}>Press 'q' to quit</Text>
    </Box>
  );
}

render(<App />);
