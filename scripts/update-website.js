const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const {fileRename} = require('./utility.js');

// todo - add support for blog posts and mocs, with dynamic redirection to correct folders
const notesSourceFolders = [
  path.resolve(__dirname, '../../Obsidian_Vault/Content/Notes'),
  path.resolve(__dirname, '../../Obsidian_Vault/Content/MOCs'),
  path.resolve(__dirname, '../../Obsidian_Vault/Sources/Books')
];
const imageSourceFolder = path.resolve(__dirname, '../../Obsidian_Vault/Extras/Media/Images/visuals');
const secondsInHours = 60 * 60
const hoursInDay = 24

const destinationFolder = 'docs';
const imageDestinationFolder = 'static';
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
    return 'mocs';
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

  for (const folder of notesSourceFolders) {
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

async function getImagesFiles(dir) {
  let files = [];
  const entries = await fse.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getImagesFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function copyMissingImages() {
  if (!fs.existsSync(imageSourceFolder) || !fs.statSync(imageSourceFolder).isDirectory()) {
    console.warn(`Image source folder does not exist: ${imageSourceFolder}`);
    return;
  }

  // Recursively get all images in all subfolders
  const imageFiles = await getImagesFiles(imageSourceFolder);

  for (const imagePath of imageFiles) {
    const relativePath = path.relative(imageSourceFolder, imagePath);
    const parentFolder = path.dirname(relativePath); // e.g., "books", "visuals", etc.
    const originalFilename = path.basename(imagePath);
    const renamedFilename = fileRename(originalFilename);

    // Destination folder should mirror the parent folder structure
    const destFolder = path.join(imageDestinationFolder, parentFolder);
    await fse.ensureDir(destFolder);

    const destImagePath = path.join(destFolder, renamedFilename);

    if (!fs.existsSync(destImagePath)) {
      await fse.copy(imagePath, destImagePath);
      console.log(`Copied image: ${imagePath} -> ${destImagePath}`);
    }
  }
}

findAndCopyPublishedFiles()
  .then(copyMissingImages)
  .catch(err => {
    console.error('Error during processing:', err);
  });