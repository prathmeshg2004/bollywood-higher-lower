const fs = require('fs');
const https = require('https');
const path = require('path');

const newMoviesData = [
  // 2010
  { title: "Dabangg", rating: 7.2 },
  { title: "Golmaal 3", rating: 5.5 },
  { title: "Raajneeti", rating: 7.1 },
  { title: "Housefull", rating: 5.4 },
  
  // 2011
  { title: "Bodyguard", rating: 4.7 },
  { title: "Ready", rating: 4.8 },
  { title: "Ra.One", rating: 4.8 },
  { title: "Don 2", rating: 7.1 },
  { title: "Singham", rating: 6.8 },

  // 2012
  { title: "Ek Tha Tiger", rating: 5.5 },
  { title: "Dabangg 2", rating: 4.8 },
  { title: "Rowdy Rathore", rating: 5.7 },
  { title: "Agneepath", rating: 6.9 },
  { title: "Jab Tak Hai Jaan", rating: 6.7 },

  // 2013
  { title: "Dhoom 3", rating: 5.4 },
  { title: "Chennai Express", rating: 6.0 },
  { title: "Krrish 3", rating: 5.3 },
  { title: "Goliyon Ki Raasleela Ram-Leela", rating: 6.4 },

  // 2014
  { title: "Kick", rating: 5.3 },
  { title: "Happy New Year", rating: 4.9 },
  { title: "Bang Bang!", rating: 5.5 },
  { title: "Singham Returns", rating: 5.7 },

  // 2015
  { title: "Prem Ratan Dhan Payo", rating: 4.4 },
  { title: "Dilwale", rating: 5.1 },
  { title: "Tanu Weds Manu Returns", rating: 7.6 },

  // 2016
  { title: "Sultan", rating: 7.0 },
  { title: "Ae Dil Hai Mushkil", rating: 5.8 },
  { title: "Rustom", rating: 7.1 },
  { title: "M.S. Dhoni: The Untold Story", rating: 7.9 },

  // 2017
  { title: "Tiger Zinda Hai", rating: 5.9 },
  { title: "Golmaal Again", rating: 5.0 },
  { title: "Raees", rating: 6.8 },
  { title: "Toilet: Ek Prem Katha", rating: 7.2 },
  { title: "Judwaa 2", rating: 3.6 },

  // 2018
  { title: "Sanju", rating: 7.7 },
  { title: "Padmaavat", rating: 7.0 },
  { title: "Simmba", rating: 5.6 },
  { title: "Thugs of Hindostan", rating: 4.0 },
  { title: "Race 3", rating: 1.9 },

  // 2019
  { title: "War", rating: 6.5 },
  { title: "Kabir Singh", rating: 7.1 },
  { title: "Bharat", rating: 4.7 },
  { title: "Good Newwz", rating: 6.8 },

  // 2020
  { title: "Baaghi 3", rating: 2.1 },
  { title: "Street Dancer 3D", rating: 3.5 },
  { title: "Shubh Mangal Zyada Saavdhan", rating: 5.8 },
  { title: "Malang", rating: 6.5 },

  // 2021
  { title: "Sooryavanshi", rating: 6.1 },
  { title: "Antim: The Final Truth", rating: 6.6 },
  { title: "Chandigarh Kare Aashiqui", rating: 6.8 },
  { title: "Tadap", rating: 5.9 },

  // 2022 and 2023 were completely covered by previous list.

  // 2024
  { title: "Teri Baaton Mein Aisa Uljha Jiya", rating: 6.5 },
  { title: "Yodha", rating: 6.0 },

  // 2025
  { title: "War 2", rating: 6.8 },
  { title: "Kick 2", rating: 5.5 },
  { title: "Krrish 4", rating: 6.0 },
  { title: "Animal Park", rating: 6.4 },

  // 2026
  { title: "Tiger vs Pathaan", rating: 7.3 },
  { title: "Don 3", rating: 6.5 },
  { title: "Dhoom 4", rating: 6.2 }
];

async function fetchImdbImage(title) {
  return new Promise((resolve) => {
    let query = encodeURIComponent(title.toLowerCase());
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
          resolve('');
        } catch (e) {
          resolve('');
        }
      });
    }).on('error', () => resolve(''));
  });
}

async function main() {
  const filePath = path.join(__dirname, 'src', 'data', 'movies.js');
  let fileContent = fs.readFileSync(filePath, 'utf8');

  // Parse existing movies
  const arrayMatch = fileContent.match(/export const movies = (\[[\s\S]*?\]);/);
  let existingMovies = [];
  try {
    existingMovies = eval(arrayMatch[1]);
  } catch (e) {
    console.error('Eval failed', e);
    process.exit(1);
  }

  const existingTitles = new Set(existingMovies.map(m => m.title.toLowerCase()));
  
  let nextId = Math.max(...existingMovies.map(m => m.id)) + 1;
  const moviesToAdd = [];

  for (let movie of newMoviesData) {
    if (existingTitles.has(movie.title.toLowerCase())) {
      console.log(`Skipping ${movie.title} (already exists)`);
      continue;
    }

    process.stdout.write(`Fetching ${movie.title}... `);
    const imgUrl = await fetchImdbImage(movie.title);
    
    if (imgUrl) {
      console.log(`OK`);
    } else {
      console.log(`FAILED`);
    }
    
    moviesToAdd.push({
      id: nextId++,
      title: movie.title,
      rating: movie.rating,
      image: imgUrl || 'https://via.placeholder.com/1080x1920?text=Poster+Not+Found'
    });
  }
  
  const allMovies = [...existingMovies, ...moviesToAdd];
  
  let newContent = `export const movies = [\n`;
  for (let i = 0; i < allMovies.length; i++) {
    const m = allMovies[i];
    newContent += `  { id: ${m.id}, title: '${m.title.replace(/'/g, "\\'")}', rating: ${m.rating}, image: '${m.image}' }${i < allMovies.length - 1 ? ',' : ''}\n`;
  }
  newContent += `];\n`;
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Successfully added ${moviesToAdd.length} movies.`);
}

main();
