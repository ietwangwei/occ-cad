import { Color, Vector3 } from "three";

export interface Feature {
  name: string;
  icon: string;
  options: any;
}
export const features = [
  {
    name: "Box",
    icon: "box",
    options: {
      dx: 10,
      dy: 10,
      dz: 10,
      color: new Color(0xfff222),
      position: new Vector3(0, 0, 0),
    },
  },
  {
    name: "Sphere",
    icon: "sphere",
    options: {
      r: 10,
      color: new Color(0xfff222),
      position: new Vector3(0, 0, 0),
    },
  },
];
