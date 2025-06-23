/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, director } from "cc";
import * as fgui from "fairygui-cc";

@UI.Register({
    name: "HoldemView",
    bundleName: "holdem",
    packages: ["Holdem"],
    objectName: "HoldemView",
    viewType: UI.ViewType.Base,
})
export default class HoldemView extends fgui.GComponent {
    initUI() {
        console.log("HoldemView initUI");
    }

    onBtnBack() {
        assetManager.loadBundle("hall", () => {
            director.loadScene("hall");
        });
    }
}
