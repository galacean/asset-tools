import path from 'path';
import { parse, textureTransform, getIOinstance } from '../dist/lib/index.js';

async function fn (source) {
  const document = await parse(path.resolve(source), 'document');
  textureTransform(document, {resize: 512, format: 'webp'});
  //
  const io = getIOinstance();
  await io.write(path.resolve(source.replace('model', 'dist').replace('gltf', 'glb')), document);
}

const temp = {
  fish_glb: './example/public/model/fish.glb',
  fish_gltf: './example/public/model/fish.gltf',
  duck: './example/public/model/duck.gltf',
  zhuantai: './example/public/model/zhuantai.gltf',
};

fn(temp.zhuantai);