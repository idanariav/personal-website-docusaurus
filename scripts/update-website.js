const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const {fileRename} = require('./utility.js');

// todo - add support for blog posts and mocs, with dynamic redirection to correct folders
const foldersToCheck = [
  path.resolve(__dirname, '../../Obsidian_Vault/Content/Notes'),
  path.resolve(__dirname, '../../Obsidian_Vault/Content/MOCs'),
  path.resolve(__dirname, '../../Obsidian_Vault/Sources/Books')
];
const secondsInHours = 60 * 60
const hoursInDay = 24

const destinationFolder = 'docs';
const days = 7;

// Utility: get all Markdown files recursively
async function getMarkdownFiles(dir) {
  let files = [];
  const entries = await fse.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function determineSubfolder(originalFilename) {
  if (originalFilename.toLowerCase().endsWith('(moc).md')) {
    return 'moc';
  } else if (originalFilename.toLowerCase().endsWith('(book).md')) {
    return 'books';
  } else {
    return 'notes';
  }
}

// Main logic
async function findAndCopyPublishedFiles() {
    console.log('Checking for recently modified files...');
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * hoursInDay * secondsInHours * 1000);

  for (const folder of foldersToCheck) {
    if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
      console.warn(`Skipping invalid directory: ${folder}`);
      continue;
    }

    const files = await getMarkdownFiles(folder);

    for (const filePath of files) {
      const content = await fse.readFile(filePath, 'utf-8');
      const { data: frontmatter } = matter(content);
      const originalFilename = path.basename(filePath);

      const subfolder = determineSubfolder(originalFilename);
      const fullDestFolder = path.join(destinationFolder, subfolder);

      await fse.ensureDir(fullDestFolder);

      if (!frontmatter || frontmatter.publish !== true || !frontmatter.Modified) continue;

      const modifiedDate = new Date(frontmatter.Modified);
      if (isNaN(modifiedDate.getTime()) || modifiedDate < cutoff) continue;

      const normalizedName = fileRename(originalFilename);
      const destFile = path.join(fullDestFolder, normalizedName);

      if (fs.existsSync(destFile)) {
        fs.unlinkSync(destFile);
        console.log(`Deleted existing file: ${destFile}`);
      }

      await fse.copy(filePath, destFile);
      console.log(`Copied: ${filePath} -> ${destFile}`);
    }
  }

}

findAndCopyPublishedFiles().catch(err => {
  console.error('Error during processing:', err);
});