import { Color, Vector3 } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const uisMap = new Map();

export function getUiMap() {
  return uisMap;
}

export function addUi(uuid: string, options: any) {
  uisMap.set(uuid, options);
}

export function removeUI(uuid: string) {
  if (uisMap.has(uuid)) {
    uisMap.delete(uuid);
  }
}

export function generateUIRows(
  ui: GUI,
  options: any,
  onChange: (key: string, value: any, subKey?: string) => void,
  subKey?: string
) {
  for (let key in options) {
    const option: any = options[key];
    if (Array.isArray(option)) {
      const control: any = {};
      control[key] = option[0];
      ui.add(control, key, option[1], option[2], option[3]);
      ui.onChange((value) => {
        onChange(key, value, subKey);
      });
    } else if (option instanceof Color) {
      ui.addColor(options, key);
    } else if (typeof option === "object") {
      const sub = ui.addFolder(key);
      generateUIRows(sub, option, onChange, key);
    }
  }
  return ui;
}

export function showUi(
  container: HTMLElement,
  options: any,
  onOk: () => void,
  onCancel: () => void,
  onChange: (key: string, value: any, subKey?: string) => void
) {
  let ui: GUI = new GUI({ container, width: 300 });
  ui = generateUIRows(ui, options, onChange);
  ui.add({ onOk }, "onOk");
  ui.add({ onCancel }, "onCancel");
  return ui;
}
