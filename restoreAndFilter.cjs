const fs = require('fs');

const mdPath = 'C:\\Users\\prath\\.gemini\\antigravity\\brain\\9075af29-e8ef-49a9-ba7f-31fc3c567f6d\\.system_generated\\steps\\296\\content.md';
const content = fs.readFileSync(mdPath, 'utf8');

// The array starts at line 5: "export const movies = ["
const lines = content.split('\n');
let startIndex = lines.findIndex(l => l.startsWith('export const movies = ['));

// Extract everything from `export const movies = [` to the end
let jsCode = lines.slice(startIndex).join('\n');

// Clean up markdown formatting (if any)
jsCode = jsCode.replace(/```javascript\n/g, '').replace(/```\n/g, '');

const dataFilePath = 'C:\\Users\\prath\\.gemini\\antigravity\\scratch\\bollywood-higher-lower\\src\\data\\movies.js';
fs.writeFileSync(dataFilePath, jsCode, 'utf8');
console.log('Restored movies.js');

// Now, filter it
let currentContent = fs.readFileSync(dataFilePath, 'utf8');

const moviesToRemove = [
  'Guide', 'Pyaasa', 'Black', 'Queen', 'Fighter', 'Krrish 3', 'Bang Bang', 
  'Bang Bang!', 'Antim', 'Antim: The Final Truth', 'Tadap', 'Yodha', 'Krrish 4', 
  'Animal Park', 'Tiger vs Oathan', 'Tiger vs Pathaan', 'Don 3', 'Dhoom 4', 
  'Humraaz', 'Company', 'Bhoot', 'Dus', 'Guru', 'Race', 'Jannat', 'Baby'
].map(m => m.toLowerCase());

// We parse it by removing the `export const movies = ` prefix, evaling, filtering, and writing back
let arrayStr = currentContent.replace('export const movies = ', '').trim();
if (arrayStr.endsWith(';')) arrayStr = arrayStr.slice(0, -1);

let moviesArray = [];
try {
  // eval allows parsing relaxed JSON (unquoted keys, single quotes)
  moviesArray = eval('(' + arrayStr + ')');
} catch (e) {
  console.error("Eval failed", e);
  process.exit(1);
}

const originalLength = moviesArray.length;
moviesArray = moviesArray.filter(m => !moviesToRemove.includes(m.title.toLowerCase()));
const newLength = moviesArray.length;

// Convert back to string
// Use JSON.stringify but we want to format it nicely like the original
let newFileContent = 'export const movies = [\n';
for (let i = 0; i < moviesArray.length; i++) {
  let m = moviesArray[i];
  newFileContent += `  { id: ${m.id}, title: '${m.title.replace(/'/g, "\\'")}', rating: ${m.rating}, image: '${m.image}' }${i < moviesArray.length - 1 ? ',' : ''}\n`;
}
newFileContent += '];\n';

fs.writeFileSync(dataFilePath, newFileContent, 'utf8');
console.log(`Filtered movies.js successfully. Removed ${originalLength - newLength} movies.`);
