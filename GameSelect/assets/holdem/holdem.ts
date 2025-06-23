import { _decorator, assetManager, Component, Node } from "cc";
import * as fgui from "fairygui-cc";
import HoldemView from "./layer/Holdem/HoldemView";
const { ccclass, property } = _decorator;

@ccclass("holdem")
export class holdem extends Component {
    start() {
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage(assetManager.getBundle("holdem"), "fgui/Holdem", () => {
            fgui.UIObjectFactory.setExtension(HoldemView.URL, HoldemView);
            fgui.GRoot.inst.addChild(HoldemView.createInstance());
        });
    }

    update(deltaTime: number) {}
}
