// scripts/process-markdown.cjs
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter'); // For parsing frontmatter
const {isHeading, isForbiddenHeading, docsPath, handleAdmonitionStart, handleForbiddenHeading, skipFile,
DataviewLinkPattern, obsidianLinkPattern, frontmatterEditor, shouldUpdateFile, findFilePath, obsidianCommentPattern,
isIframeLine, handleAdmonitionContent, admonitionHeadingPattern, convertObsidianImageToMarkdown} = require('./utility.js');

const notesFrontmatterConfig = {
  publish: true,
  permalink: false,
  publishDate: false,
  retag: false};

function processObsidianLinks(line, cache) {
  // Replace (word:: [[obsidian link]]) with [[obsidian link]]
  line = line.replace(DataviewLinkPattern, (match, fileName) => {
    return `[[${fileName}]]`;
  });

  // Replace [[obsidian link|alias]] or [[obsidian link]] with a converted link
  line = line.replace(obsidianLinkPattern, (match, fileName, _aliasPart, alias) => {
    return convertObsidianImageToMarkdown(match, fileName, _aliasPart, alias, false, cache);
  });

  return line;
}

function cleanAndConvertMarkdown(content, cache = new Map()) {
  const lines = content.split('\n');
  let cleanedLines = [];
  let skip = false;
  let skippingCommentBlock = false;
  let inAdmonition = false;
  const admonitionType = "note"; // default type
  let admonitionTitle = '';
  let admonitionContent = [];

  // Pattern for embedded images: ![[...]]
  const obsidianImageEmbedPattern = /!\[\[(.+?)\]\]/g;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Handle %% comment blocks
    if (trimmed.startsWith(obsidianCommentPattern)) {
      skippingCommentBlock = !skippingCommentBlock;
      continue; // Always skip the line with %%
    }
    if (skippingCommentBlock) continue;

    // Skip lines containing <iframe>
    if (isIframeLine(trimmed)) continue;

    // Handle forbidden headings
    skip = handleForbiddenHeading(trimmed, skip);
    if (skip) {
      if (isHeading(trimmed) && !isForbiddenHeading(trimmed)) {
        skip = false;
        cleanedLines.push(line);
      }
      continue;
    }

    // Handle Admonition start
    if (handleAdmonitionStart(trimmed, inAdmonition)) {
      const match = trimmed.match(admonitionHeadingPattern);
      admonitionTitle = match ? (match[2] || '') : '';
      inAdmonition = true;
      admonitionContent = [];
      continue;
    }

    // Handle Admonition content
    if (inAdmonition) {
      if (trimmed.startsWith('>')) {
        admonitionContent.push(trimmed.slice(2).trim());
        continue;
      } else {
        // End of admonition block
        ({ inAdmonition, admonitionContent, admonitionTitle } = handleAdmonitionContent(inAdmonition, admonitionContent, cleanedLines, admonitionType, admonitionTitle));
      }
    }

    // First, replace embedded images ![[...]] with markdown image syntax
    line = line.replace(obsidianImageEmbedPattern, (match, fileName) => {
      return convertObsidianImageToMarkdown(match, fileName, null, null, true, cache);
    });

    // Then process regular obsidian links
    line = processObsidianLinks(line, cache);
    cleanedLines.push(line);
  }

  // If file ends while still in admonition, close it
  if (inAdmonition) {
     ({ inAdmonition, admonitionContent, admonitionTitle } = handleAdmonitionContent(inAdmonition, admonitionContent, cleanedLines, admonitionType, admonitionTitle));
  }

  return cleanedLines.join('\n');
}

function processMarkdownFiles() {
  const files = glob.sync(`${docsPath}/**/*.md`);
  const cache = new Map();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);

    // Skip processing if "SiteProcssed" is true in frontmatter
    if (skipFile(frontmatter)) {
      console.log(`⏩ Skipping already processed file: ${path.relative(docsPath, file)}`);
      return;
    }

    frontmatterEditor(frontmatter, notesFrontmatterConfig);

    const updatedContent = cleanAndConvertMarkdown(markdownContent, cache);

    if (shouldUpdateFile(markdownContent, updatedContent, frontmatter, notesFrontmatterConfig)) {
      const updatedFile = matter.stringify(updatedContent, frontmatter);

      fs.writeFileSync(file, updatedFile, 'utf8');
      console.log(`✅ Processed and updated file: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🛠 Finished processing ${files.length} markdown file(s).`);
}

processMarkdownFiles();


