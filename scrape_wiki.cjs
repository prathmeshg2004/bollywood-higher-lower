const https = require('https');
const fs = require('fs');

const movies = [
  '3_Idiots',
  'Dangal_(film)',
  'Sholay',
  'Lagaan',
  'PK_(film)',
  'Taare_Zameen_Par',
  'Bajrangi_Bhaijaan',
  'Swades',
  'Andhadhun',
  'Dil_Chahta_Hai'
];

async function fetchWikiHtml(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/wiki/${title}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta property="og:image" content="([^"]+)"/i);
        if (match && match[1]) {
          resolve({ title, imgUrl: match[1] });
        } else {
          resolve({ title, error: 'Not found' });
        }
      });
    }).on('error', (e) => resolve({ title, error: e.message }));
  });
}

async function main() {
  const results = {};
  for (const movie of movies) {
    const result = await fetchWikiHtml(movie);
    results[movie] = result.imgUrl || '';
    console.log(`Title: ${result.title}, URL: ${result.imgUrl}`);
  }
  fs.writeFileSync('scraped_urls.json', JSON.stringify(results, null, 2));
}

main();
