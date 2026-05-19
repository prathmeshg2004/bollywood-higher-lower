const fs = require('fs');
const https = require('https');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'movies.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Parse the movies array from the file content
const arrayMatch = fileContent.match(/export const movies = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
  console.error('Could not parse movies array');
  process.exit(1);
}

let movies = [];
try {
  movies = eval(arrayMatch[1]);
} catch (e) {
  console.error('Eval failed', e);
  process.exit(1);
}

async function fetchImdbImage(title) {
  return new Promise((resolve) => {
    // encodeURIComponent but leave spaces as %20 or +
    const query = encodeURIComponent(title.toLowerCase());
    // IMDb suggestion API uses the first letter of the query
    const firstLetter = query.charAt(0).toLowerCase();
    const url = `https://v3.sg.media-imdb.com/suggestion/${firstLetter}/${query}.json`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.d && json.d.length > 0) {
            for (const item of json.d) {
              if (item.i && item.i.imageUrl) {
                // Get the high-res master image by removing scaling parameters
                let imgUrl = item.i.imageUrl.replace(/\._V1_.*\.jpg/i, '._V1_.jpg');
                return resolve(imgUrl);
              }
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const updatedMovies = [];
  
  for (let movie of movies) {
    console.log(`Fetching IMDb image for: ${movie.title}`);
    const imgUrl = await fetchImdbImage(movie.title);
    if (imgUrl) {
      movie.image = imgUrl;
      console.log(`Found: ${imgUrl}`);
    } else {
      console.log(`Not found for ${movie.title}, keeping old image.`);
    }
    updatedMovies.push(movie);
  }
  
  let newContent = `export const movies = [\n`;
  for (let i = 0; i < updatedMovies.length; i++) {
    const m = updatedMovies[i];
    newContent += `  { id: ${m.id}, title: '${m.title.replace(/'/g, "\\'")}', rating: ${m.rating}, image: '${m.image}' }${i < updatedMovies.length - 1 ? ',' : ''}\n`;
  }
  newContent += `];\n`;
  
  fs.writeFileSync(filePath, newContent);
  console.log('Successfully updated movies.js');
}

main();
