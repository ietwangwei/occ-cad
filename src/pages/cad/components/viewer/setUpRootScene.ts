import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";

let rootScene: RootScene;

export class RootScene extends Scene {
  container: HTMLElement;
  aspect: number;
  scene: Scene;
  pcCamera!: PerspectiveCamera;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.aspect = container.clientWidth / container.clientHeight;

    this.scene = new Scene();
    this.scene.background = new Color(0xc2c2c2);
    this.init();
    this.animate();
  }

  init() {
    this.createCamara();

    this.camera = this.pcCamera;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.container.appendChild(this.renderer.domElement);
  }

  createCamara() {
    this.pcCamera = new PerspectiveCamera(75, this.aspect, 0.1, 1000);
    this.pcCamera.position.set(0, 20, 100);
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  onResize(container: HTMLElement | null) {
    if(container) {
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
  }
}

export function getRootScene() {
  return rootScene;
}

export default function setUpRootScene(container: HTMLElement): RootScene {
  rootScene = new RootScene(container);

  return rootScene;
}
