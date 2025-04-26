// clean-markdown-sections.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.resolve(__dirname, 'docs');

// The headings that should trigger removal of their sections
const headingsToRemove = [
  '## Connections',
  '# Excalidraw Data',
  '## Development',
  '### 📥Unsorted notes',
  '## Text Elements',
  '## Embedded Files',
  '## Drawing'
];

// This regex matches the headings and captures everything until the next heading
function createRemoveRegex(heading) {
  // Match heading + anything until the next heading (## or ### or #)
  return new RegExp(`${heading.replace(/([#*+?^${}()|[\]\\])/g, '\\$1')}[\\s\\S]*?(?=^#{1,3}\\s|\\Z)`, 'gm');
}

function cleanMarkdown(content) {
  let updatedContent = content;

  headingsToRemove.forEach(heading => {
    const regex = createRemoveRegex(heading);
    updatedContent = updatedContent.replace(regex, '');
  });

  return updatedContent.trim(); // Clean up extra space
}

function cleanMarkdownFiles() {
  const files = glob.sync(`${docsPath}/**/*.md`);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const updated = cleanMarkdown(content);

    if (content !== updated) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`✅ Cleaned unwanted sections in: ${path.relative(docsPath, file)}`);
    }
  });

  console.log(`🧹 Finished cleaning ${files.length} markdown file(s).`);
}

cleanMarkdownFiles();
