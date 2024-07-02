import "./cad.scss";
import Commands from "./components/commands/Commands";
import SliderBar from "./components/sliderBar/SliderBar";
import CadViewer from "./components/viewer/Viewer";

export default function Cad() {
    return (
        <div className="cad">
            <SliderBar />
            <div className="container">
                <Commands />
                <CadViewer />
            </div>
        </div>
    )
}