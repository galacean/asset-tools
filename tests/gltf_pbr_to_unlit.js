import path from 'path';
import { getIOinstance, pbr2unlit, onlineUri2localPath } from '../dist/lib/gltf/index.js';

// const url = 'http://127.0.0.1:5173/model/kid.gltf';
const url = 'https://gw.alipayobjects.com/os/H5App-BJ/1640334069506-gltf/scene.gltf';


async function main(source) {
  const doc = await pbr2unlit(source);
  onlineUri2localPath(doc);

  const io = getIOinstance();
  const outPath = path.resolve('./temp');
  await io.write(path.resolve(outPath, 'scene.gltf'), doc)
}

main(url);
