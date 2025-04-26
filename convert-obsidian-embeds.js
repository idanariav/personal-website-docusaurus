// convert-obsidian-embeds.js
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';

const docsPath = path.resolve(__dirname, 'docs'); // no leading slash

function normalizeLink(fileName) {
  const hasExtension = /\.[^.\s]+$/.test(fileName);
  const isWebp = fileName.toLowerCase().endsWith('.webp');

  if (!hasExtension) {
    return `${fileName}.md`;
  } else if (isWebp) {
    return fileName; // keep webp as-is
  } else {
    return fileName; // already has an extension like .md, .pdf etc.
  }
}

function findFilePath(fileName) {
  const normalizedName = normalizeLink(fileName);
  const matches = glob.sync(`${docsPath}/**/${normalizedName}`);

  if (matches.length > 0) {
    // Found a matching file
    const relativePath = path.relative(path.resolve(__dirname), matches[0]);
    return relativePath.replace(/\\/g, '/'); // ensure forward slashes for links
  } else {
    console.warn(`⚠️  File not found for [[${fileName}]]`);
    return null;
  }
}

function convertEmbeds(content) {
  return content.replace(/\[\[(.+?)\]\]/g, (match, fileName) => {
    const filePath = findFilePath(fileName.trim());
    if (filePath) {
      return `[${fileName.trim()}](${filePath})`;
    } else {
      return match; // Leave the original if file not found
    }
  });
}

function processMarkdownFiles() {
  const files = glob.sync(`${docsPath}/**/*.md`);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const updated = convertEmbeds(content);
    if (content !== updated) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`✅ Converted embeds in: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🛠 Finished converting ${files.length} markdown file(s).`);
}

processMarkdownFiles();
