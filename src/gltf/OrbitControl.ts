import { Camera, InputManager, Script, Transform, Vector3, MathUtil, Matrix, Entity, Vector2 } from "oasis-engine";
// Prevent gimbal lock.
const ESP = MathUtil.zeroTolerance;
// Spherical.
export class Spherical {
  private static _xAxis: Vector3 = new Vector3();
  private static _yAxis: Vector3 = new Vector3();
  private static _zAxis: Vector3 = new Vector3();
  private _matrix: Matrix = new Matrix();
  private _matrixInv: Matrix = new Matrix();
  constructor(public radius: number = 1.0, public phi: number = 0, public theta: number = 0) {}

  makeSafe(): Spherical {
    const count = Math.floor(this.phi / Math.PI);
    this.phi = MathUtil.clamp(this.phi, count * Math.PI + ESP, (count + 1) * Math.PI - ESP);
    return this;
  }

  set(radius: number, phi: number, theta: number): Spherical {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
    return this;
  }

  setYAxis(up: Vector3): void {
    const { _xAxis: xAxis, _yAxis: yAxis, _zAxis: zAxis } = Spherical;
    if (Vector3.equals(xAxis.set(1, 0, 0), yAxis.copyFrom(up).normalize())) {
      xAxis.set(0, 1, 0);
    }
    Vector3.cross(xAxis, yAxis, zAxis);
    zAxis.normalize();
    Vector3.cross(yAxis, zAxis, xAxis);
    const { elements: es } = this._matrix;
    (es[0] = xAxis.x), (es[1] = xAxis.y), (es[2] = xAxis.z);
    (es[4] = yAxis.x), (es[5] = yAxis.y), (es[6] = yAxis.z);
    (es[8] = zAxis.x), (es[9] = zAxis.y), (es[10] = zAxis.z);

    const { elements: eInv } = this._matrixInv;
    (eInv[0] = xAxis.x), (eInv[4] = xAxis.y), (eInv[8] = xAxis.z);
    (eInv[1] = yAxis.x), (eInv[5] = yAxis.y), (eInv[9] = yAxis.z);
    (eInv[2] = zAxis.x), (eInv[6] = zAxis.y), (eInv[10] = zAxis.z);
  }

  setFromVec3(value: Vector3, atTheBack: boolean = false): Spherical {
    value.transformNormal(this._matrixInv);
    this.radius = value.length();
    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      if (atTheBack) {
        this.phi = 2 * Math.PI - Math.acos(MathUtil.clamp(value.y / this.radius, -1, 1));
        this.theta = Math.atan2(-value.x, -value.z);
      } else {
        this.phi = Math.acos(MathUtil.clamp(value.y / this.radius, -1, 1));
        this.theta = Math.atan2(value.x, value.z);
      }
    }
    return this;
  }

  setToVec3(value: Vector3): boolean {
    const { radius, phi, theta } = this;
    const sinPhiRadius = Math.sin(phi) * radius;
    this.phi -= Math.floor(this.phi / Math.PI / 2) * Math.PI * 2;
    value.set(sinPhiRadius * Math.sin(theta), radius * Math.cos(phi), sinPhiRadius * Math.cos(theta));
    value.transformNormal(this._matrix);
    return this.phi > Math.PI;
  }
}

enum ControlHandlerType {
  None = 0,
  ROTATE = 1,
  ZOOM = 2,
  PAN = 4,
  All = 7
}

/**
 * The camera's track controller, can rotate, zoom, pan, support mouse and touch events.
 */
export class OrbitControl extends Script {
  canvas: HTMLCanvasElement;
  camera!: Camera;
  cameraTransform!: Transform;

  /** Whether to automatically rotate the camera, the default is false. */
  autoRotate: boolean = false;
  /** The radian of automatic rotation per second. */
  autoRotateSpeed: number = Math.PI;
  /** Whether to enable camera damping, the default is true. */
  enableDamping: boolean = true;
  /** Rotation speed, default is 1.0 . */
  rotateSpeed: number = 2.0;
  /** Camera zoom speed, the default is 1.0. */
  zoomSpeed: number = 1.0;
  /** Keyboard translation speed, the default is 7.0 . */
  keyPanSpeed: number = 7.0;
  /** Rotation damping parameter, default is 0.1 . */
  dampingFactor: number = 0.2;
  /** Zoom damping parameter, default is 0.2 . */
  zoomFactor: number = 0.2;
  /**  The minimum distance, the default is 0.1, should be greater than 0. */
  minDistance: number = 0.1;
  /** The maximum distance, the default is infinite, should be greater than the minimum distance. */
  maxDistance: number = Infinity;
  /** Minimum zoom speed, the default is 0.0. */
  minZoom: number = 0.0;
  /** Maximum zoom speed, the default is positive infinity. */
  maxZoom: number = Infinity;
  /** The minimum radian in the vertical direction, the default is 1 degree. */
  minPolarAngle: number = 1;
  /** The maximum radian in the vertical direction,  the default is 179 degree.  */
  maxPolarAngle: number = (179 / 180) * Math.PI;
  /** The minimum radian in the horizontal direction, the default is negative infinity. */
  minAzimuthAngle: number = -Infinity;
  /** The maximum radian in the horizontal direction, the default is positive infinity.  */
  maxAzimuthAngle: number = Infinity;

  private _enableKeys: boolean = true;
  private _up: Vector3 = new Vector3(0, 1, 0);
  private _target: Vector3 = new Vector3();
  private _atTheBack: boolean = false;
  private _spherical: Spherical = new Spherical();
  private _sphericalDelta: Spherical = new Spherical();
  private _sphericalDump: Spherical = new Spherical();
  private _zoomFrag: number = 0;
  private _scale: number = 1;
  private _panOffset: Vector3 = new Vector3();
  private _tempVec3: Vector3 = new Vector3();
  private _enableHandler: number = ControlHandlerType.All;
  private _isRotating = false;

  constructor(entity: Entity) {
    super(entity);
    // @ts-ignore
    this.canvas = entity.engine.canvas._webCanvas;
  }

  /*
   * Return up vector.
   */
  get up(): Vector3 {
    return this._up;
  }

  set up(value: Vector3) {
    this._up.copyFrom(value);
    this._spherical.setYAxis(value);
    this._atTheBack = false;
  }

  /**
   * Return target position.
   * */
  get target(): Vector3 {
    return this._target;
  }

  set target(value: Vector3) {
    this._target.copyFrom(value);
    this._atTheBack = false;
  }

  /**
   *  Return Whether to enable rotation, the default is true.
   */
  get enableRotate(): boolean {
    return (this._enableHandler & ControlHandlerType.ROTATE) !== 0;
  }

  set enableRotate(value: boolean) {
    if (value) {
      this._enableHandler |= ControlHandlerType.ROTATE;
    } else {
      this._enableHandler &= ~ControlHandlerType.ROTATE;
    }
  }

  /**
   *  Whether to enable camera damping, the default is true.
   */
  get enableZoom(): boolean {
    return (this._enableHandler & ControlHandlerType.ZOOM) !== 0;
  }

  set enableZoom(value: boolean) {
    if (value) {
      this._enableHandler |= ControlHandlerType.ZOOM;
    } else {
      this._enableHandler &= ~ControlHandlerType.ZOOM;
    }
  }

  /**
   *  Whether to enable translation, the default is true.
   */
  get enablePan(): boolean {
    return (this._enableHandler & ControlHandlerType.PAN) !== 0;
  }

  set enablePan(value: boolean) {
    if (value) {
      this._enableHandler |= ControlHandlerType.PAN;
    } else {
      this._enableHandler &= ~ControlHandlerType.PAN;
    }
  }

  onAwake(): void {
    const { engine, entity } = this;
    // @ts-ignore
    this.input = engine.inputManager;
    this.camera = entity.getComponent(Camera);
    this.cameraTransform = entity.transform;
    this._spherical.setYAxis(this._up);
    this._atTheBack = false;
  }

  onUpdate(_deltaTime: number): void {
    this._updateTransform();
  }

  rotate(delta: { x: number; y: number }): void {
    const radianLeft = ((2 * Math.PI * delta.x) / this.canvas.width) * this.rotateSpeed;
    this._sphericalDelta.theta -= radianLeft;
    const radianUp = ((2 * Math.PI * delta.y) / this.canvas.height) * this.rotateSpeed;
    this._sphericalDelta.phi -= radianUp;
    this._sphericalDump.theta = -radianLeft;
    this._sphericalDump.phi = -radianUp;
    this._isRotating = true;
  }

  zoom(value: number): void {
    if (value > 0) {
      this._scale /= Math.pow(0.95, this.zoomSpeed);
    } else if (value < 0) {
      this._scale *= Math.pow(0.95, this.zoomSpeed);
    }
  }

  pan(delta: Vector3): void {
    const { cameraTransform } = this;
    const { elements } = cameraTransform.worldMatrix;
    const { height } = this.canvas;
    const targetDistance =
      Vector3.distance(cameraTransform.position, this.target) * (this.camera.fieldOfView / 2) * (Math.PI / 180);
    const distanceLeft = -2 * delta.x * (targetDistance / height);
    const distanceUp = 2 * delta.y * (targetDistance / height);
    this._panOffset.x += elements[0] * distanceLeft + elements[4] * distanceUp;
    this._panOffset.y += elements[1] * distanceLeft + elements[5] * distanceUp;
    this._panOffset.z += elements[2] * distanceLeft + elements[6] * distanceUp;
  }

  private _updateTransform(): void {
    const { cameraTransform, target, _tempVec3, _spherical, _sphericalDump, _sphericalDelta, _panOffset } = this;
    if (this.enableDamping && !this._isRotating) {
      _sphericalDelta.theta = _sphericalDump.theta *= 1 - this.dampingFactor;
      _sphericalDelta.phi = _sphericalDump.phi *= 1 - this.dampingFactor;
    }
    Vector3.subtract(cameraTransform.position, target, _tempVec3);
    _spherical.setFromVec3(_tempVec3, this._atTheBack);
    _spherical.theta += _sphericalDelta.theta;
    _spherical.phi += _sphericalDelta.phi;
    _spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, _spherical.theta));
    _spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, _spherical.phi));
    _spherical.makeSafe();
    if (this._scale !== 1) {
      this._zoomFrag = _spherical.radius * (this._scale - 1);
    }
    _spherical.radius += this._zoomFrag;
    _spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, _spherical.radius));
    this._atTheBack = _spherical.setToVec3(_tempVec3);
    Vector3.add(target.add(_panOffset), _tempVec3, cameraTransform.worldPosition);
    cameraTransform.lookAt(target, _tempVec3.copyFrom(this.up).scale(this._atTheBack ? -1 : 1));
    /** Reset cache value. */
    this._zoomFrag = 0;
    this._scale = 1;
    _sphericalDelta.set(0, 0, 0);
    _panOffset.set(0, 0, 0);
    this._isRotating = false;
  }

  addDefaultControl() {
    let startPos = new Vector2();
    let deltaPos = new Vector2();
    const canvas = this.canvas;
    canvas.addEventListener("pointerdown", (e) => {
      startPos.set(e.clientX, e.clientY);
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    });

    canvas.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        this.zoom(e.deltaY);
      },
      { passive: false }
    );

    const onPointerMove = (e: PointerEvent) => {
      deltaPos.set(e.clientX, e.clientY).subtract(startPos);
      this.rotate(deltaPos);
      startPos.set(e.clientX, e.clientY);
    };

    const onPointerUp = () => {
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }
}
