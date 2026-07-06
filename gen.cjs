const fs = require('fs');
const path = require('path');
const dirPath = 'D:\\TheDesignGallery\\public\\Images\\flyers';
const files = fs.readdirSync(dirPath);
const imageGroups = new Map();
files.forEach(file => {
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  if (!imageGroups.has(name)) {
    imageGroups.set(name, []);
  }
  imageGroups.get(name).push(file);
});
const posters = [];
let id = 1000;
for (const [name, exts] of imageGroups.entries()) {
  let fileToUse = exts.find(f => f.endsWith('.jpg')) || exts[0];
  posters.push({
    id: id++,
    title: 'Flyer',
    category: 'flyer',
    image: `/Images/flyers/${fileToUse}`,
    author: 'Easy'
  });
}
fs.writeFileSync('D:\\TheDesignGallery\\public\\data\\Flyer.json', JSON.stringify({ posters }, null, 2));
console.log('Flyer.json generated with ' + posters.length + ' flyers');
