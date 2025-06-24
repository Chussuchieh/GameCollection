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
        UI.Controller.inst.changeScene("hall");
    }

    onBtnEvent() {
        UI.Controller.inst.dispatchEvent("event_test", "arg1", "arg2");
    }

    @UI.Listen("event_test")
    onEventTestInGame(str1: string, str2: string) {
        console.log("onEventTestInGame", str1, str2);
    }
}
