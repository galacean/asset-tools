import path from 'path';
import { GltfTools } from '../dist/lib/index.js';

async function fn (source) {
  const document = await GltfTools.parse(path.resolve(source), 'document');
  GltfTools.textureTransform(document, {resize: 512, format: 'webp'});
  //
  const io = GltfTools.getIOinstance();
  await io.write(path.resolve(source.replace('model', 'output').replace('gltf', 'glb')), document);
}

const temp = {
  fish_glb: './example/public/model/fish.glb',
  fish_gltf: './example/public/model/fish.gltf',
  duck: './example/public/model/duck.gltf',
  zhuantai: './example/public/model/zhuantai.gltf',
};

fn(temp.zhuantai);