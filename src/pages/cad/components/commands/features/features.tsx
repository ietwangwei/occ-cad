import { getOcc, getVerticesByShape } from "@/core/occ";
import "./features.scss";
import { TopoDS_Shape } from "opencascade.js";
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
} from "three";
import { getRootScene } from "../../viewer/setUpRootScene";
import SvgIcon from "@/components/SvgIcon";
import { Feature, features } from "./variables";
import { addUi, showUi } from "@/pages/cad/helpers/uiHelper";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default function Features() {
  const _occ = getOcc();
  const rootScene = getRootScene();
  let material = new MeshBasicMaterial({ color: 0xf2f2f2 });
  let geometry = new BufferGeometry();
  let mesh: Object3D;
  let options: any;
  let ui: GUI;

  const onOk = () => {
    if(mesh) {
      addUi(mesh.id, options)
    }
  };
  const onCancel = () => {
    if (ui && rootScene && rootScene.scene) {
      material.dispose();
      geometry.dispose();
      rootScene?.scene.remove(mesh);
      ui.destroy();
    }
  };
  const onChange = (key: string, value: any) => {
    console.log(key, value);
  };

  const activeFeature = (feature: Feature) => {
    if (ui) {
      ui.destroy();
    }
    let shape: TopoDS_Shape | null = null;
    options = feature.options;
    switch (feature.name) {
      case "Box":
        shape = new _occ.BRepPrimAPI_MakeBox_2(
          options.dx,
          options.dy,
          options.dz
        ).Shape();
        break;
      case "Sphere":
        shape = new _occ.BRepPrimAPI_MakeSphere_1(options.r).Shape();
        break;
    }
    if (shape && rootScene && rootScene.scene) {
      const vertices = getVerticesByShape(shape);
      geometry.setAttribute("position", new BufferAttribute(vertices, 3));
      mesh = new Mesh(geometry, material);
      rootScene.scene.add(mesh);
      ui = showUi(rootScene.container, options, onOk, onCancel, onChange);
    }
  };

  return (
    <div className="features">
      {features.map((feature) => {
        return (
          <div
            className="feature"
            key={feature.name}
            onClick={() => activeFeature(feature)}
          >
            <SvgIcon name={feature.icon} title={"he"} />
          </div>
        );
      })}
    </div>
  );
}
