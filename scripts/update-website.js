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
const imageSourceFolder = path.resolve(__dirname, '../../Obsidian_Vault/Extras/Media/visuals');

const destinationFolder = 'docs';
const imageDestinationFolder = 'static';

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
  console.log('Checking for published files...');

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

      // Step 1: Check if file should be published
      if (!frontmatter || frontmatter.publish !== true) {
        continue;
      }

      // Determine destination subfolder and ensure it exists
      const subfolder = determineSubfolder(originalFilename);
      const fullDestFolder = path.join(destinationFolder, subfolder);
      await fse.ensureDir(fullDestFolder);

      // Step 2: Get UUID from frontmatter
      const uuid = frontmatter.UUID;
      if (!uuid) {
        console.warn(`Skipping file without UUID: ${filePath}`);
        continue;
      }

      // Step 3 & 4: Check if a file with this UUID already exists in destination
      const existingFiles = await getMarkdownFiles(fullDestFolder);
      let existingFileWithUUID = null;

      for (const existingFile of existingFiles) {
        const existingContent = await fse.readFile(existingFile, 'utf-8');
        const { data: existingFrontmatter } = matter(existingContent);
        if (existingFrontmatter.UUID === uuid) {
          existingFileWithUUID = existingFile;
          break;
        }
      }

      // If UUID doesn't exist, copy the file
      if (!existingFileWithUUID) {
        const normalizedName = fileRename(originalFilename);
        const destFile = path.join(fullDestFolder, normalizedName);
        await fse.copy(filePath, destFile);
        console.log(`Copied new file: ${filePath} -> ${destFile}`);
        continue;
      }

      // Step 5 & 6: Compare Modified dates
      const newModifiedDate = new Date(frontmatter.Modified);
      const existingContent = await fse.readFile(existingFileWithUUID, 'utf-8');
      const { data: existingFrontmatter } = matter(existingContent);
      const existingModifiedDate = new Date(existingFrontmatter.Modified);

      // If new file is more recent, replace the existing one
      if (newModifiedDate > existingModifiedDate) {
        fs.unlinkSync(existingFileWithUUID);
        console.log(`Deleted outdated file: ${existingFileWithUUID}`);

        const normalizedName = fileRename(originalFilename);
        const destFile = path.join(fullDestFolder, normalizedName);
        await fse.copy(filePath, destFile);
        console.log(`Replaced with newer file: ${filePath} -> ${destFile}`);
      }
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
    } else if (entry.isFile()) {
      const name = entry.name.toLowerCase();
      if (name.endsWith('.webp') || name.endsWith('.png')) {
        files.push(fullPath);
      }
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

    // Get file stats
    const sourceStats = await fse.stat(imagePath);
    
    if (!fs.existsSync(destImagePath)) {
      // File doesn't exist, copy it
      await fse.copy(imagePath, destImagePath);
      console.log(`Copied image: ${imagePath} -> ${destImagePath}`);
    } else {
      // File exists, compare modification times
      const destStats = await fse.stat(destImagePath);
      if (sourceStats.mtime > destStats.mtime) {
        await fse.copy(imagePath, destImagePath);
        console.log(`Updated image: ${imagePath} -> ${destImagePath}`);
      }
    }
  }
}

findAndCopyPublishedFiles()
  .then(copyMissingImages)
  .catch(err => {
    console.error('Error during processing:', err);
  });