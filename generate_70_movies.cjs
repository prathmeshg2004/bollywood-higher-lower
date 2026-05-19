const fs = require('fs');
const https = require('https');
const path = require('path');

const movieData = [
  // 10 from 20th century
  { title: "Sholay", rating: 8.1 },
  { title: "Mughal-e-Azam", rating: 8.1 },
  { title: "Mother India", rating: 7.8 },
  { title: "Anand", rating: 8.1 },
  { title: "Guide", rating: 8.4 },
  { title: "Pyaasa", rating: 8.3 },
  { title: "Deewaar", rating: 8.0 },
  { title: "Dilwale Dulhania Le Jayenge", rating: 8.0 },
  { title: "Andaz Apna Apna", rating: 8.0 },
  { title: "Kuch Kuch Hota Hai", rating: 7.5 },
  
  // 20 from 2000-2010
  { title: "Lagaan", rating: 8.1 },
  { title: "Dil Chahta Hai", rating: 8.1 },
  { title: "Kabhi Khushi Kabhie Gham...", rating: 7.4 },
  { title: "Devdas", rating: 7.5 },
  { title: "Munna Bhai M.B.B.S.", rating: 8.1 },
  { title: "Kal Ho Naa Ho", rating: 7.9 },
  { title: "Koi... Mil Gaya", rating: 7.1 },
  { title: "Swades", rating: 8.2 },
  { title: "Main Hoon Na", rating: 7.0 },
  { title: "Veer-Zaara", rating: 7.8 },
  { title: "Black", rating: 8.1 },
  { title: "Rang De Basanti", rating: 8.1 },
  { title: "Lage Raho Munna Bhai", rating: 8.0 },
  { title: "Om Shanti Om", rating: 6.7 },
  { title: "Chak De! India", rating: 8.1 },
  { title: "Taare Zameen Par", rating: 8.3 },
  { title: "Jab We Met", rating: 7.9 },
  { title: "Jodhaa Akbar", rating: 7.5 },
  { title: "3 Idiots", rating: 8.4 },
  { title: "My Name Is Khan", rating: 7.9 },

  // 20 from 2011-2020
  { title: "Zindagi Na Milegi Dobara", rating: 8.2 },
  { title: "Rockstar", rating: 7.7 },
  { title: "Kahaani", rating: 8.1 },
  { title: "Gangs of Wasseypur", rating: 8.2 },
  { title: "Barfi!", rating: 8.1 },
  { title: "Bhaag Milkha Bhaag", rating: 8.2 },
  { title: "Yeh Jawaani Hai Deewani", rating: 7.2 },
  { title: "Queen", rating: 8.1 },
  { title: "PK", rating: 8.1 },
  { title: "Haider", rating: 8.0 },
  { title: "Bajrangi Bhaijaan", rating: 8.1 },
  { title: "Bajirao Mastani", rating: 7.2 },
  { title: "Piku", rating: 7.6 },
  { title: "Dangal", rating: 8.3 },
  { title: "Pink", rating: 8.1 },
  { title: "Hindi Medium", rating: 7.9 },
  { title: "Andhadhun", rating: 8.2 },
  { title: "Uri: The Surgical Strike", rating: 8.2 },
  { title: "Gully Boy", rating: 7.9 },
  { title: "Tanhaji: The Unsung Warrior", rating: 7.5 },

  // 20 from 2021-2026
  { title: "Shershaah", rating: 8.3 },
  { title: "Sardar Udham", rating: 8.4 },
  { title: "83", rating: 7.5 },
  { title: "Gangubai Kathiawadi", rating: 7.8 },
  { title: "The Kashmir Files", rating: 7.9 },
  { title: "Bhool Bhulaiyaa 2", rating: 5.7 },
  { title: "Drishyam 2", rating: 8.2 },
  { title: "Brahmastra Part One: Shiva", rating: 5.6 },
  { title: "Pathaan", rating: 5.9 },
  { title: "Jawan", rating: 7.0 },
  { title: "Animal", rating: 6.6 },
  { title: "Gadar 2", rating: 5.2 },
  { title: "12th Fail", rating: 9.1 },
  { title: "Rocky Aur Rani Kii Prem Kahaani", rating: 6.5 },
  { title: "Dunki", rating: 6.7 },
  { title: "Fighter", rating: 6.5 },
  { title: "Shaitaan", rating: 6.8 },
  { title: "Crew", rating: 6.3 },
  { title: "Bade Miyan Chote Miyan", rating: 4.1 },
  { title: "Maidaan", rating: 8.2 }
];

async function fetchImdbImage(title) {
  return new Promise((resolve) => {
    let query = title.toLowerCase();
    if (title === "3 Idiots") query = "3 idiots";
    if (title === "83") query = "83";
    
    // Some manual overrides to help IMDb search
    if (title === "Gangs of Wasseypur") query = "gangs of wasseypur";
    
    query = encodeURIComponent(query);
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
                // Get the high-res master image
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
  const finalMovies = [];
  let id = 1;
  
  // To avoid hitting API too fast, run sequentially
  for (let movie of movieData) {
    process.stdout.write(`Fetching ${movie.title}... `);
    const imgUrl = await fetchImdbImage(movie.title);
    
    if (imgUrl) {
      console.log(`OK`);
    } else {
      console.log(`FAILED`);
    }
    
    finalMovies.push({
      id: id++,
      title: movie.title,
      rating: movie.rating,
      image: imgUrl || 'https://via.placeholder.com/1080x1920?text=Poster+Not+Found'
    });
  }
  
  let newContent = `export const movies = [\n`;
  for (let i = 0; i < finalMovies.length; i++) {
    const m = finalMovies[i];
    newContent += `  { id: ${m.id}, title: '${m.title.replace(/'/g, "\\'")}', rating: ${m.rating}, image: '${m.image}' }${i < finalMovies.length - 1 ? ',' : ''}\n`;
  }
  newContent += `];\n`;
  
  const filePath = path.join(__dirname, 'src', 'data', 'movies.js');
  fs.writeFileSync(filePath, newContent);
  console.log('Successfully wrote 70 movies to src/data/movies.js');
}

main();
