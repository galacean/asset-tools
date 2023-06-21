/**
 * 图片转换
 */
import sharp from 'sharp';

export type ImageTransformOptions = {
  format?: 'webp' | 'jpeg' | 'png',
  width?: number,
  height?: number,
  mode?: 'cover' | 'contain' | 'fill',
  quality?: number,
}

/**
 * 图片转换方法
 * 通过 afts url 参数实现
 * @param imageUrl 图片 url
 * @param options
 * @param options.format 图片格式
 * @param options.width 图片宽度
 * @param options.height 图片高度
 * @param options.scale 图片缩放比例
 * @param options.mode 图片缩放填充模式，cover: 裁剪，contain: 等比填充，fill: 拉伸填充
 * 
 * @returns 
 */
export function transformImageByAftsUrl(imageUrl: string, options: ImageTransformOptions): string {
  if (!imageUrl) {
    throw new Error('imageUrl is required');
  }
  if (typeof imageUrl !== 'string') {
    throw new Error('imageUrl must be a URL string');
  }
  
  const { width, height, mode, format = 'webp', quality } = options || {};

  const [ baseUrl, query ] = imageUrl.split('?');

  const aftsParams: string[] = [];

  // 宽高
  if (width) aftsParams.push(`${width}w`);
  if (height) aftsParams.push(`${height}h`);

  // 缩放模式
  if (aftsParams.length) {
    if (mode === 'contain') {
      aftsParams.push('4e');
    } else if (mode === 'cover') {
      aftsParams.push('1e_1c');
    } else if (mode === 'fill') {
      aftsParams.push('2e');
    } else {
      aftsParams.push('0e');
    }
  }

  // 质量
  if (quality) {
    aftsParams.push(`${quality}q`);
  }

  const aftsParamsStr = aftsParams.join('_');

  if (!aftsParamsStr) {
    return imageUrl;
  }

  let _url = imageUrl;
  if (
    // 多媒体 django
    /fileid=/.test(imageUrl) ||
    /\/\/mdn\.alipay\.com/.test(imageUrl) ||
    /\/\/mdn\.alipayobjects\.com\/uri/.test(imageUrl)
  ) {
    _url = _url.replace('zoom=', 'org=');
    _url = _url + `&zoom=${aftsParamsStr}`;
  } else if (
    // afts，目前主流
    /\/\/gw\.alipayobjects\.com\/mdn\//.test(imageUrl) ||
    /\/\/mdn\.alipayobjects\.com\/afts\//.test(imageUrl) ||
    /\/\/mdn\.alipayobjects\.com\/([^\\/]+)\/afts\//.test(imageUrl)
  ) {
    // /^(.+\/img\/[\w*-]+)(\/.*)?$/
    const m = baseUrl.match(/^(.+\/img\/[\w*-]+)(\/.*)?$/);
    if (m) {
      const mainUrl = m[1]; // afts 图片的基础 url，如 https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*MMa4TKrrkvcAAAAAAAAAAAAADoB5AQ
      let name = aftsParamsStr ? aftsParamsStr : 'original';
      if (format) {
        name += `.${format}`;
      }
      _url = `${mainUrl}/${name}${query ? '?' + query : ''}`;
    }
    
  } else if (
    // 老的 yuyan 上传，目前已经不用了
    /\/\/gw\.alipayobjects\.com\/zos\//.test(imageUrl) ||
    /\/\/gw\.alipayobjects\.com\/os\//.test(imageUrl)
  ) {
    _url = _url.replace(
      /(.+\/)([\w.]+)(@[\w-]+)?(\?.*)?/g,
      `$1$2@${aftsParamsStr}$4`,
    );
  }
  return _url;
}