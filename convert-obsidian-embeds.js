// smart-convert-obsidian-embeds.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.resolve(__dirname, 'docs'); // Now search entire docs!

// STEP 1: Build a smarter file cache with full relative paths
let fileCache = new Map();

function buildFileCache() {
  const files = glob.sync(`${docsPath}/**/*.{md,webp,png,jpg,jpeg,gif}`, { nodir: true });
  files.forEach(file => {
    const relativeToDocs = path.relative(docsPath, file).replace(/\\/g, '/'); // normalize Windows paths
    const fileNameOnly = path.basename(file).toLowerCase(); // cache by filename only
    if (!fileCache.has(fileNameOnly)) {
      fileCache.set(fileNameOnly, relativeToDocs);
    }
  });
  console.log(`📚 Cached ${fileCache.size} files for quick lookup`);
}

// STEP 2: Normalize input link
function normalizeLinkName(raw) {
  // Remove parentheses with "::", e.g. (jump:: [[link]]) => [[link]]
  const cleaned = raw.replace(/\([^)]+::\s*/, ''); // remove (something::
  return cleaned.trim();
}

// STEP 3: Convert embeds using smart file lookup
function convertEmbeds(content) {
  return content.replace(/!\[\[(.+?)\]\]/g, (match, rawLink) => {
    const cleanedLink = normalizeLinkName(rawLink);

    let filename = cleanedLink.trim();

    // Assume images if they already have image extensions
    const isImage = filename.match(/\.(webp|png|jpg|jpeg|gif)$/i);

    // If no extension, assume it's a markdown
    if (!isImage && !filename.endsWith('.md')) {
      filename += '.md';
    }

    const lowerFilename = filename.toLowerCase();
    const cachedPath = fileCache.get(lowerFilename);

    if (cachedPath) {
      const linkPath = `/docs/${cachedPath}`;

      if (isImage) {
        return `![${path.basename(filename)}](${linkPath})`;
      } else {
        const title = path.basename(filename, '.md');
        return `[${title}](${linkPath})`;
      }
    } else {
      console.warn(`⚠️ File not found for link: ${cleanedLink}`);
      // fallback: show plain text title
      return cleanedLink.replace(/\.(md|webp|png|jpg|jpeg|gif)$/i, '');
    }
  });
}

// STEP 4: Process markdown files
function processMarkdownFiles() {
  buildFileCache();

  const allFiles = glob.sync(`${docsPath}/**/*.md`);

  allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const updated = convertEmbeds(content);

    if (content !== updated) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`✅ Converted embeds in: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🏁 Finished processing ${allFiles.length} markdown file(s).`);
}

processMarkdownFiles();
