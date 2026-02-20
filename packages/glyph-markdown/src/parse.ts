import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

const parser = unified().use(remarkParse).use(remarkGfm);

/**
 * Parse a markdown string into an mdast AST.
 * Supports GitHub Flavored Markdown (tables, task lists, strikethrough).
 */
export function parseMarkdown(source: string): Root {
  return parser.parse(source) as Root;
}
