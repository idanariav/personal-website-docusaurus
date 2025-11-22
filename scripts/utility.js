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
const obsidianCommentPattern = '%%'
const admonitionHeadingPattern = /> \[!(.+?)\]-\s*(.+)?/;

function isHeading(line) {
  return /^#{1,6}\s/.test(line);
}

function isForbiddenHeading(line) {
  return forbiddenHeadings.includes(line);
}

function handleCommentBlocks(trimmed, skippingCommentBlock) {
  if (trimmed.startsWith(obsidianCommentPattern)) {
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

function handleAdmonitionStart(trimmed, inAdmonition) {
  const isAdmonitionStart = !inAdmonition && trimmed.startsWith('> [!') && trimmed.includes(']')
  return isAdmonitionStart
}

function handleAdmonitionContent(inAdmonition, admonitionContent, cleanedLines, admonitionType, admonitionTitle) {
    cleanedLines.push(
    `:::${admonitionType}${admonitionTitle ? `[${admonitionTitle}]` : ''}`
  );
    cleanedLines.push('');
    cleanedLines.push(...admonitionContent);
    cleanedLines.push('');
    cleanedLines.push(':::');
    cleanedLines.push('');
    inAdmonition = false;
    admonitionTitle = '';
    admonitionContent = [];
    // Continue processing the current line as normal (fall through)
  return { inAdmonition, admonitionContent , admonitionTitle};
}

function skipFile(frontmatter) {
  return frontmatter.SiteProcssed === true;
}

function fileRename(fileName) {
  const cleanFileName = fileName.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '').replace(/[',:!]/g, '').toLowerCase();
  return cleanFileName;
}

function findFilePath(fileName, cache) {
  // Preprocess the filename: replace spaces with hyphens and remove parentheses
  const cleanFileName = fileRename(fileName)
  if (cache.has(cleanFileName)) return cache.get(cleanFileName);

  const normalizedName = normalizeLink(cleanFileName);
  const extension = path.extname(normalizedName).toLowerCase();

  // Use the helper function to handle both cases
  return findPathByExtension(normalizedName, extension, cache);
}

function normalizeLink(fileName) {
  const hasExtension = /\.[^\.\s]+$/.test(fileName);
  const lower = fileName.toLowerCase();
  const isImage = lower.endsWith('.webp');

  if (!hasExtension) return `${fileName}.md`;
  if (isImage) return fileName;
  return fileName;
}

function findPathByExtension(normalizedName, extension, cache, currentFilePath = null) {
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
    const matchPath = matches[0];
    const relativePath = path.relative(folderPath, matchPath).replace(/\\/g, '/');

    let resultPath;
    if (extension === '.webp') {
      // Always absolute for images
      resultPath = `/${relativePath}`;
    } else if (currentFilePath) {
      // Compare folders for markdown files
      const currentFolder = path.dirname(currentFilePath);
      const matchFolder = path.dirname(matchPath);
      if (path.resolve(currentFolder) === path.resolve(matchFolder)) {
        resultPath = `/${relativePath}`;
      } else {
        resultPath = `../${relativePath}`;
      }
    } else {
      // Default to absolute if currentFilePath not provided
      resultPath = `/${relativePath}`;
    }

    cache.set(normalizedName, resultPath);
    return resultPath;
  } else {
    // Not found, return absolute path in defaultFolder
    const uncreatedPath = `/${defaultFolder}/${normalizedName}`.replace(/\\/g, '/');
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

function isIframeLine(line) {
  return /<iframe[\s>]/i.test(line);
}

module.exports = {
  isHeading, isForbiddenHeading, docsPath, imagesPath, handleCommentBlocks, handleForbiddenHeading,
  handleAdmonitionStart, handleAdmonitionContent, skipFile,
  DataviewLinkPattern, obsidianLinkPattern, frontmatterEditor, shouldUpdateFile, blogPath, findFilePath,
  isIframeLine, fileRename, handleAdmonitionStart, obsidianCommentPattern, admonitionHeadingPattern
};