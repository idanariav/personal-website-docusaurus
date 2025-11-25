const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter'); // For parsing frontmatter
const {isHeading, isForbiddenHeading, blogPath, handleForbiddenHeading,
  obsidianLinkPattern, skipFile, frontmatterEditor, shouldUpdateFile, findFilePath, obsidianCommentPattern, convertObsidianImageToMarkdown} = require('./utility.js');

const blogFrontmatterConfig = {
  publish: true,
  permalink: true,
  publishDate: true,
  retag: true
};

function removeObsidianLinks(content, cache = new Map()) {
  const lines = content.split('\n');
  let skippingCommentBlock = false;
  let skip = false;
  let cleanedLines = [];

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

    // Handle forbidden headings
    skip = handleForbiddenHeading(trimmed, skip);
    if (skip) {
      if (isHeading(trimmed) && !isForbiddenHeading(trimmed)) {
        skip = false;
        cleanedLines.push(line);
      }
      continue;
    }

    // First, replace embedded images ![[...]] with markdown image syntax
    line = line.replace(obsidianImageEmbedPattern, (match, fileName) => {
      return convertObsidianImageToMarkdown(match, fileName, null, null, true, cache);
    });

    // Then replace regular [[obsidian link|alias]] or [[obsidian link]] with plain text or image reference
    line = line.replace(obsidianLinkPattern, (match, fileName, _aliasPart, alias) => {
      return convertObsidianImageToMarkdown(match, fileName, _aliasPart, alias, false, cache);
    });

    cleanedLines.push(line);
  }

  return cleanedLines.join('\n');
}

function processBlogFiles() {
  const files = glob.sync(`${blogPath}/**/*.md`);
  const cache = new Map();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);

    // Skip processing if "SiteProcssed" is true in frontmatter
    if (skipFile(frontmatter)) {
      console.log(`⏩ Skipping already processed file: ${path.relative(blogPath, file)}`);
      return;
    }

    // Process frontmatter
    frontmatterEditor(frontmatter, blogFrontmatterConfig);

    const updatedContent = removeObsidianLinks(markdownContent, cache);

    if (shouldUpdateFile(markdownContent, updatedContent, frontmatter, blogFrontmatterConfig)) {
      const updatedFile = matter.stringify(updatedContent, frontmatter);

      fs.writeFileSync(file, updatedFile, 'utf8');
      console.log(`✅ Processed and updated file: ${path.relative(blogPath, file)}`);
    }
  });

  console.log(`🛠 Finished processing ${files.length} blog file(s).`);
}

processBlogFiles();




