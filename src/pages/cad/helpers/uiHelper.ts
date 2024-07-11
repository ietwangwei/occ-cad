import { Color } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const uisMap = new Map();

export function addUi(id: number, options: any) {
  uisMap.set(id, options);
}

export function removeUI(id: number) {
  if (uisMap.has(id)) {
    uisMap.delete(id);
  }
}

export function showUi(
  container: HTMLElement,
  options: any,
  onOk: () => void,
  onCancel: () => void,
  onChange: (key: string, value: any) => void
) {
  const ui: GUI = new GUI({ container, width: 300 });
  for (let key in options) {
    const option: any = options[key];
    if (option instanceof Color) {
      ui.addColor(options, key);
    } else if (typeof option === "number") {
      ui.add(options, key);
    }
    ui.onChange((value: any) => onChange(key, value));
  }
  ui.add({ onOk }, "onOk");
  ui.add({ onCancel }, "onCancel");

  return ui;
}
