/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, director } from "cc";
import * as fgui from "fairygui-cc";

@UI.Register({
    name: "HallView",
    bundleName: "hall",
    packages: ["Hall"],
    objectName: "HallView",
    viewType: UI.ViewType.Base,
})
export default class HallView extends fgui.GComponent {
    initUI() {
        console.log("HallView initUI");
    }

    onBtnTH() {
        assetManager.loadBundle("holdem", () => {
            director.loadScene("holdem");
        });
    }
}
