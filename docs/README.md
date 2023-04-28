@galacean/asset-tools / [Exports](modules.md)

# Antg Asset Tools

## Quick Start

Install:

```shell
tnpm install --save @oasis-engine/asset-tools
```

Use `oasis-engine` as an external library: https://gw.alipayobjects.com/os/lib/oasis-engine/0.9.0-beta.68/dist/browser.min.js

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
