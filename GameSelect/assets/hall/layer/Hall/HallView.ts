/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

@UI.Register({
    name: "HallView",
    bundleName: "hall",
    packages: ["Hall"],
    objectName: "HallView",
    viewType: UI.Layer.Base,
})
export default class HallView extends UI.ViewBase<FGUI_Hall_HallView_Declare> {
    initUI() {
        console.log("HallView initUI", this.view.KW_BTN_Event);
    }

    onBtnSetting() {
        this.openView("SettingView");
    }

    onBtnTH() {
        this.changeScene("holdem", "HoldemView");
    }

    onBtnFish() {
        this.changeScene("fish", "FishView");
    }

    onBtnTetris() {
        this.changeScene("tetris", "TetrisView");
    }

    @UI.Listen("event_test")
    onEventTest(arg1: string, arg2: string) {
        console.log("HallView onEventTest", arg1, arg2);
    }
}
