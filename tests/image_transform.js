import { transformImageByAftsUrl } from '../dist/module.esm.js';

const Imgs = [
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/aaa/bbb/ccc.png',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/original',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h.web',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h.web?p1=111&p2=222#hash',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h.ccc.web',
];

const resultImgs = Imgs.map((img) => transformImageByAftsUrl(img, { width: 100, height: 100, quality: 80, mode: 'contain' }));

// 以上图片转换结果(baseurl)应该都一样
console.log(resultImgs);
console.log('测试结果：', Array.from(new Set(resultImgs.map(url => url.split('?')[0]))).length === 1 ? 'success' : 'fail');