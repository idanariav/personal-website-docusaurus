// scripts/process-markdown.cjs
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const docsPath = path.resolve(__dirname, 'docs');

// --- Settings for forbidden content cleanup ---
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

function isHeading(line) {
  return /^#{1,6}\s/.test(line);
}

function isForbiddenHeading(line) {
  return forbiddenHeadings.includes(line);
}

function cleanAndConvertMarkdown(content, cache = new Map()) {
  const lines = content.split('\n');
  let cleanedLines = [];
  let skip = false;
  let skippingCommentBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Handle %% comment blocks
    if (trimmed.startsWith('%%')) {
      skippingCommentBlock = !skippingCommentBlock;
      continue;
    }

    if (isForbiddenHeading(trimmed)) {
      console.log(`❌ Skipping from forbidden heading: "${line.trim()}"`);
      skip = true;
      continue;
    }

    if (skip || skippingCommentBlock) {
      if (isHeading(trimmed) && !isForbiddenHeading(trimmed)) {
        skip = false;
        cleanedLines.push(line);
      }
      continue;
    }

    // Process obsidian embed conversion inline
    line = line.replace(/\(([^\s]+)::\s*\[\[(.+?)\]\]\)/g, (match, _prefix, fileName) => {
      return convertToLink(fileName, cache) || match;
    });

    line = line.replace(/\[\[(.+?)\]\]/g, (match, fileName) => {
      return convertToLink(fileName, cache) || match;
    });

    cleanedLines.push(line);
  }

  return cleanedLines.join('\n');
}

function normalizeLink(fileName) {
  const hasExtension = /\.[^\.\s]+$/.test(fileName);
  const isWebp = fileName.toLowerCase().endsWith('.webp');

  if (!hasExtension) return `${fileName}.md`;
  if (isWebp) return fileName;
  return fileName;
}

function findFilePath(fileName, cache) {
  if (cache.has(fileName)) return cache.get(fileName);

  const normalizedName = normalizeLink(fileName);
  const matches = glob.sync(`${docsPath}/**/${normalizedName}`);

  if (matches.length > 0) {
    const relativePath = path.relative(__dirname, matches[0]).replace(/\\/g, '/');
    cache.set(fileName, relativePath);
    return relativePath;
  } else {
    console.warn(`⚠️ File not found for [[${fileName}]]`);
    cache.set(fileName, null);
    return null;
  }
}

function convertToLink(fileName, cache) {
  const filePath = findFilePath(fileName.trim(), cache);
  if (filePath) {
    return `[${fileName.trim()}](${filePath})`;
  }
  return null;
}

function processMarkdownFiles() {
  const files = glob.sync(`${docsPath}/**/*.md`);
  const cache = new Map();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const updated = cleanAndConvertMarkdown(content, cache);

    if (content !== updated) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`✅ Processed file: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🛠 Finished processing ${files.length} markdown file(s).`);
}

processMarkdownFiles();
