// import { EventDispatcher, Object3D, Scene, Vector3 } from "three";

// export interface CubeFace {
//   name: string;
//   factor: Vector3;
//   angle: number;
//   axis: Vector3;
//   position: Vector3
// };

// class Cube extends Object3D {
//   constructor(size, faces) {
//     super()
//   }
// }

// export default class ViewerCube extends EventDispatcher {
//   offset: number;
//   container: HTMLElement;
//   faces: CubeFace[];
//   constructor(container: HTMLElement, size = 10) {
//     super();

//     this.container = container;
//     this.offset = size / 2;

//     this.faces = [
//       {
//         name: "Front",
//         factor: new Vector3(0, 0, 1),
//         angle: 0,
//         axis: new Vector3(0, 0, 1),
//         position: new Vector3(0, 0, this.offset)
//       }
//     ];

//     this.scene = new Scene(size, this.faces);

//     this.cube = new 
//   }
// }