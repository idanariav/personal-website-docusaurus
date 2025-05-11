// scripts/process-markdown.cjs
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter'); // For parsing frontmatter
const {isHeading, isForbiddenHeading, docsPath, imagesPath, handleCommentBlocks, handleForbiddenHeading,
  handleAdmonitionStart, handleAdmonitionContent, skipFile,
DataviewLinkPattern, obsidianLinkPattern, frontmatterEditor, shouldUpdateFile} = require('utility.js');

const notesFrontmatterConfig = {
  publish: true,
  permalink: false,
  publishDate: false};

function processObsidianLinks(line, cache) {
  // Replace (word:: [[obsidian link]]) with [[obsidian link]]
  line = line.replace(DataviewLinkPattern, (match, fileName) => {
    return `[[${fileName}]]`;
  });

  // Replace [[obsidian link|alias]] or [[obsidian link]] with a converted link
  line = line.replace(obsidianLinkPattern, (match, fileName, _aliasPart, alias) => {
    const linkText = alias || fileName; // Use alias if present, otherwise use file name
    const linkPath = findFilePath(fileName, cache); // Convert file name to link path
    return `[${linkText}](${linkPath})`; // Return formatted link
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

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Handle %% comment blocks
    skippingCommentBlock = handleCommentBlocks(trimmed, skippingCommentBlock);
    if (skippingCommentBlock) continue;

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
    const admonitionStartResult = handleAdmonitionStart(trimmed, inAdmonition, admonitionTitle);
    inAdmonition = admonitionStartResult.inAdmonition;
    admonitionTitle = admonitionStartResult.admonitionTitle;
    if (inAdmonition) continue;

    // Handle Admonition content
    const admonitionContentResult = handleAdmonitionContent(
      trimmed,
      inAdmonition,
      admonitionContent,
      cleanedLines,
      admonitionType,
      admonitionTitle
    );
    inAdmonition = admonitionContentResult.inAdmonition;
    admonitionContent = admonitionContentResult.admonitionContent;

    if (!inAdmonition) {
      // Process obsidian embed conversion inline
      line = processObsidianLinks(line, cache);
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

  // Use the helper function to handle both cases
  return findPathByExtension(normalizedName, extension, cache);
}

function findPathByExtension(normalizedName, extension, cache) {
  let folderPath, defaultFolder;

  if (extension === '.md') {
    folderPath = docsPath;
    defaultFolder = 'notes';
  } else if (extension === '.webp') {
    folderPath = imagesPath;
    defaultFolder = 'notes';
  } else {
    return null; // Unsupported extension
  }

  const matches = glob.sync(`${folderPath}/**/${normalizedName}`);
  if (matches.length > 0) {
    const relativePath = path.relative(extension === '.md' ? __dirname : imagesPath, matches[0]).replace(/\\/g, '/');
    const resultPath = extension === '.webp' ? `/${relativePath}` : relativePath;
    cache.set(normalizedName, resultPath);
    return resultPath;
  } else {
    const uncreatedPath = path.join(defaultFolder, normalizedName).replace(/\\/g, '/');
    cache.set(normalizedName, uncreatedPath);
    return uncreatedPath;
  }
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


