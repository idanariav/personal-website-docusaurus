const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Folders can be provided via CLI args: `node image-converter.js static images other/folder`
// If none provided, defaults to ['static']
const folderPaths = [
    'static/books', // Replace with your folder paths
    'static/notes',
    'tatic/posts'
];
const quality = 80;               // Adjust quality 0–100
const skipExisting = false;        // If true, skip if .webp already exists

(async () => {
  for (const folder of folderPaths) {
    const resolved = path.resolve(folder);

    if (!fs.existsSync(resolved)) {
      console.warn(`Folder does not exist, skipping: ${resolved}`);
      continue;
    }

    const files = fs.readdirSync(resolved).filter(f => f.toLowerCase().endsWith('.png'));

    for (const file of files) {
      const inputPath = path.join(resolved, file);
      const outputPath = path.join(resolved, file.replace(/\.png$/i, '.webp'));

      if (skipExisting && fs.existsSync(outputPath)) {
        console.log(`Skipped (exists): ${path.join(folder, file)} -> ${path.basename(outputPath)}`);
        continue;
      }
      if (fs.existsSync(outputPath)) {
        console.log(`Removing existing file before conversion: ${path.join(folder, file)} -> ${path.basename(outputPath)}`);
        try { fs.unlinkSync(outputPath); } catch (e) { /* handle */ }
      }
      try {
        await sharp(inputPath)
          .webp({ quality })
          .toFile(outputPath);

        console.log(`Converted: ${path.join(folder, file)} → ${path.basename(outputPath)}`);
      } catch (err) {
        console.error(`Failed to convert ${path.join(folder, file)}: ${err.message}`);
      }
    }
  }

  console.log('Done.');
})();
