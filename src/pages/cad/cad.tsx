import { Spin } from "antd";
import Commands from "./components/commands/Commands";
import SliderBar from "./components/sliderBar/SliderBar";
import CadViewer from "./components/viewer/Viewer";
import { useEffect, useState } from "react";
import "./cad.scss";
import { initOcc } from "@/core/occ";

export default function Cad() {
  const [isLoding, setIsLoading] = useState(true);

  const init = async () => {
    await initOcc();
    setIsLoading(false)
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Spin spinning={isLoding}>
      <div className="cad">
        <SliderBar />
        <div className="container">
          <Commands />
          <CadViewer />
        </div>
      </div>
    </Spin>
  );
}
