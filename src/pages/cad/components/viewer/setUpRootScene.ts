import {
  Color,
  GridHelper,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import AxisHelper from "../../helpers/axisHelper";
import { OrbitControls } from "@three-ts/orbit-controls";
import _ from "lodash";
import { Tween } from "three/examples/jsm/libs/tween.module.js";

let rootScene: RootScene | null;

export class RootScene extends Scene {
  container: HTMLElement;
  aspect: number;
  scene: Scene | null;
  pcCamera!: PerspectiveCamera;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  origin: Vector3;
  controles!: OrbitControls;
  tween!: any;
  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.aspect = container.clientWidth / container.clientHeight;
    this.origin = new Vector3(0, 0, 0);
    this.scene = new Scene();
    this.scene.background = new Color(0xc2c2c2);
    this.init();
    this.animate();
  }

  init() {
    this.createCamara();

    this.camera = this.pcCamera;
    this.camera.lookAt(this.origin);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.container.appendChild(this.renderer.domElement);

    this.setUpControls();
  }

  createCamara() {
    this.pcCamera = new PerspectiveCamera(75, this.aspect, 0.1, 1000);
    this.pcCamera.position.set(0, 20, 80);
  }

  onResize(container: HTMLElement | null) {
    if (container) {
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.camera.aspect = container.clientWidth / container.clientHeight;
    }
  }

  setUpControls() {
    this.controles = new OrbitControls(this.camera, this.renderer.domElement);
  }

  setCameraPosition(target: Vector3, duration = 1000) {
    const from = this.camera.position;
    const fromVect3 = new Vector3(from.x, from.y, from.z);
    const offsetUnit = this.camera.position.length();
    const offset = new Vector3(
      offsetUnit * target.x,
      offsetUnit * target.y,
      offsetUnit * target.z
    );

    const to = new Vector3(0, 0, 0).add(offset);

    if (_.isEqual(fromVect3, to)) return;

    this.tween = new Tween(to)
      .to(to, duration)
      .onUpdate(() => this.camera.lookAt(this.origin))
      .onComplete(() => (this.tween = null))
      .start();
  }

  animate() {
    if (this.tween) {
      this.tween.update();
    }
    if(this.scene) {
      this.controles.update();
      this.renderer.render(this.scene, this.camera);
    }
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.scene = null;
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

export function getRootScene() {
  return rootScene;
}

export function destroyRootScene() {
  if(rootScene) {
    rootScene.destroy();
    rootScene = null;
  }
}

export default function setUpRootScene(container: HTMLElement) {
  rootScene = new RootScene(container);
  if(rootScene && rootScene.scene) {
    const axisHelper = new AxisHelper(60);
    const gridHelper = new GridHelper(100, 10, 0x2C2C2C, 0x888888);
    rootScene.scene.add(gridHelper);
    rootScene.scene.add(axisHelper);
  }
  return rootScene;
}
