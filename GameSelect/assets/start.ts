import { _decorator, assetManager, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("start")
export class start extends Component {
    start() {
        UI.Controller.inst.changeScene("tetris");
    }

    update(deltaTime: number) {}
}
