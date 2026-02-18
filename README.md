<p align="center">
  <img src="images/Glyph.png" alt="Glyph" width="200">
</p>

<h1 align="center">Glyph</h1>

<p align="center">
  <strong>React renderer for interactive terminal UIs in TypeScript</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@semos-labs/glyph"><img src="https://img.shields.io/npm/v/@semos-labs/glyph?color=crimson&logo=npm" alt="npm version"></a>
  <a href="https://github.com/semos-labs/glyph/actions/workflows/test.yml"><img src="https://github.com/semos-labs/glyph/actions/workflows/test.yml/badge.svg" alt="Tests"></a>
  <img src="https://img.shields.io/badge/React-18%2B-61dafb?logo=react&logoColor=white" alt="React 18+">
  <img src="https://img.shields.io/badge/Yoga-Flexbox-mediumpurple?logo=meta&logoColor=white" alt="Yoga Flexbox">
  <img src="https://img.shields.io/badge/TypeScript-First-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
</p>

<p align="center">
  <a href="#why-glyph">Why Glyph</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#examples">Examples</a> &bull;
  <a href="#comparison">Comparison</a> &bull;
  <a href="https://semos.sh/docs/glyph">Docs</a>
</p>

---

Glyph is a React renderer for the terminal. It handles layout, focus, keyboard input, and ships a full component library — write TUI apps the same way you write web apps.

<p align="center">
  <img src="./screehshots/showcase.webp" alt="Glyph showcase — dashboard with progress bars, spinners, and toasts" width="100%">
  <br>
  <sub>A dashboard built entirely with Glyph components</sub>
</p>

---

## Why Glyph

Built for **full-screen, keyboard-driven applications** — dashboards, editors, form wizards, dev tools. Not for simple CLI output or argument parsing.

Everything is declarative: you describe layout and focus order, Glyph handles rendering and navigation.

- **Flexbox layout** — Yoga handles rows, columns, wrapping, alignment, gaps, padding. No coordinate math.
- **Focus system** — Tab navigation, focus scopes, modal trapping, JumpNav (vim-style quick-jump hints).
- **20+ components** — Input, Button, Select, Checkbox, Radio, ScrollView, List, Menu, Progress, Spinner, Image, Toasts, Dialogs, Portal, and more.
- **Character-level diffing** — Double-buffered framebuffer. Only changed cells hit stdout.
- **TypeScript-first** — Every prop, style, and hook is typed.

**How it compares:** Ink uses React + Yoga but ships ~4 components with limited focus. Blessed has widgets but is imperative, unmaintained, and JS-only. Textual (Python) and Bubbletea (Go) serve their ecosystems well; Glyph is the equivalent for TypeScript/React. [Full comparison →](#comparison)

---

## Quick Start

Scaffold a new project:

```bash
bun create @semos-labs/glyph my-app   # or: npm / pnpm / yarn create
cd my-app && bun install && bun dev
```

Or add to an existing project:

```bash
bun add @semos-labs/glyph react
# or: npm install / pnpm add
```

### Hello World

Create `app.tsx`:

```tsx
import React from "react";
import { render, Box, Text, Keybind, useApp } from "@semos-labs/glyph";

function App() {
  const { exit } = useApp();

  return (
    <Box style={{ border: "round", borderColor: "cyan", padding: 1 }}>
      <Text style={{ bold: true, color: "green" }}>Hello, Glyph!</Text>
      <Keybind keypress="q" onPress={() => exit()} />
    </Box>
  );
}

render(<App />);
```

```bash
npx tsx app.tsx
```

A rounded cyan box with bold green text appears. Press `q` to exit.

---

## Getting Started

A form with flexbox layout, text input, a dropdown, and keyboard navigation:

```tsx
import React, { useState } from "react";
import { render, Box, Text, Input, Select, Button, Keybind, useApp } from "@semos-labs/glyph";

function App() {
  const { exit } = useApp();
  const [name, setName] = useState("");
  const [lang, setLang] = useState<string | undefined>();

  return (
    <Box style={{ flexDirection: "column", gap: 1, padding: 1, border: "round", borderColor: "cyan" }}>
      <Text style={{ bold: true }}>New Project</Text>

      <Input value={name} onChange={setName} placeholder="Project name..." />

      <Select
        items={[
          { label: "TypeScript", value: "ts" },
          { label: "JavaScript", value: "js" },
          { label: "Go", value: "go" },
        ]}
        value={lang}
        onChange={setLang}
        placeholder="Language"
      />

      <Box style={{ flexDirection: "row", gap: 2 }}>
        <Button onPress={() => { /* create project */ }}>
          <Text>Create</Text>
        </Button>
        <Button onPress={() => exit()}>
          <Text style={{ dim: true }}>Cancel</Text>
        </Button>
      </Box>

      <Keybind keypress="escape" onPress={() => exit()} />
    </Box>
  );
}

render(<App />);
```

Tab between fields, type to filter the select, Enter to submit. Focus order is automatic.

## Components and Hooks

What Glyph ships:

**Layout & Text** — `<Box>`, `<Text>`, `<Spacer>`
**Form Controls** — `<Input>`, `<Button>`, `<Checkbox>`, `<Radio>`, `<Select>`
**Lists & Menus** — `<List>`, `<Menu>`, `<ScrollView>` (with virtualization)
**Overlays** — `<Portal>`, `<FocusScope>`, `<ToastHost>`, `<DialogHost>`
**Utilities** — `<Keybind>`, `<JumpNav>`, `<Progress>`, `<Spinner>`, `<Image>`
**Hooks** — `useInput`, `useFocus`, `useFocusable`, `useLayout`, `useApp`, `useToast`, `useDialog`

Styling uses a `style` prop with CSS-like flexbox properties: `flexDirection`, `gap`, `padding`, `border`, `bg`, `color`, `bold`, and more. Colors accept named values, hex, RGB, and 256-palette with auto-contrast on colored backgrounds.

**Full API reference and guides:** [semos.sh/docs/glyph](https://semos.sh/docs/glyph)

---

## Examples

| Example | Description | Source |
|---------|-------------|--------|
| **dashboard** | Full task manager using all components | [View →](https://github.com/semos-labs/glyph/tree/main/examples/dashboard) |
| **modal-input** | Modal dialogs with focus trapping | [View →](https://github.com/semos-labs/glyph/tree/main/examples/modal-input) |
| **jump-nav** | Vim-style keyboard hints for navigation | [View →](https://github.com/semos-labs/glyph/tree/main/examples/jump-nav) |
| **forms-demo** | Checkbox, Radio, and form controls | [View →](https://github.com/semos-labs/glyph/tree/main/examples/forms-demo) |
| **virtualized-list** | ScrollView with 10k+ items | [View →](https://github.com/semos-labs/glyph/tree/main/examples/virtualized-list) |
| **showcase** | Progress bars, Spinners, Toasts | [View →](https://github.com/semos-labs/glyph/tree/main/examples/showcase) |

[See all examples →](https://github.com/semos-labs/glyph/tree/main/examples)

```bash
# Run locally
git clone https://github.com/semos-labs/glyph.git && cd glyph
bun install && bun run build
bun run --filter dashboard dev
```

---

## Built with Glyph

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/semos-labs/aion">
        <strong>Aion</strong>
      </a>
      <br>
      <sub>Calendar & time management TUI</sub>
    </td>
    <td align="center">
      <a href="https://github.com/semos-labs/epist">
        <strong>Epist</strong>
      </a>
      <br>
      <sub>Gmail client for your terminal</sub>
    </td>
  </tr>
</table>

<sub>Using Glyph in your project? <a href="https://github.com/semos-labs/glyph/issues">Let us know!</a></sub>

---

## Comparison

Side-by-side with other TUI frameworks:

| | **Glyph** | **Ink** | **Blessed** | **Textual** | **Bubbletea** |
|---|:---:|:---:|:---:|:---:|:---:|
| **Language** | TypeScript | TypeScript | JavaScript | Python | Go |
| **Paradigm** | React (JSX) | React (JSX) | Imperative | Declarative (Python) | Elm architecture |
| **Layout** | Yoga flexbox | Yoga flexbox | Custom grid | CSS subset | Manual (lipgloss) |
| **Built-in components** | 20+ | ~4 (Box, Text, Spacer, Newline) | 30+ (widgets) | 30+ (widgets) | BYO (bubbles library) |
| **Input, Select, Checkbox, …** | ✅ Built-in | ❌ Community packages | ✅ Built-in | ✅ Built-in | ❌ Separate library |
| **Focus system** | ✅ Tab, scopes, trapping | ⚠️ Basic | ⚠️ Basic | ✅ Full | ❌ Manual |
| **JumpNav (vim-hints)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Rendering** | Character-level diffing | Full re-render | Full re-render | Dirty widget re-render | Full re-render |
| **Framebuffer** | ✅ Double-buffered | ❌ | ❌ | ❌ | ❌ |
| **True color (hex, RGB)** | ✅ + auto-contrast | Via chalk | Partial | ✅ | Via lipgloss |
| **Image support** | ✅ Kitty/iTerm2 | ❌ | ❌ | ❌ | ❌ |
| **Toasts & Dialogs** | ✅ Built-in | ❌ | ❌ | ✅ | ❌ |
| **Borders** | 4 styles | ❌ (ink-box) | ✅ | ✅ | Via lipgloss |
| **Maintained** | ✅ Active | ⚠️ Slow | ❌ Abandoned | ✅ Active | ✅ Active |

---

## Architecture

**Render pipeline:** React reconciler → GlyphNode tree → Yoga flexbox layout → framebuffer rasterization → character-level diff → stdout.

Source: `reconciler/`, `layout/`, `paint/`, `runtime/`, `components/`, `hooks/`, `render.ts`. See [docs](https://semos.sh/docs/glyph) for internals.

---

## License

MIT

---

<p align="center">
  <sub>Built with React &bull; Yoga &bull; a lot of ANSI escape codes</sub>
</p>
