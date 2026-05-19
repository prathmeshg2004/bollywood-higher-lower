const fs = require('fs');

const dataFilePath = 'C:\\Users\\prath\\.gemini\\antigravity\\scratch\\bollywood-higher-lower\\src\\data\\movies.js';
let content = fs.readFileSync(dataFilePath, 'utf8');

const moviesToRemove = [
  'Guide', 'Pyaasa', 'Black', 'Queen', 'Fighter', 'Krrish 3', 'Bang Bang', 
  'Antim', 'Tadap', 'Yodha', 'Krrish 4', 'Animal Park', 'Tiger vs Oathan', 
  'Don 3', 'Dhoom 4', 'Humraaz', 'Company', 'Bhoot', 'Dus', 'Guru', 'Race', 
  'Jannat', 'Baby', 'Tiger vs Pathan' // Added Pathan just in case of typo "Oathan"
].map(m => m.toLowerCase());

// We will use regex to find blocks or just eval the array and write it back?
// Evaling the array is tricky because we lose formatting and the `export const movies = ` part.
// But since the file is just `export const movies = [...]`, we can extract the array string,
// or we can just iterate line by line.

let lines = content.split('\n');
let newLines = [];
let insideMovie = false;
let currentMovieLines = [];
let skipCurrentMovie = false;

for (let line of lines) {
  if (line.trim().startsWith('{') && line.includes('id:')) {
    insideMovie = true;
    currentMovieLines = [line];
    skipCurrentMovie = false;
    
    // Check if title is on the same line
    let titleMatch = line.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) {
      if (moviesToRemove.includes(titleMatch[1].toLowerCase())) {
        skipCurrentMovie = true;
      }
    }
  } else if (insideMovie) {
    currentMovieLines.push(line);
    let titleMatch = line.match(/title:\s*['"]([^'"]+)['"]/);
    if (titleMatch) {
      if (moviesToRemove.includes(titleMatch[1].toLowerCase())) {
        skipCurrentMovie = true;
      }
    }
    if (line.trim().startsWith('},') || line.trim().startsWith('}')) {
      insideMovie = false;
      if (!skipCurrentMovie) {
        newLines.push(...currentMovieLines);
      } else {
        console.log("Removed movie block ending at line: " + line.trim());
      }
    }
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync(dataFilePath, newLines.join('\n'), 'utf8');
console.log("Done filtering.");
