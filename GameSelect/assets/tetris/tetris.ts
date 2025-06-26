import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("tetris")
export class tetris extends Component {
    start() {
        UI.Controller.inst.initFairyGUI();
        UI.Controller.inst.openView("TetrisView");
    }

    update(deltaTime: number) {}
}
