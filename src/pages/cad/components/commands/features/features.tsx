import { getRootScene } from "../../viewer/setUpRootScene";
import SvgIcon from "@/components/SvgIcon";
import { Feature, features } from "./variables";
import _ from "lodash";
import * as GuiHelper from "@/pages/cad/helpers/uiHelper";
import "./features.scss";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { createMesh, destroyMesh, updateFeature } from "./utils";
import { getOcc } from "@/core/occ";

export default function Features() {
  const rootScene = getRootScene();
  let currentMesh: any;
  let currentFeature: any;
  let ui: GUI | null = null;
  let currentOptions: any;
  const _occ = getOcc();
  const destory = () => {};

  const onchange = (key: string, value: any, subKey?: string) => {
    console.log(key, value, subKey)
    if (currentOptions && rootScene?.scene) {
      subKey ? currentOptions[subKey] : currentOptions[key][0] = value;
      updateFeature(_occ, rootScene.scene, currentMesh, currentOptions);
    }
  };

  const onOk = () => {
    if (currentMesh) {
      GuiHelper.addUi(currentMesh.uuid, currentMesh);
      ui?.destroy();
    }
  };

  const oncancel = () => {
    if (rootScene?.scene && currentMesh) {
      rootScene.scene.remove(currentMesh);
      destroyMesh(currentMesh);
      ui?.destroy();
    }
  };

  const clickHandler = (feature: Feature) => {
    if (rootScene?.scene) {
      if (currentMesh && !GuiHelper.getUiMap().has(currentMesh.uuid)) {
        rootScene.scene.remove(currentMesh);
      }
      ui?.destroy();
      currentFeature = features.find((fe: Feature) => fe.name === feature.name);
      currentOptions = _.cloneDeep(currentFeature.options);
      currentMesh = createMesh(_occ, currentFeature.name, currentOptions);
      rootScene.scene.add(currentMesh);
      ui = GuiHelper.showUi(
        rootScene.container,
        currentOptions,
        onOk,
        oncancel,
        onchange
      );
    }
  };

  return (
    <div className="features">
      {features.map((feature) => {
        return (
          <div
            className="feature"
            key={feature.name}
            onClick={() => clickHandler(feature)}
          >
            <SvgIcon name={feature.icon} title={"he"} />
          </div>
        );
      })}
    </div>
  );
}
