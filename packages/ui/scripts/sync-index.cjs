const fs = require('fs');
const path = require('path');

// Directory to scan
const directory = path.join(__dirname, '..','src', 'shadcn');

// Function to get all .tsx files recursively
function getTsxFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getTsxFiles(filePath));
    } else if (path.extname(file) === '.tsx' && file !== 'index.tsx') {
      // Get relative path from sadcn directory
      const relativePath = path.relative(directory, filePath);
      // Convert Windows path separators to Unix style
      const normalizedPath = relativePath.split(path.sep).join('/');
      // Remove .tsx extension
      const importPath = './' + normalizedPath.replace('.tsx', '');
      results.push(importPath);
    }
  }

  return results;
}

// Get all .tsx files
const tsxFiles = getTsxFiles(directory);

// Generate export statements
const exportStatements = tsxFiles
  .map((file) => `export * from "${file}";`)
  .join('\n');

// Write to index.tsx
const indexPath = path.join(directory, 'index.tsx');
fs.writeFileSync(indexPath, exportStatements + '\n');

console.log('index.tsx has been generated successfully!');
