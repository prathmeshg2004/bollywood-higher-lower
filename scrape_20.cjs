const https = require('https');
const fs = require('fs');

const moviesData = [
  { title: 'Bajirao_Mastani', rating: 7.2, display: 'Bajirao Mastani' },
  { title: 'Piku', rating: 7.6, display: 'Piku' },
  { title: 'Drishyam_(2015_film)', rating: 8.2, display: 'Drishyam' },
  { title: 'Neerja', rating: 7.6, display: 'Neerja' },
  { title: 'Pink_(2016_film)', rating: 8.1, display: 'Pink' },
  { title: 'Hindi_Medium', rating: 7.9, display: 'Hindi Medium' },
  { title: 'Newton_(film)', rating: 7.6, display: 'Newton' },
  { title: 'Raazi', rating: 7.7, display: 'Raazi' },
  { title: 'Badhaai_Ho', rating: 7.9, display: 'Badhaai Ho' },
  { title: 'Tumbbad', rating: 8.2, display: 'Tumbbad' },
  { title: 'Uri:_The_Surgical_Strike', rating: 8.2, display: 'Uri: The Surgical Strike' },
  { title: 'Gully_Boy', rating: 7.9, display: 'Gully Boy' },
  { title: 'Chhichhore', rating: 8.3, display: 'Chhichhore' },
  { title: 'Ludo_(film)', rating: 7.6, display: 'Ludo' },
  { title: 'Shershaah', rating: 8.3, display: 'Shershaah' },
  { title: 'Sardar_Udham', rating: 8.4, display: 'Sardar Udham' },
  { title: 'Gangubai_Kathiawadi', rating: 7.8, display: 'Gangubai Kathiawadi' },
  { title: 'Brahmāstra:_Part_One_–_Shiva', rating: 5.6, display: 'Brahmastra' },
  { title: 'Jawan_(film)', rating: 7.1, display: 'Jawan' },
  { title: 'Animal_(2023_Indian_film)', rating: 6.6, display: 'Animal' }
];

async function fetchWikiHtml(movieObj) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(movieObj.title)}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta property="og:image" content="([^"]+)"/i);
        if (match && match[1]) {
          resolve({ ...movieObj, imgUrl: match[1] });
        } else {
          resolve({ ...movieObj, imgUrl: '' });
        }
      });
    }).on('error', (e) => resolve({ ...movieObj, imgUrl: '' }));
  });
}

async function main() {
  const results = [];
  let id = 11;
  for (const movie of moviesData) {
    const result = await fetchWikiHtml(movie);
    results.push(`  { id: ${id++}, title: '${result.display}', rating: ${result.rating}, image: '${result.imgUrl}' }`);
    console.log(`Fetched ${result.display}`);
  }
  fs.writeFileSync('new_movies.txt', results.join(',\n'));
}

main();
