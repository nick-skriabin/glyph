<h1 align="center">@semos-labs/glyph-markdown</h1>

<p align="center">
  <strong>Markdown renderer for <a href="https://github.com/semos-labs/glyph">Glyph</a> terminal UIs</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@semos-labs/glyph-markdown"><img src="https://img.shields.io/npm/v/@semos-labs/glyph-markdown?color=crimson&logo=npm" alt="npm version"></a>
  <img src="https://img.shields.io/badge/React-18%2B-61dafb?logo=react&logoColor=white" alt="React 18+">
  <img src="https://img.shields.io/badge/TypeScript-First-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#api">API</a> &bull;
  <a href="#syntax-highlighting">Syntax Highlighting</a> &bull;
  <a href="#examples">Examples</a>
</p>

---

Render markdown as native Glyph components. Headings, lists, tables, code blocks with syntax highlighting, images, links, and inline formatting — all rendered with proper flexbox layout, focus navigation, and terminal colors.

---

## Features

- **Full GFM support** — Headings, paragraphs, bold, italic, strikethrough, inline code, links, images, blockquotes, ordered/unordered/task lists, tables, thematic breaks.
- **Syntax highlighting** — Powered by [Shiki](https://shiki.style) with TextMate grammars. Loaded lazily — only initializes when code blocks are present.
- **Terminal-native colors** — Custom Shiki theme that outputs ANSI named colors, automatically inheriting your terminal's color scheme.
- **Images** — Rendered via Glyph's `<Image>` component with Kitty/iTerm2 protocol support.
- **Focusable links** — Links are rendered as Glyph `<Link>` components with keyboard navigation and browser opening.
- **Zero config** — Just pass a markdown string. Highlighting, image loading, and link handling work out of the box.

---

## Quick Start

```bash
bun add @semos-labs/glyph-markdown
# or: npm install / pnpm add
```

Requires `@semos-labs/glyph` and `react` as peer dependencies.

```tsx
import React from "react";
import { render, Box } from "@semos-labs/glyph";
import { Markdown } from "@semos-labs/glyph-markdown";

const source = `
# Hello World

A **bold** statement with \`inline code\` and a [link](https://github.com).

\`\`\`typescript
const greeting = "Hello from Glyph!";
console.log(greeting);
\`\`\`
`;

function App() {
  return (
    <Box style={{ padding: 1 }}>
      <Markdown>{source}</Markdown>
    </Box>
  );
}

render(<App />);
```

---

## API

### `<Markdown>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | — | Markdown source string |
| `style` | `Style` | — | Style applied to the outer container |
| `highlight` | `Highlighter \| false \| CreateHighlighterOptions` | `undefined` | Control syntax highlighting behavior |

#### `highlight` prop

| Value | Behavior |
|-------|----------|
| `undefined` | Auto-loads Shiki lazily when code blocks are present |
| `false` | Disable syntax highlighting entirely |
| `{ langs: [...], theme: "..." }` | Auto-load with custom Shiki options |
| `Highlighter` instance | Use a pre-created highlighter |

### `createHighlighter(options?)`

Create a Shiki highlighter instance manually. Useful when you need to share a single instance across multiple `<Markdown>` components.

```tsx
import { createHighlighter } from "@semos-labs/glyph-markdown";

const hl = await createHighlighter({ langs: ["tsx", "python", "bash"] });

<Markdown highlight={hl}>{source1}</Markdown>
<Markdown highlight={hl}>{source2}</Markdown>
```

### `parseMarkdown(source)`

Parse a markdown string into an mdast AST. Useful for custom rendering or analysis.

```tsx
import { parseMarkdown } from "@semos-labs/glyph-markdown";

const ast = parseMarkdown("# Hello **world**");
```

---

## Syntax Highlighting

Highlighting is powered by Shiki and loaded lazily — the WASM grammar engine only initializes when your document contains code blocks. Code blocks render immediately as plain text, then re-render with highlighting once Shiki is ready.

The default theme uses terminal-native ANSI colors, so highlighting adapts to your terminal's color scheme. You can also use any built-in Shiki theme:

```tsx
<Markdown highlight={{ theme: "github-dark" }}>{source}</Markdown>
```

### Supported languages

The default configuration loads a common set of languages: TypeScript, JavaScript, TSX, JSX, Python, Rust, Go, Bash, JSON, YAML, HTML, CSS, SQL, Markdown, and more. Pass a custom `langs` array to control exactly which grammars are loaded.

---

## Examples

### Minimal

```tsx
<Markdown>{`# Title\n\nSome **bold** text.`}</Markdown>
```

### With ScrollView

```tsx
import { ScrollView, useInput } from "@semos-labs/glyph";

function App() {
  const [offset, setOffset] = useState(0);

  useInput((key) => {
    if (key.name === "down") setOffset((o) => o + 1);
    if (key.name === "up") setOffset((o) => Math.max(0, o - 1));
  });

  return (
    <ScrollView scrollOffset={offset} onScroll={setOffset} style={{ flexGrow: 1 }}>
      <Markdown>{longDocument}</Markdown>
    </ScrollView>
  );
}
```

### No highlighting

```tsx
<Markdown highlight={false}>{source}</Markdown>
```

### Custom languages only

```tsx
<Markdown highlight={{ langs: ["typescript", "python"] }}>{source}</Markdown>
```

---

## Supported Markdown Features

| Feature | Syntax | Rendering |
|---------|--------|-----------|
| Headings | `# H1` through `###### H6` | Colored with number icons (❶ ❷ ❸ ...) |
| Bold | `**text**` | Bold terminal attribute |
| Italic | `*text*` | Italic terminal attribute |
| Strikethrough | `~~text~~` | ANSI strikethrough + dim |
| Inline code | `` `code` `` | Yellow highlighted |
| Code blocks | ```` ```lang ```` | Shiki syntax highlighting in bordered box |
| Links | `[text](url)` | Focusable, opens in browser on Enter/Space |
| Images | `![alt](url)` | Glyph Image component (Kitty/iTerm2) |
| Blockquotes | `> text` | Indented with `│` prefix |
| Unordered lists | `- item` | Bullet points (`•`) |
| Ordered lists | `1. item` | Numbered |
| Task lists | `- [x] done` | Checkbox icons (☑ ☐) |
| Tables | GFM tables | Glyph Table component with borders |
| Thematic breaks | `---` | Horizontal rule |

---

## License

MIT

---

<p align="center">
  <sub>Part of the <a href="https://github.com/semos-labs/glyph">Glyph</a> ecosystem &bull; React for the terminal</sub>
</p>
