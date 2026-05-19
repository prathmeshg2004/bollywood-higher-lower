const https = require('https');

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

async function fetchImageUrl(title) {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=500`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          const imgUrl = pages[pageId]?.thumbnail?.source;
          resolve({ title, imgUrl });
        } catch (e) {
          resolve({ title, error: e.message });
        }
      });
    }).on('error', (e) => resolve({ title, error: e.message }));
  });
}

async function main() {
  for (const movie of movies) {
    const result = await fetchImageUrl(movie);
    console.log(`Title: ${result.title}, URL: ${result.imgUrl}`);
  }
}

main();
