import { GlTFPreview } from "../src/gltf/GlTFPreview";
import { transformGlTFtoGlB } from "../src/gltf/transformer";

const json = await fetch("/model/duck.gltf").then((res) => res.json());
const resources: Record<string, Uint8Array> = {};

const items = [...json.buffers, ...json.images];

await Promise.all(
  items.map(async (item) => {
    const ab = await fetch(item.uri).then((res) => res.arrayBuffer());
    resources[item.uri] = new Uint8Array(ab);
  })
);

const glb = transformGlTFtoGlB({ json, resources });

const glbBlob = new Blob([glb], { type: "application/octet-stream" });

const glTFPreview = GlTFPreview.getInstance();

await glTFPreview.loadAsset(glbBlob);

document.getElementById("container")!.appendChild(glTFPreview.canvas);

glTFPreview.startPreview();
