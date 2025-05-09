const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter'); // For parsing frontmatter

const blogPath = path.resolve(__dirname, 'blog');

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

function removeObsidianLinks(content) {
  const lines = content.split('\n');
  let skippingCommentBlock = false;
  let skip = false;
  let cleanedLines = [];

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

    // Replace [[obsidian link|alias]] or [[obsidian link]] with plain text
    line = line.replace(/\[\[(.+?)(\|(.+?))?\]\]/g, (match, fileName, _aliasPart, alias) => {
      return alias || fileName; // Use alias if present, otherwise use file name
    });

    cleanedLines.push(line);
  }

  return cleanedLines.join('\n');
}

function processBlogFiles() {
  const files = glob.sync(`${blogPath}/**/*.md`);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);

    // Skip processing if "SiteProcssed" is true in frontmatter
    if (frontmatter.SiteProcssed === true) {
      console.log(`⏩ Skipping already processed file: ${path.relative(blogPath, file)}`);
      return;
    }

    // Convert "publish" to "draft" and reverse its boolean value
    if (frontmatter.publish !== undefined) {
      frontmatter.draft = !frontmatter.publish; // Reverse the value
      delete frontmatter.publish; // Remove the "publish" field
    }

    // Convert "permalink" to "slug"
    if (frontmatter.permalink !== undefined) {
      frontmatter.slug = frontmatter.permalink; // Copy the value
      delete frontmatter.permalink; // Remove the "permalink" field
    }

    // Convert "PublishDate" to "date"
    if (frontmatter.PublishDate !== undefined) {
      frontmatter.date = frontmatter.PublishDate; // Copy the value
      delete frontmatter.PublishDate; // Remove the "PublishDate" field
    }

    // Add "SiteProcssed: true" to the frontmatter
    frontmatter.SiteProcssed = true;
    frontmatter.tags = [];

    const updatedContent = removeObsidianLinks(markdownContent);

    if (markdownContent !== updatedContent || frontmatter.draft !== undefined || frontmatter.slug !== undefined || frontmatter.date !== undefined || frontmatter.tags) {
      const updatedFile = matter.stringify(updatedContent, frontmatter);

      fs.writeFileSync(file, updatedFile, 'utf8');
      console.log(`✅ Processed and updated file: ${path.relative(blogPath, file)}`);
    }
  });

  console.log(`🛠 Finished processing ${files.length} blog file(s).`);
}

processBlogFiles();


