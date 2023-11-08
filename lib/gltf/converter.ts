import { Document, FileUtils, uuid } from "@gltf-transform/core";
import { KHRMaterialsUnlit } from "@gltf-transform/extensions";
import { getIOinstance, parse } from './parser.js';
import { validate } from './analysis.js';

/**
 * 移除未使用的图片
 * @returns 返回未使用的图片索引
 */
async function removeUnusedImages(document: Document, IOoptions?: { extensions?: any[] }) {
  const report = await validate(document, {}, IOoptions);
  if (!report) {
    return;
  }
  
  const textures = document.getRoot().listTextures();
  // 过滤未使用的图片
  const messages = report.issues.messages.filter(item => item.code === 'UNUSED_OBJECT');

  const unusedImages: number[] = [];
  messages.forEach((item) => {
    /*
      {
        code: 'UNUSED_OBJECT',
        message: 'This object may be unused.',
        severity: 2,
        pointer: '/images/0'
      }
     */
    const m = item.pointer.match(/^\/images\/(\d+)/);
    if (m) {
      const sourceIndex = Number(m[1]);
      textures[sourceIndex].dispose();
      unusedImages.push(sourceIndex);
    }
  })
  return unusedImages;
}

/**
 * gltf images bin 在线文件 uri 转换为本地文件 uri
 */
export function onlineUri2localPath(document: Document) {
  const textures = document.getRoot().listTextures();
  const buffers = document.getRoot().listBuffers();

  textures.forEach(t => {
    const uri = t.getURI();
    const b = FileUtils.basename(uri);
    const e = FileUtils.extension(uri); 
    const _uri = `${b || uuid()}${e ? ('.' + e) : ''}`;
    t.setURI(_uri);
  });
  buffers.forEach(b => {
    const uri = b.getURI();
    const _uri = (FileUtils.basename(uri) || uuid()) + '.bin';
    b.setURI(_uri);
  });
}

/**
 * gltf 材质 pbr 转 unlit
 * @param gltf gltf 文件路径、url
 * @param options 
 */
export async function pbr2unlit(gltf: string | Document, options?: { IOExtensions?: any[] }) {
  let document: Document;

  const io = getIOinstance();
  io.registerExtensions(options?.IOExtensions || []);

  if (typeof gltf === 'string') {
    document = await parse(gltf, 'document');
  } else {
    document = gltf;
  }

  // 检查是否已经是 unlit gltf 文件
  const extensionsUsed = document.getRoot().listExtensionsUsed();
  if (extensionsUsed.some((extension) => {
    if (extension instanceof KHRMaterialsUnlit) {
      return true;
    }
  })) {
    console.log('这已经是一个 unlit gltf 文件了');
    return document;
  }

  // 转换
  // 1. Create an KHRMaterialsUnlit Extension attached to the Document.
  const unlitExtension = document.createExtension(KHRMaterialsUnlit);

  // // 2. Create an Unlit property.
  const unlit = unlitExtension.createUnlit();

  // // 3. Attach the property to a Material.
  document.getRoot().listMaterials().forEach((material) => {
    material.setExtension('KHR_materials_unlit', unlit);
    // 4. Remove the PBRMetallicRoughness property.
    material.setMetallicRoughnessTexture(null);
    // @ts-ignore
    material.setMetallicFactor(undefined); // remove metallicFactor
    // @ts-ignore
    material.setRoughnessFactor(undefined); // remove roughnessFactor
    // 5. Remove the NormalTexture property.
    material.setNormalTexture(null);
    // 6. Remove the OcclusionTexture property.
    material.setOcclusionTexture(null);
    // 7. Remove the EmissiveTexture property.
    material.setEmissiveFactor([0, 0, 0]);
    material.setEmissiveTexture(null);
  });

  const unusedImages = await removeUnusedImages(document, { extensions: options?.IOExtensions });
  console.log('unusedImages', unusedImages);

  return document;
}