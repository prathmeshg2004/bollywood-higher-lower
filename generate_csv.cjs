const fs = require('fs');
const content = fs.readFileSync('src/data/movies.js', 'utf8');
const match = content.match(/export const movies = (\[[\s\S]*?\]);/);
if (match) {
  const movies = eval(match[1]);
  let csv = 'sr,Title,IMDb Rating\n';
  movies.forEach((m, i) => {
    csv += `${i + 1},"${m.title}",${m.rating}\n`;
  });
  console.log(csv);
}
