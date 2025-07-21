import { assetManager, director } from "cc";
import * as fgui from "fairygui-cc";

@UI.Register({
    name: "HoldemView",
    bundleName: "holdem",
    packages: ["Holdem"],
    objectName: "HoldemView",
    viewType: UI.Layer.Base,
})
export default class HoldemView extends UI.ViewBase<FGUI_Holdem_HoldemView_Declare> {
    initUI() {
        console.log("HoldemView initUI");
    }

    onBtnBack() {
        this.changeScene("hall", "HallView");
    }

    onBtnEvent() {
        this.dispatch("event_test", "arg1", "arg2");
    }

    @UI.Listen("event_test")
    onEventTestInGame(str1: string, str2: string) {
        console.log("onEventTestInGame", str1, str2);
    }
}
