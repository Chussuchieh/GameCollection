import { _decorator, assetManager, Component, Node } from "cc";
import * as fgui from "fairygui-cc";
import { Controller } from "../common/UIController";
const { ccclass, property } = _decorator;

@ccclass("hall")
export class hall extends Component {
    start() {
        Controller.inst.initFairyGUI();
        Controller.inst.openView("HallView");
    }

    update(deltaTime: number) {}
}
