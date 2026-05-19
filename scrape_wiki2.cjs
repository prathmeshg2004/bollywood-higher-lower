const https = require('https');
const movies = ['My_Name_Is_Khan'];

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
    });
  });
}

fetchWikiHtml(movies[0]).then(console.log);
