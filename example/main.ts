import { GlTFPreview } from "../src";
import { transformGlTFtoGlB } from "../src";

const json = await fetch("/model/duck.gltf").then((res) => res.json());
const resources: Record<string, Uint8Array> = {};

const items = [...json.buffers, ...json.images];

await Promise.all(
  items.map(async (item) => {
    const uri = item.uri;
    const ab = await fetch(uri).then((res) => res.arrayBuffer());
    resources[uri] = new Uint8Array(ab);
  })
);

const glb = transformGlTFtoGlB({ json, resources });

const glbBlob = new Blob([glb], { type: "application/octet-stream" });

const url = URL.createObjectURL(glbBlob) + "#.glb";

const glTFPreview = GlTFPreview.getInstance();

await glTFPreview.loadAsset(url);

document.getElementById("container")!.appendChild(glTFPreview.canvas);

glTFPreview.startPreview();

URL.revokeObjectURL(url);
