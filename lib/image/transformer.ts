import sharp from 'sharp';

export type ImageTransformOptions = {
  format?: 'webp' | 'jpeg' | 'png' | 'avif',
  width?: number,
  height?: number,
  mode?: 'cover' | 'contain' | 'fill' | 'inside',
  quality?: number,
}

/**
 * 
 * @param img 图片路径或者 Buffer
 * @param options 
 * @param options.width 图片宽度
 * @param options.height 图片高度
 * @param options.mode 图片缩放填充模式，cover: 裁剪，contain: 等比填充，fill: 拉伸填充
 * @param options.format 图片格式
 * @param options.quality 图片质量
 *
 * @returns 
 */
export async function transformImage(img: string | Buffer, options: ImageTransformOptions): Promise<Buffer>{
  if (!img) {
    throw new Error('img is required');
  }
  if (typeof img !== 'string' && !Buffer.isBuffer(img)) {
    throw new Error('img must be a local path string or Buffer');
  }

  const { width, height, format = 'webp', mode = 'inside', quality  } = options || {};

  // sharp 转换图片
  const sharpImg = sharp(img);

  if (width || height) {
    sharpImg.resize({ width, height, fit: mode });
  }

  if (sharpImg[format]) {
    sharpImg[format]({ quality });
  }
  
  return await sharpImg.toBuffer();
}