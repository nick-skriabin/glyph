import React, { useState } from "react";
import { render, Box, Text, ScrollView, useInput } from "@semos-labs/glyph";
import { Markdown } from "@semos-labs/glyph-markdown";

const DEMO_MD = `\
# Glyph Markdown

A **powerful** markdown renderer for *terminal* user interfaces.
Supports inline \`code\`, **bold**, *italic*, ~~strikethrough~~, and [links](https://github.com).

---

## Code Blocks

### TypeScript

\`\`\`tsx
import { render, Box, Text } from "@semos-labs/glyph";

interface AppProps {
  title: string;
  count: number;
}

function App({ title, count }: AppProps) {
  const message = "Hello, " + title + "!";

  // Render a beautiful terminal UI
  return (
    <Box style={{ flexDirection: "column", padding: 1 }}>
      <Text style={{ bold: true, color: "cyan" }}>{message}</Text>
      <Text>Count: {count}</Text>
    </Box>
  );
}

render(<App title="World" count={42} />);
\`\`\`

### Python

\`\`\`python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
    debug: bool = False

def start_server(config: Config) -> None:
    """Start the application server."""
    print(f"Starting on {config.host}:{config.port}")
    if config.debug:
        print("Debug mode enabled")

# Quick start
config = Config(debug=True)
start_server(config)
\`\`\`

### Bash

\`\`\`bash
#!/bin/bash

# Build and deploy script
echo "Building project..."
bun install
bun run build

if [ $? -eq 0 ]; then
  echo "Build successful!"
  bun run deploy --production
else
  echo "Build failed" >&2
  exit 1
fi
\`\`\`

### Rust

\`\`\`rust
use std::collections::HashMap;

#[derive(Debug)]
struct AppState {
    users: HashMap<String, User>,
    config: Config,
}

impl AppState {
    fn new() -> Self {
        Self {
            users: HashMap::new(),
            config: Config::default(),
        }
    }

    fn add_user(&mut self, name: String) -> Result<(), String> {
        if self.users.contains_key(&name) {
            return Err(format!("User {} already exists", name));
        }
        self.users.insert(name.clone(), User::new(name));
        Ok(())
    }
}
\`\`\`

### JSON

\`\`\`json
{
  "name": "@semos-labs/glyph-markdown",
  "version": "0.1.0",
  "dependencies": {
    "unified": "^11.0.5",
    "remark-parse": "^11.0.0"
  },
  "keywords": ["terminal", "markdown", "react"]
}
\`\`\`

---

## Lists

### Unordered

- First item with **bold text**
- Second item with \`inline code\`
- Third item with *italic text*
- Nested content is also supported

### Ordered

1. Clone the repository
2. Install dependencies with \`bun install\`
3. Run the development server
4. Open your terminal and enjoy

### Task List

- [x] Design the API
- [x] Implement markdown parser
- [x] Add syntax highlighting
- [ ] Write comprehensive tests
- [ ] Publish to npm

---

## Blockquote

> The best terminal UIs are built with React.
> They combine the power of components with the beauty of the terminal.

> *"Any sufficiently advanced CLI is indistinguishable from a TUI."*

---

## Table

| Feature          | Status  | Priority |
|------------------|---------|----------|
| Headings         | Done    | High     |
| Code blocks      | Done    | High     |
| Syntax highlight | Done    | High     |
| Lists            | Done    | Medium   |
| Tables           | Done    | Medium   |
| Blockquotes      | Done    | Low      |

---

## Strikethrough

This text has ~~deleted words~~ mixed with normal text.
~~Entire line struck through~~ and then it continues.
Combine it: **~~bold and struck~~** or *~~italic and struck~~*.

---

## Image

![Mountain landscape](https://picsum.photos/id/29/800/400)

---

### Smaller Headings

#### H4 heading
##### H5 heading
###### H6 heading

---

*Built with Glyph — React for the terminal.*
`;

function App() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useInput((key) => {
    if (key.name === "q" || (key.ctrl && key.name === "c")) {
      process.exit(0);
    }

    const halfPage = 10;
    const fullPage = 20;

    if (key.name === "up") setScrollOffset((o) => Math.max(0, o - 1));
    else if (key.name === "down") setScrollOffset((o) => o + 1);
    else if (key.name === "pageup") setScrollOffset((o) => Math.max(0, o - fullPage));
    else if (key.name === "pagedown") setScrollOffset((o) => o + fullPage);
    else if (key.ctrl) {
      if (key.name === "d") setScrollOffset((o) => o + halfPage);
      else if (key.name === "u") setScrollOffset((o) => Math.max(0, o - halfPage));
      else if (key.name === "f") setScrollOffset((o) => o + fullPage);
      else if (key.name === "b") setScrollOffset((o) => Math.max(0, o - fullPage));
    }
  });

  return (
    <ScrollView scrollOffset={scrollOffset} onScroll={setScrollOffset} style={{ flexGrow: 1 }}>
      <Box style={{ flexDirection: "column", padding: 1 }}>
        <Box style={{ justifyContent: "center" }}>
          <Text style={{ bold: true, color: "magentaBright" }}>
            Glyph Markdown Demo
          </Text>
        </Box>

        <Markdown>{DEMO_MD}</Markdown>

        <Text style={{ dim: true }}>
          Press 'q' to quit • ↑/↓ to scroll • C-u/C-d half page
        </Text>
      </Box>
    </ScrollView>
  );
}

render(<App />);
