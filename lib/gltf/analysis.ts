import path from 'path';
import fse from 'fs-extra';
import fetch from 'node-fetch';
import * as validator from './validator.js';
import type { ValidationOptions, ValidationReport } from './validator.js';
import { Document } from '@gltf-transform/core';
import { getIOinstance } from './parser.js';

/**
 * 读取文件
 * uri: http url or local file path
 */
async function readFileSizeByUri(uri: string, options?: { basePath?: string }) {
  if (uri.startsWith('http')) {
    const data = await fetch(uri);
    return +(data.headers.get('content-length') || 0);
  } else {
    const _uri = path.join(options?.basePath || '', uri);
    const data = fse.readFileSync(_uri, 'utf-8');
    return data.length;
  }
} 

/**
 * gltf validator
 * https://github.com/KhronosGroup/glTF-Validator
 */
export async function validate(gltf: string, options?: ValidationOptions, IOoptions?: { extensions?: any[] }): Promise<ValidationReport | null>;
export async function validate(gltf: Uint8Array, options?: ValidationOptions, IOoptions?: { extensions?: any[] }): Promise<ValidationReport | null>;
export async function validate(gltf: Document, options?: ValidationOptions, IOoptions?: { extensions?: any[] }): Promise<ValidationReport | null>;
export async function validate(gltf: string | Uint8Array | Document, options?: ValidationOptions, IOoptions?: { extensions?: any[] }) {
  let report: ValidationReport | null = null;
  if (typeof gltf === 'string') {
    // http url or json string or local file path
    if (gltf.startsWith('http')) {
      const jsonObj = await fetch(gltf).then(data => data.json());
      report = await validator.validateString(JSON.stringify(jsonObj), options);
    } else if ( gltf.startsWith('{') || gltf.startsWith('[') ) {
      report = await validator.validateString(gltf, options);
    } else {
      const jsonObj = fse.readJsonSync(gltf, 'utf-8');
      report = await validator.validateString(JSON.stringify(jsonObj), options);
    }
    // const jsonDocument = await parse(gltf, 'json');
    // report = await validator.validateString(JSON.stringify(jsonDocument.json));
  } else if (gltf instanceof Document) {
    const io = getIOinstance();
    io.registerExtensions(IOoptions?.extensions || []);
    const jsonDocument = await io.writeJSON(gltf);
    report = await validator.validateString(JSON.stringify(jsonDocument.json), options);
  } else if (gltf instanceof Uint8Array) {
    report = await validator.validateBytes(gltf, options);
  }
  return report;
}


/**
 * 统计 gltf 总资源大小
 * @param gltf gltf 本地文件路径 or 在线 url or json 字符串
 */
export async function totalSize(gltf: string) {
  let gltfJson: any = null;
  let basePath = '';
  if (gltf.startsWith('http')) {
    gltfJson = await (fetch(gltf).then(data => data.json()));
  } else if ( gltf.startsWith('{') || gltf.startsWith('[') ) {
    gltfJson = JSON.parse(gltf);
  } else {
    gltfJson = fse.readJsonSync(gltf, 'utf-8');
    basePath = path.parse(gltf).dir;
  }
  // 统计 buffer 和 image 的总大小
  let _bufferSize = 0;
  let _imageSize = 0;
  let _gltfSize = JSON.stringify(gltfJson).length;
  let _totalSize = _gltfSize;
  
  const buffers = gltfJson.buffers || [];
  const images = gltfJson.images || [];
  for (const buffer of buffers) {
    _totalSize += buffer.byteLength;
    _bufferSize += buffer.byteLength;
  }
  // images 是 uri，没有 byteLength 属性，需要通过读取文件大小来计算
  for (const image of images) {
    const _size = await readFileSizeByUri(image.uri, { basePath });
    _totalSize += _size;
    _imageSize += _size;
  }

  return {
    gltf: _gltfSize,
    buffers: _bufferSize,
    images: _imageSize,
    total: _totalSize,
  };
}