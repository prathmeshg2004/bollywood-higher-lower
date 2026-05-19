const fs = require('fs');
const https = require('https');
const path = require('path');

const newMoviesData = [
  { title: "Gadar: Ek Prem Katha", rating: 7.3 },
  { title: "Nayak: The Real Hero", rating: 7.8 },
  { title: "Aankhen", rating: 7.4 },
  { title: "Saathiya", rating: 7.2 },
  { title: "Humraaz", rating: 6.4 },
  { title: "Company", rating: 8.0 },
  { title: "The Legend of Bhagat Singh", rating: 8.1 },
  { title: "Bhoot", rating: 6.5 },
  { title: "Tere Naam", rating: 7.2 },
  { title: "Baghban", rating: 7.4 },
  { title: "Khakee", rating: 7.4 },
  { title: "Murder", rating: 5.5 },
  { title: "Dhoom", rating: 6.6 },
  { title: "Aitraaz", rating: 6.6 },
  { title: "Mujhse Shaadi Karogi", rating: 6.7 },
  { title: "Bunty Aur Babli", rating: 6.2 },
  { title: "Sarkar", rating: 7.6 },
  { title: "Dus", rating: 5.6 },
  { title: "No Entry", rating: 6.6 },
  { title: "Garam Masala", rating: 6.7 },
  { title: "Fanaa", rating: 7.1 },
  { title: "Phir Hera Pheri", rating: 7.1 },
  { title: "Krrish", rating: 6.4 },
  { title: "Don", rating: 7.2 },
  { title: "Dhoom 2", rating: 6.5 },
  { title: "Vivah", rating: 6.6 },
  { title: "Guru", rating: 7.7 },
  { title: "Namastey London", rating: 7.3 },
  { title: "Heyy Babyy", rating: 6.0 },
  { title: "Bhool Bhulaiyaa", rating: 7.4 },
  { title: "Welcome", rating: 7.0 },
  { title: "Race", rating: 6.7 },
  { title: "Jannat", rating: 7.0 },
  { title: "Singh Is Kinng", rating: 5.7 },
  { title: "Rab Ne Bana Di Jodi", rating: 7.2 },
  { title: "Ghajini", rating: 7.3 },
  { title: "Wake Up Sid", rating: 7.6 },
  { title: "Love Aaj Kal", rating: 6.8 },
  { title: "Wanted", rating: 6.6 },
  { title: "Ajab Prem Ki Ghazab Kahani", rating: 6.3 },
  { title: "De Dana Dan", rating: 5.7 },
  { title: "Ishqiya", rating: 7.3 },
  { title: "Karthik Calling Karthik", rating: 7.1 },
  { title: "Badmaash Company", rating: 6.0 },
  { title: "Once Upon a Time in Mumbaai", rating: 7.4 },
  { title: "Udaan", rating: 8.1 },
  { title: "Delhi Belly", rating: 7.5 },
  { title: "The Dirty Picture", rating: 6.6 },
  { title: "OMG: Oh My God!", rating: 8.1 },
  { title: "Vicky Donor", rating: 7.8 },
  { title: "Special 26", rating: 8.0 },
  { title: "Aashiqui 2", rating: 7.1 },
  { title: "Fukrey", rating: 6.9 },
  { title: "2 States", rating: 6.9 },
  { title: "Ek Villain", rating: 6.5 },
  { title: "Mary Kom", rating: 6.8 },
  { title: "Badlapur", rating: 7.4 },
  { title: "Baby", rating: 7.9 },
  { title: "NH10", rating: 7.2 },
  { title: "Drishyam", rating: 8.2 },
  { title: "Neerja", rating: 7.6 },
  { title: "Kapoor & Sons", rating: 7.7 },
  { title: "Udta Punjab", rating: 7.7 },
  { title: "Bareilly Ki Barfi", rating: 7.5 },
  { title: "Newton", rating: 7.6 },
  { title: "Badhaai Ho", rating: 7.9 },
  { title: "Raazi", rating: 7.7 },
  { title: "Stree", rating: 7.5 },
  { title: "Chhichhore", rating: 8.3 },
  { title: "Super 30", rating: 7.9 }
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
  console.log(`Successfully added ${moviesToAdd.length} movies. Total count is now ${allMovies.length}.`);
}

main();
