import path from 'path';
import { validate } from '../dist/lib/gltf/index.js';

const urlOfLocal = path.resolve('./example/public/model/zhuantai.gltf');
const urlOfOnline = 'https://gw.alipayobjects.com/os/H5App-BJ/1640334069506-gltf/scene.gltf';

const main = async (source) => {
  const result = await validate(source);
  console.log(result);
}

main(urlOfOnline);
