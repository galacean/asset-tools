# Antg Asset Tools

## Quick Start

### Install:

```shell
npm install --save @galacean/asset-tools
```

Use `@galacean/engine` as an external library: https://gw.alipayobjects.com/os/lib/galacean/engine/0.9.11/dist/browser.js

### Import:

```javascript
import { transformGlTFtoGlB, GlTFViewer } from '@alipay/antg-asset-tools';
```

### Usage:

#### 1. transform glTF to glB

```javascript
const json = await fetch("/model/duck.gltf").then((res) => res.json());
const resources: Record<string, Uint8Array> = {};

const items = [...json.buffers, ...json.images];

await Promise.all(
  items.map(async (item) => {
    const ab = await fetch(item.uri).then((res) => res.arrayBuffer());
    resources[item.uri] = new Uint8Array(ab);
  })
);

// transform glTF to glB
const glb = transformGlTFtoGlB({ json, resources });
```

#### 2. glTF viewer

```javascript
const glTFPreview = GlTFPreview.getInstance();

document.getElementById("container")!.appendChild(glTFPreview.canvas);

await glTFPreview.loadAsset(glTFUrlOrGlbBlob);

glTFPreview.startPreview();

/** Get snapshot */
glTFPreview.getSnapshot(300, 300).then((snapshotUrl) => {
  // do something
  ...
});
```

See [functions](./docs/classes/GlTFPreview.md) API documentation for more details.

#### 3. gltf/glb parser and transformer

> NOTE: 仅 node.js 环境可用

```typescript
import { Document, JSONDocument } from '@gltf-transform/core';
import { GltfTools } from '@galacean/asset-tools/node';

const document: Document = await GltfTools.parse('./your_gltf.gltf', 'document');

const jsonData: JSONDocument = await GltfTools.parse('./your_gltf.gltf', 'json');

// 优化 glTF 里用到的纹理图片
GltfTools.textureTransform(document, {
  resize: 512,
  format: 'webp',
});
```

#### 4. gltf pbr to unlint

> NOTE: 仅 node.js 环境可用

将 gltf pbr 材质转换成 unlint 材质

```typescript
import path from 'path';
import { GltfTools } from '@galacean/asset-tools/node';

const url = 'https://gw.alipayobjects.com/os/H5App-BJ/1640334069506-gltf/scene.gltf';


async function main(source) {
  const doc = await GltfTools.pbr2unlit(source);
}

main(url);
```

#### 5. gltf validator

> NOTE: 仅 node.js 环境可用

gltf 内部检测，具体请查看：https://github.com/KhronosGroup/glTF-Validator

```typescript
import path from 'path';
import { GltfTools } from '@galacean/asset-tools/node';

const url = 'https://gw.alipayobjects.com/os/H5App-BJ/1640334069506-gltf/scene.gltf';


async function main(source) {
  const report = await GltfTools.validate(source);
}

main(url);

// 检测结果：
/*
type ValidationReport = {
	mimeType: string;
	validatorVersion: string;
	validatedAt: string;
	issues: {
	  numErrors: number;
	  numWarnings: number;
	  numInfos: number;
	  numHints: number;
	  messages: any[];
	  truncated: boolean;
	};
	info: {
	  version: string;
	  generator: string;
	  extensionsUsed: string[];
	  resources: any[];
	  animationCount: number;
	  materialCount: number;
	  hasMorphTargets: boolean;
	  hasSkins: boolean;
	  hasTextures: boolean;
	  hasDefaultScene: boolean;
	  drawCallCount: number;
	  totalVertexCount: number;
	  totalTriangleCount: number;
	  maxUVs: number;
	  maxInfluences: number;
	  maxAttributes: number;
	};
}; 
 */
```


#### 6. image transformer

##### 6.1 transformImageByAftsUrl

通过 afts 参数，实现图片的缩放、裁剪、格式转换、压缩等功能。

```typescript
import { transformImageByAftsUrl } from '@galacean/asset-tools';

const Imgs = [
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/aaa/bbb/ccc.png',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/original',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h.web',
  'https://mdn.alipayobjects.com/huamei_p0cigc/afts/img/A*Lq5LS7PWLkEAAAAAAAAAAAAADoB5AQ/200w_200h.ccc.web',
];

const resultImgs = Imgs.map((img) => transformImageByAftsUrl(img, { width: 100, height: 100, quality: 80, mode: 'contain' }));

console.log('结果：', resultImgs);
console.log('一致：', Array.from(new Set(resultImgs)).length === 1 ? 'success' : 'fail')
```
