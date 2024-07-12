import { getVerticesByShape } from "@/core/occ";
import {
  MeshBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  Scene,
} from "three";
import { OpenCascadeInstance, TopoDS_Shape } from "opencascade.js";
import { Feature, Options } from "./variables";

/**
 * @description Create mesh by OCC Shape
 */
export function generateMeshFromShape(shape: TopoDS_Shape, options: Options) {
  const vertices = getVerticesByShape(shape);
  const material = new MeshBasicMaterial({ color: options.color });
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  const mesh = new Mesh(geometry, material);
  mesh.position.set(options.position.x[0], options.position.y[0], options.position.z[0])
  return mesh;
}

export function createMesh(
  _occ: OpenCascadeInstance,
  name: string,
  options: any
) {
  let shape;
  let mesh;
  if (options) {
    switch (name) {
      case "Box":
        shape = new _occ.BRepPrimAPI_MakeBox_2(
          options.dx[0],
          options.dy[0],
          options.dz[0]
        ).Shape();

        mesh = generateMeshFromShape(shape, options);
        mesh.name = name;
        return mesh;
      case "Sphere":
        shape = new _occ.BRepPrimAPI_MakeSphere_1(options.r[0]).Shape();

        mesh = generateMeshFromShape(shape, options);
        mesh.name = name;
        return mesh;
      default:
        console.log("Could't find the feature");
    }
  }
}

export function destroyMesh(mesh: Mesh) {
  const material: any = mesh.material
  const geometry: any = mesh.geometry;

  material.dispose();
  geometry.dispose();
}

export function updateFeature(
  _occ: OpenCascadeInstance,
  scene: Scene,
  currentMash: Mesh,
  currentOptions: any
) {
  destroyMesh(currentMash);
  scene.remove(currentMash);
  const mesh: any = createMesh(_occ, currentMash.name, currentOptions);
  scene.add(mesh);
}
