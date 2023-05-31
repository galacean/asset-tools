import { NodeIO, Document, JSONDocument } from '@gltf-transform/core';
import { KHRMaterialsUnlit, KHRMeshQuantization } from '@gltf-transform/extensions';
import fetch from 'node-fetch';

/**
 * gltf-transform IO instance
 * @param options
 * @param options.extensions @gltf-transform/extensions
 */
export const getIOinstance = (function () {
  let instance: NodeIO;
  return function (options: { extensions?: any[] } = {}) {
    if (!instance) {
      instance = new NodeIO(fetch, {});
      instance.setAllowHTTP(true);
      instance.registerExtensions(options.extensions || [KHRMaterialsUnlit, KHRMeshQuantization]);
    }
    return instance;
  };
}());

/**
 * 解析 gltf 文件
 * 支持 url、本地文件路径、json 字符串、json 对象、glb buffer
 * @param source
 * @param targetType 
 */
export async function parse(source: string, targetType: 'json'): Promise<JSONDocument>;
export async function parse(source: string, targetType: 'document'): Promise<Document>;
export async function parse(source: string, targetType: 'json' | 'document') {
  const io = getIOinstance();

  const jsonData = await io.readAsJSON(source);

  if (targetType === 'json') {
    return jsonData;
  }

  const document = await io.readJSON(jsonData);
  return document;
}
