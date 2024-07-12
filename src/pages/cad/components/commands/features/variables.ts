import { Color, Vector3 } from "three";

export interface Postion {
  x: number[];
  y: number[];
  z: number[];
}

export interface Options {
  dx?: number[];
  dy?: number[];
  dz?: number[];
  r?: number[];
  position: Postion;
  color: Color;
}

export interface Feature {
  name: string;
  icon: string;
  options: Options;
}
export const features = [
  {
    name: "Box",
    icon: "box",
    options: {
      dx: [10, 1, 100, 1],
      dy: [10, 1, 100, 1],
      dz: [10, 1, 100, 1],
      color: new Color(0xfff222),
      position: {
        x: [0, 0, 100, 1],
        y: [0, 0, 100, 1],
        z: [0, 0, 100, 1],
      },
    },
    updateKeys: ["dx", "dy", "dz"],
  },
  {
    name: "Sphere",
    icon: "sphere",
    options: {
      r: [10, 1, 1, 100],
      color: new Color(0xfff222),
      position: {
        x: [0, 1, 0, 100],
        y: [0, 1, 0, 100],
        z: [0, 1, 0, 100],
      },
    },
    updateKeys: ["r"],
  },
];
