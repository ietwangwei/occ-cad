import { useEffect, useRef } from "react";
import setUpRootScene, { destroyRootScene, RootScene } from "./setUpRootScene";

export default function CadViewer() {
  const host = useRef(null);

  let rootScene: RootScene;

  const onResize = () => rootScene.onResize(host.current);

  const initViewer = () => {
    if (host.current) {
      rootScene = setUpRootScene(host.current);
      window.onresize = onResize;
    }
  };

  const destroy = () => {
    destroyRootScene()
  };

  useEffect(() => {
    initViewer();

    return () => destroy();
  }, []);

  return <div className="cad-viewer" ref={host}></div>;
}
