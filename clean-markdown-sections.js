// scripts/cleanup-markdown.js
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';

const docsPath = path.resolve('docs'); // Adjust if needed

// Forbidden headings - exact text match
const forbiddenHeadings = [
  '## Connections',
  '# Excalidraw Data',
  '## Development',
  '### 📥Unsorted notes',
  '## Text Elements',
  '## Embedded Files',
  '## Drawing',
  '## Sources'
];

// Helper function: check if a line is a heading (any level)
function isHeading(line) {
  return /^#{1,6}\s/.test(line.trim());
}

// Helper: check if a line matches any forbidden heading
function isForbiddenHeading(line) {
  const trimmed = line.trim();
  return forbiddenHeadings.includes(trimmed);
}

// Main cleanup function
function cleanMarkdownContent(content) {
  const lines = content.split('\n');
  let cleanedLines = [];
  let skip = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isForbiddenHeading(line)) {
      console.log(`🚫 Skipping from forbidden heading: "${line.trim()}"`);
      skip = true;
      continue; // skip the forbidden heading line itself
    }

    if (skip) {
      if (isHeading(line) && !isForbiddenHeading(line)) {
        // Found a new heading, stop skipping
        skip = false;
        cleanedLines.push(line);
      }
      // Otherwise, still skipping (don't push line)
    } else {
      cleanedLines.push(line);
    }
  }

  return cleanedLines.join('\n');
}

function cleanMarkdownSections() {
  const files = glob.sync(`${docsPath}/**/*.md`);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const updated = cleanMarkdownContent(content);

    if (content !== updated) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`✅ Cleaned file: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🛠 Finished cleaning ${files.length} markdown file(s).`);
}

cleanMarkdownSections();
