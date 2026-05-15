const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './images';
const files = fs.readdirSync(imagesDir);

Promise.all(
  files
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .map(f => {
      const input = path.join(imagesDir, f);
      const output = path.join(imagesDir, f.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      return sharp(input)
        .webp({ quality: 80 })
        .toFile(output)
        .then(() => console.log('Convertido: ' + f + ' → ' + path.basename(output)));
    })
).then(() => console.log('Todas as imagens convertidas!'));
