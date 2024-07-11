import { ArrowHelper, Color, Object3D, Vector3 } from "three";

const DEFAULT_COLORS = [
  new Color(0xff0000),
  new Color(0x00ff00),
  new Color(0x0000ff),
];
export default class AxisHelper extends Object3D {
  length: number;
  colors: Color[];
  constructor(length: number, colors = DEFAULT_COLORS) {
    super();

    this.length = length;

    this.colors = colors;

    this.init();
  }

  createAxis(dir: Vector3, origin: Vector3, length: number, color: Color) {
    const axis = new ArrowHelper(dir, origin, length, color);

    axis.updateMatrix();

    return axis;
  }

  init() {
    const origin = new Vector3(0, 0, 0);
    const dirs = [
      new Vector3(1, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
    ];

    dirs.forEach((dir, index) =>
      this.add(this.createAxis(dir, origin, this.length, this.colors[index]))
    );
  }
}
