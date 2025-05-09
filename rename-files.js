const fs = require('fs');
const path = require('path');

function renameFilesInFolder(folderPath) {
    try {
        // Read all files in the specified folder
        const files = fs.readdirSync(folderPath);

        files.forEach((file) => {
            const oldFilePath = path.join(folderPath, file);

            // Skip directories
            if (!fs.lstatSync(oldFilePath).isFile()) {
                return;
            }

            // Check if the file has a .md or .webp extension
            if (!file.endsWith('.md') && !file.endsWith('.webp')) {
                return;
            }

            // Replace spaces with hyphens and remove parentheses
            const newFileName = file.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '').toLowerCase();
            const newFilePath = path.join(folderPath, newFileName);

            // Rename the file
            fs.renameSync(oldFilePath, newFilePath);
            console.log(`Renamed: "${file}" -> "${newFileName}"`);
        });
    } catch (error) {
        console.error(`An error occurred in folder "${folderPath}": ${error.message}`);
    }
}

function renameFilesInFolders(folderPaths) {
    folderPaths.forEach((folderPath) => {
        console.log(`Processing folder: ${folderPath}`);
        renameFilesInFolder(folderPath);
    });
}

// Specify the list of folder paths
const folderPaths = [
    'docs/mocs', // Replace with your folder paths
    'docs/books',
    'docs/notes',
    'static/books',
    'static/notes',
    'static/posts'
];

renameFilesInFolders(folderPaths);