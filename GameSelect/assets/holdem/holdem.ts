import { _decorator, assetManager, Component, Node } from "cc";
import * as fgui from "fairygui-cc";
const { ccclass, property } = _decorator;

@ccclass("holdem")
export class holdem extends Component {
    start() {
        UI.Controller.inst.initFairyGUI();
        UI.Controller.inst.openView("HoldemView");
    }

    update(deltaTime: number) {}
}
