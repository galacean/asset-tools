import path from 'path';
import fse from 'fs-extra';
import url from 'url';
import { ImageTools } from '../dist/lib/index.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
  const img = path.resolve(__dirname, '../example/public/image/1000x1000.jpg');

  const result = await ImageTools.transformImage(img, { width: 100, height: 100, quality: 80, mode: 'contain', format: 'webp' });

  fse.writeFileSync(path.resolve(__dirname, './result.jpg'), result);
}

main();