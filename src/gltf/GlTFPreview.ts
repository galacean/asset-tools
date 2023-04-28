import {
  AnimationClip,
  AssetType,
  BoundingBox,
  Camera,
  Color,
  Component,
  DiffuseMode,
  DirectLight,
  Entity,
  GLTFResource,
  Renderer,
  Script,
  Vector3,
  WebGLEngine
} from "@galacean/engine";
import { OrbitControl } from "./OrbitControl";

const _tempCenterVec = new Vector3();
const _tempExtVec = new Vector3();

export class GlTFPreview {
  private static _instance: GlTFPreview;

  static getInstance() {
    if (!this._instance) {
      this._instance = new GlTFPreview();
    }
    return this._instance;
  }

  /**
   * Get the current canvas element.
   */
  public readonly canvas: HTMLCanvasElement;

  /**
   * Get the current animation names.
   */
  public get animationNames() {
    return this._animationNames;
  }

  /**
   * Get the current duration.
   */
  public get duration() {
    return this._duration;
  }

  /**
   * Get the current frame time.
   */
  public get frameTime() {
    return this._frameTime;
  }

  /**
   * Get the current playing state.
   */
  public get isPlaying() {
    return this._playing;
  }

  private selectedClip: AnimationClip | null = null;
  private _animationNames: string[] = [];
  private _frameTime = 0;
  private _duration = 0;
  private _playing = false;

  private _engine: WebGLEngine;
  private _boundingBox: BoundingBox = new BoundingBox();
  private _camera: Camera;
  private _cameraEntity: Entity;
  private _controller: OrbitControl;
  private _entity: Entity | null = null;
  private _updateComponent: Component | null = null;
  private _clips: AnimationClip[] = [];
  private _stopped = false;

  private constructor() {
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this._engine = new WebGLEngine(canvas, { preserveDrawingBuffer: true, alpha: true });
    const scene = this._engine.sceneManager.activeScene;
    scene.background.solidColor.set(0, 0, 0, 0);
    const cameraEntity = scene.createRootEntity();
    this._cameraEntity = cameraEntity;
    this._camera = cameraEntity.addComponent(Camera);
    this._controller = cameraEntity.addComponent(OrbitControl);
    this._controller.addDefaultControl();
    const ambientLight = scene.ambientLight;
    ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
    ambientLight.diffuseIntensity = 0.5;
    ambientLight.diffuseMode = DiffuseMode.SolidColor;
    const rootEntity = scene.createRootEntity("root");
    // Init light.
    const directLightEntity = rootEntity.createChild("light");
    directLightEntity.transform.setPosition(-9, 15, 17);
    directLightEntity.transform.lookAt(new Vector3(0, 0, 0));
    const directLightComp = directLightEntity.addComponent(DirectLight);
    directLightComp.color = new Color(1, 1, 1, 1);
    directLightComp.intensity = 1;
  }

  /**
   * Load glTF asset
   * @param glTFAsset - glTF asset url or blob
   * @returns async promise
   */
  async loadAsset(glTFAsset: string | Blob) {
    const url = typeof glTFAsset === "string" ? glTFAsset : URL.createObjectURL(glTFAsset) + "#.glb";
    this._playing = false;
    this.selectedClip = null;
    this._frameTime = 0;
    this._stopped = false;
    return this._engine.resourceManager.load<GLTFResource>({ url: url, type: AssetType.Prefab }).then((glTF) => {
      if (this._stopped) return;
      const { defaultSceneRoot, animations = [] } = glTF;
      this._entity = defaultSceneRoot;
      this._clips = animations;
      this._animationNames = animations.map((clip) => clip.name);
      this._duration = 0;
    });
  }

  /**
   * Start preview glTF asset
   */
  startPreview() {
    if (!this._entity) {
      throw new Error("Please load glTF asset first.");
    }
    const entity = this._entity;
    this._engine.canvas.resizeByClientSize();
    this._engine.sceneManager.activeScene.addRootEntity(entity);
    this._setCameraPosition(entity.clone());
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const glTFPreview = this;
    this._updateComponent = this._entity.addComponent(
      class extends Script {
        onUpdate = (deltaTime: number) => {
          glTFPreview._onUpdate(deltaTime);
        };
      }
    );
    this._engine.run();
  }

  /**
   * Stop preview glTF asset
   */
  stopPreview() {
    this._updateComponent?.destroy();
    this._entity && this._engine.sceneManager.activeScene.removeRootEntity(this._entity);
    this._entity = null;
    this._engine.pause();
    this._stopped = true;
  }

  /**
   * Select animation
   * @param index - animation index
   */
  selectAnimation(index: number) {
    this.selectedClip = this._clips[index];
    this._frameTime = 0;
    this._duration = this.selectedClip.length;
    //@ts-ignore
    // TODO: linked issue: https://github.com/galacean/engine/issues/1134
    this.selectedClip._sampleAnimation(this._entity, 0);
  }

  /**
   * Set frame time
   * @param frameTime - frame time
   */
  setFrameTime(frameTime: number) {
    this._frameTime = frameTime;
    //@ts-ignore
    // TODO: linked issue: https://github.com/galacean/engine/issues/1134
    this.selectedClip._sampleAnimation(this._entity, frameTime);
  }

  /**
   * Play animation
   * @returns
   */
  playAnimation() {
    if (!this.selectedClip) {
      throw new Error("Please select animation first.");
    }
    this._playing = true;
  }

  /**
   * Pause animation
   */
  pauseAnimation() {
    this._playing = false;
  }

  /**
   * Destroy glTF preview
   */
  destroy() {
    this.stopPreview();
    this._engine.destroy();
  }

  /**
   * Get snapshot of the glTF
   * @param width - snapshot width
   * @param height - snapshot height
   * @returns - promise of snapshot base64 url
   */
  getSnapshot(width: number = 500, height: number = 500) {
    if (this._engine.isPaused) {
      throw new Error("Please start preview first.");
    }

    return new Promise((resolve) => {
      const canvas = this.canvas;
      canvas.width = width;
      canvas.height = height;
      this._camera.aspectRatio = width / height;
      setTimeout(() => {
        this._engine.update();
        const url = this.canvas.toDataURL();
        resolve(url);
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
        this._camera.resetAspectRatio();
      });
    });
  }

  private _setCameraPosition(entity: Entity) {
    const boundingBox = this._boundingBox;
    const center = _tempCenterVec;
    const extent = _tempExtVec;

    boundingBox.min.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    boundingBox.max.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    const renderers = entity.getComponentsIncludeChildren(Renderer, []);
    renderers.forEach((renderer, i) => {
      if (renderer.entity.isActive) {
        BoundingBox.merge(renderer.bounds, boundingBox, boundingBox);
      }
    });
    boundingBox.getExtent(extent);
    const size = extent.length();

    boundingBox.getCenter(center);
    this._controller.target.set(center.x, center.y, center.z);
    this._cameraEntity.transform.setPosition(center.x, center.y, size * 3);

    this._camera.farClipPlane = size * 12;
    this._camera.nearClipPlane = size / 100;

    this._controller.maxDistance = size * 10;

    entity.destroy();
  }

  private _onUpdate(deltaTime: number) {
    if (!this._playing || !this.selectedClip || !this._duration) return;
    this._frameTime += deltaTime / 1000;
    if (this._frameTime > this._duration) {
      this._frameTime %= this._duration;
    }
    //@ts-ignore
    // TODO: linked issue: https://github.com/oasis-engine/engine/issues/1134
    this.selectedClip._sampleAnimation(this._entity, this._frameTime);
  }
}
