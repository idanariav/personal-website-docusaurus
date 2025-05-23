const path = require('path');
const glob = require('glob');

// --- Settings for forbidden content cleanup ---
const forbiddenHeadings = [
  '## Connections',
  '# Further Reading',
  '# Excalidraw Data',
  '# Development',
  '### Unsorted Notes',
  '## Text Elements',
  '## Embedded Files',
  '## Drawing',
  '## Sources'
];

const docsPath = path.resolve('docs');
const imagesPath = path.resolve('static');
const blogPath = path.resolve('blog');
const DataviewLinkPattern = /\(\w+::\s*\[\[(.+?)\]\]\)/g;
const obsidianLinkPattern = /\[\[(.+?)(\|(.+?))?\]\]/g;

function isHeading(line) {
  return /^#{1,6}\s/.test(line);
}

function isForbiddenHeading(line) {
  return forbiddenHeadings.includes(line);
}

function handleCommentBlocks(trimmed, skippingCommentBlock) {
  if (trimmed.startsWith('%%')) {
    return !skippingCommentBlock; // Toggle skippingCommentBlock
  }
  return skippingCommentBlock;
}

function handleForbiddenHeading(trimmed, skip) {
  if (isForbiddenHeading(trimmed)) {
    return true; // Skip this line
  }
  return skip;
}

function handleAdmonitionStart(trimmed, inAdmonition, admonitionTitle) {
  if (trimmed.startsWith('> [!') && trimmed.includes(']')) {
    const match = trimmed.match(/> \[!(.+?)\]-\s*(.+)?/);
    if (match) {
      admonitionTitle = match[2] || ''; // Optional title
    }
    return { inAdmonition: true, admonitionTitle };
  }
  return { inAdmonition, admonitionTitle };
}

function handleAdmonitionContent(trimmed, inAdmonition, admonitionContent, cleanedLines, admonitionType, admonitionTitle) {
  if (inAdmonition) {
    if (trimmed.startsWith('>')) {
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
  return { inAdmonition, admonitionContent };
}

function skipFile(frontmatter) {
  return frontmatter.SiteProcssed === true;
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

function normalizeLink(fileName) {
  const hasExtension = /\.[^\.\s]+$/.test(fileName);
  const isWebp = fileName.toLowerCase().endsWith('.webp');

  if (!hasExtension) return `${fileName}.md`;
  if (isWebp) return fileName;
  return fileName;
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

function frontmatterEditor(frontmatter, config){
  // Convert "publish" to "draft" and reverse its boolean value
  if (config.publish){
    if (frontmatter.publish !== undefined) {
          frontmatter.draft = !frontmatter.publish; // Reverse the value
          delete frontmatter.publish; // Remove the "publish" field
    }
  }
  if (config.permalink){
        // Convert "permalink" to "slug"
    if (frontmatter.permalink !== undefined) {
      frontmatter.slug = frontmatter.permalink; // Copy the value
      delete frontmatter.permalink; // Remove the "permalink" field
    }
  }
    // Convert "PublishDate" to "date"
    if (config.publishDate){
      if (frontmatter.PublishDate !== undefined) {
            frontmatter.date = frontmatter.PublishDate; // Copy the value
            delete frontmatter.PublishDate; // Remove the "PublishDate" field
          }
  }
  // Add "SiteProcssed: true" to the frontmatter
  frontmatter.SiteProcssed = true;
  
// convert "docotags" to "tags"
  if (config.retag){
    frontmatter.tags = frontmatter.docotags;
    delete frontmatter.docotags;
  }
  else {
    frontmatter.tags = [];
  }
}

function shouldUpdateFile(markdownContent, updatedContent, frontmatter, config) {
  // Base condition: check if the content has changed
  let condition = markdownContent !== updatedContent;

  // Add checks based on the config
  if (config.draft) {
    condition = condition || frontmatter.draft !== undefined;
  }
  if (config.permalink) {
    condition = condition || frontmatter.slug !== undefined;
  }
  if (config.publishDate) {
    condition = condition || frontmatter.date !== undefined;
  }
  if (config.tags) {
    condition = condition || frontmatter.tags !== undefined;
  }

  return condition;
}

module.exports = { isHeading, isForbiddenHeading, docsPath, imagesPath, handleCommentBlocks, handleForbiddenHeading,
  handleAdmonitionStart, handleAdmonitionContent, skipFile,
DataviewLinkPattern, obsidianLinkPattern, frontmatterEditor, shouldUpdateFile, blogPath, findFilePath};