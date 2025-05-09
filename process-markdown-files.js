// scripts/process-markdown.cjs
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter'); // For parsing frontmatter

const docsPath = path.resolve(__dirname, 'docs');
const imagesPath = path.resolve(__dirname, 'static');

// --- Settings for forbidden content cleanup ---
const forbiddenHeadings = [
  '## Connections',
  '# Further Reading',
  '# Excalidraw Data',
  '# Development',
  '### Unsorted notes',
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
  let inAdmonition = false;
  const admonitionType = "note" // default type
  let admonitionTitle = '';
  let admonitionContent = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Handle %% comment blocks
    if (trimmed.startsWith('%%')) {
      skippingCommentBlock = !skippingCommentBlock;
      continue;
    }

    if (isForbiddenHeading(trimmed)) {
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

    // Handle Admonition conversion
    if (trimmed.startsWith('> [!') && trimmed.includes(']')) {
      // Start of an admonition
      inAdmonition = true;
      const match = trimmed.match(/> \[!(.+?)\]-\s*(.+)?/);
      if (match) {
        admonitionTitle = match[2] || ''; // Optional title
      }
      continue;
    }

    if (inAdmonition) {
      if (trimmed.startsWith('>')) {
        // Admonition content line
        admonitionContent.push(trimmed.slice(2).trim()); // Remove "> " prefix
      } else {
        // End of admonition
        inAdmonition = false;
        cleanedLines.push(
          `:::${admonitionType}${admonitionTitle ? `[${admonitionTitle}]` : ''}`
        );
        cleanedLines.push('');
        cleanedLines.push(...admonitionContent);
        cleanedLines.push('');
        cleanedLines.push(':::');
        cleanedLines.push('');
        admonitionContent = [];
      }
    }

    if (!inAdmonition) {
      // Process obsidian embed conversion inline
      // Replace (word:: [[obsidian link]]) with [[obsidian link]]
      line = line.replace(/\(\w+::\s*\[\[(.+?)\]\]\)/g, (match, fileName) => {
        return `[[${fileName}]]`;
      });

      // Replace [[obsidian link|alias]] or [[obsidian link]] with a converted link
      line = line.replace(/\[\[(.+?)(\|(.+?))?\]\]/g, (match, fileName, _aliasPart, alias) => {
        const linkText = alias || fileName; // Use alias if present, otherwise use file name
        const linkPath = findFilePath(fileName, cache); // Convert file name to link path
        return `[${linkText}](${linkPath})` // Return formatted link 
      });
      cleanedLines.push(line);
    }
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
  // Preprocess the filename: replace spaces with hyphens and remove parentheses
  const cleanFileName = fileName.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '').toLowerCase();
  if (cache.has(cleanFileName)) return cache.get(cleanFileName);

  const normalizedName = normalizeLink(cleanFileName);
  const extension = path.extname(normalizedName);
  if (extension === '.md') {
    const matches = glob.sync(`${docsPath}/**/${normalizedName}`);
    if (matches.length > 0) {
      const relativePath = path.relative(__dirname, matches[0]).replace(/\\/g, '/');
      cache.set(cleanFileName, relativePath);
      return relativePath;
    } else {
      const uncreatedNotePath = path.join('notes', normalizedName).replace(/\\/g, '/');
      cache.set(cleanFileName, uncreatedNotePath);
      return uncreatedNotePath;
    }
  } else if (extension === '.webp') {
    const matches = glob.sync(`${imagesPath}/**/${normalizedName}`);
    if (matches.length > 0) {
      const relativePath = path.relative(imagesPath, matches[0]).replace(/\\/g, '/');
      const staticPath = `/${relativePath}`;
      cache.set(cleanFileName, staticPath);
      return staticPath;
    } else {
      const uncreatedImagePath = path.join('notes', normalizedName);
      cache.set(cleanFileName, uncreatedImagePath);
      return uncreatedImagePath;
    }
  }
}

function processMarkdownFiles() {
  const files = glob.sync(`${docsPath}/**/*.md`);
  const cache = new Map();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);

    // Skip processing if "SiteProcssed" is true in frontmatter
    if (frontmatter.SiteProcssed === true) {
      console.log(`⏩ Skipping already processed file: ${path.relative(docsPath, file)}`);
      return;
    }

    // Handle "publish" field: convert to "draft" and reverse the value
    if (frontmatter.publish !== undefined) {
      frontmatter.draft = !frontmatter.publish; // Reverse the value
      delete frontmatter.publish; // Remove the "publish" field
    }

    // Empty the "tags" field
    frontmatter.tags = [];

    const updatedContent = cleanAndConvertMarkdown(markdownContent, cache);

    if (markdownContent !== updatedContent || frontmatter.draft !== undefined || frontmatter.id || frontmatter.tags) {
      // Add "SiteProcssed: true" to the frontmatter
      const updatedFrontmatter = { ...frontmatter, SiteProcssed: true };
      const updatedFile = matter.stringify(updatedContent, updatedFrontmatter);

      fs.writeFileSync(file, updatedFile, 'utf8');
      console.log(`✅ Processed and updated file: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🛠 Finished processing ${files.length} markdown file(s).`);
}

processMarkdownFiles();
