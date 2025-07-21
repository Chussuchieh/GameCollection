import { _decorator, assetManager, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("start")
export class start extends Component {
    start() {
        assetManager.loadBundle("common", (err, bundle) => {
            UI.Controller.inst.initFairyGUI();
            UI.Controller.inst.changeScene("hall", "HallView");
        });
    }
}
