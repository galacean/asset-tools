import { Document } from "@gltf-transform/core";
import { textureCompress } from "@gltf-transform/functions";
import sharp from "sharp";

/**
 * 图片纹理优化
 * @param document gltf-transform document
 * @param options
 * @param options.resize 图片缩放尺寸
 * @param options.format 图片格式
 */
export async function textureTransform(
  document: Document,
  options: {
    resize: 256 | 512 | 1024 | 2048,
    format: 'webp' | 'jpeg' | 'png',
    quality?: number,
  }
) {
  const { resize = 512, format = 'webp', quality } = options || {};
  await document.transform(
    // Convert textures to WebP (Requires glTF Transform v3 and Node.js).
    textureCompress({
      encoder: sharp,
      targetFormat: format,
      resize: [resize, resize],
      quality
    }),
  );

}
