import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const MMDC = path.join(process.cwd(), "node_modules/.bin/mmdc");

/**
 * Render a single mermaid diagram string to an SVG string using mmdc.
 * Returns null on failure (caller should preserve the original fenced block).
 */
function renderDiagram(diagram: string): string | null {
  const tmpDir = os.tmpdir();
  const id = `mermaid-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const inFile = path.join(tmpDir, `${id}.mmd`);
  const outFile = path.join(tmpDir, `${id}.svg`);

  try {
    fs.writeFileSync(inFile, diagram, "utf8");
    execSync(`${MMDC} -i "${inFile}" -o "${outFile}" --quiet`, {
      timeout: 30_000,
      stdio: ["ignore", "ignore", "pipe"],
    });
    if (!fs.existsSync(outFile)) return null;
    const svg = fs.readFileSync(outFile, "utf8");
    return svg;
  } catch {
    return null;
  } finally {
    try { fs.unlinkSync(inFile); } catch { /* ignore */ }
    try { fs.unlinkSync(outFile); } catch { /* ignore */ }
  }
}

/**
 * Replace all ```mermaid fenced code blocks in a markdown string with
 * inline SVG wrapped in a <div class="mermaid-diagram"> container.
 * Blocks that fail to render are left as-is (original fenced block).
 */
export function renderMermaidBlocks(markdown: string): string {
  // Match fenced mermaid blocks (``` or ~~~, case-insensitive language tag)
  return markdown.replace(
    /^(`{3}|~{3})[ \t]*mermaid[ \t]*\r?\n([\s\S]*?)\n\1[ \t]*$/gim,
    (_match, _fence, diagram) => {
      const svg = renderDiagram(diagram.trim());
      if (!svg) return _match; // leave original on failure
      return `<div class="mermaid-diagram">\n${svg}\n</div>`;
    }
  );
}
