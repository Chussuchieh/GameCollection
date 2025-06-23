import { _decorator, assetManager, Component, Node } from "cc";
import * as fgui from "fairygui-cc";
const { ccclass, property } = _decorator;

@ccclass("hall")
export class hall extends Component {
    start() {
        UI.Controller.inst.initFairyGUI();
        UI.Controller.inst.openView("HallView");
    }

    update(deltaTime: number) {}
}
