import { GlTFPreview } from "@galacean/asset-tools";

const resouce = '/dist/zhuantai.glb';

const glTFPreview = GlTFPreview.getInstance();

await glTFPreview.loadAsset(resouce);

document.getElementById("container")!.appendChild(glTFPreview.canvas);

glTFPreview.startPreview();
