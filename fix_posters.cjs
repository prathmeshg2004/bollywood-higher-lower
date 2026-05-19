const fs = require('fs');
const https = require('https');
const path = require('path');

const fixes = [
  { title: "Queen", query: "queen 2013" },
  { title: "Animal", query: "animal 2023" },
  { title: "Bodyguard", query: "bodyguard 2011" },
  { title: "Ready", query: "ready 2011" },
  { title: "Kick", query: "kick 2014" },
  { title: "Kick 2", query: "kick 2 2015" }, // Telugu Kick 2
  { title: "Murder", query: "murder 2004" },
  { title: "Don", query: "don 2006" },
  { title: "Welcome", query: "welcome 2007" },
  { title: "Race", query: "race 2008" },
  { title: "Newton", query: "newton 2017" },
  { title: "Super 30", query: "super 30 2019" },
];

async function fetchImdbImage(queryStr) {
  return new Promise((resolve) => {
    let query = encodeURIComponent(queryStr.toLowerCase());
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
  const filePath = path.join(__dirname, 'src', 'data', 'movies.js');
  let fileContent = fs.readFileSync(filePath, 'utf8');

  const arrayMatch = fileContent.match(/export const movies = (\[[\s\S]*?\]);/);
  let movies = [];
  try {
    movies = eval(arrayMatch[1]);
  } catch (e) {
    console.error('Eval failed', e);
    process.exit(1);
  }

  for (let fix of fixes) {
    console.log(`Fixing ${fix.title}...`);
    const imgUrl = await fetchImdbImage(fix.query);
    if (imgUrl) {
      const movie = movies.find(m => m.title.toLowerCase() === fix.title.toLowerCase());
      if (movie) {
        movie.image = imgUrl;
        console.log(`Updated ${fix.title}`);
      } else {
        console.log(`Movie ${fix.title} not found in database.`);
      }
    } else {
      console.log(`Could not find image for ${fix.query}`);
    }
  }

  let newContent = `export const movies = [\n`;
  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    newContent += `  { id: ${m.id}, title: '${m.title.replace(/'/g, "\\'")}', rating: ${m.rating}, image: '${m.image}' }${i < movies.length - 1 ? ',' : ''}\n`;
  }
  newContent += `];\n`;
  
  fs.writeFileSync(filePath, newContent);
  console.log('Fixed posters successfully.');
}

main();
