# Antg Asset Tools

## Quick Start

Install:

```shell
npm install --save @galacean/asset-tools
```

Use `@galacean/engine` as an external library: https://gw.alipayobjects.com/os/lib/galacean/engine/0.9.11/dist/browser.js

Import:

```javascript
import { transformGlTFtoGlB, GlTFViewer } from '@alipay/antg-asset-tools';
```

Usage:

1. transform glTF to glB

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

2. glTF viewer

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

3. glTF parser and transformer

**node.js 环境可用**

```typescript
import { Document, JSONDocument } from '@gltf-transform/core';
import { parse, textureTransform } from '@galacean/asset-tools/node';

const document: Document = await parse('./your_gltf.gltf', 'document');

const jsonData: JSONDocument = await parse('./your_gltf.gltf', 'json');

// 优化 glTF 里用到的纹理图片
textureTransform(document, {
  resize: 512,
  format: 'webp',
});

```