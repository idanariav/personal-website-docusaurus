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

const docsPath = path.resolve(__dirname, 'docs');
const imagesPath = path.resolve(__dirname, 'static');
const blogPath = path.resolve(__dirname, 'blog');
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
        // Convert "permalink" to "slug"
      if (frontmatter.PublishDate !== undefined) {
            frontmatter.date = frontmatter.PublishDate; // Copy the value
            delete frontmatter.PublishDate; // Remove the "PublishDate" field
          }
  }
  // Add "SiteProcssed: true" to the frontmatter
  frontmatter.SiteProcssed = true;
  frontmatter.tags = [];
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