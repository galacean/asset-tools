import { GlTFPreview } from "@galacean/asset-tools";

// const resouce = 'https://gw.alipayobjects.com/os/H5App-BJ/1640334069506-gltf/scene.gltf';
const resouce = '/model/unlit_gltf/scene.gltf';

const glTFPreview = GlTFPreview.getInstance();

await glTFPreview.loadAsset(resouce);

glTFPreview.selectAnimation(1);
glTFPreview.playAnimation();

document.getElementById("container")!.appendChild(glTFPreview.canvas);

glTFPreview.startPreview();
