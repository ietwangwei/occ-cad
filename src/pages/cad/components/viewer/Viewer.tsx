import { useEffect, useRef } from "react";
import setUpRootScene, { RootScene } from "./setUpRootScene";

export default function CadViewer() {
  const host = useRef(null);

  useEffect(() => {
    if(host.current) {
      const rootScene: RootScene = setUpRootScene(host.current);

      window.onresize = () => rootScene.onResize(host.current)
    }
  }, []);

  return <div className="cad-viewer" ref={host}></div>;
}
