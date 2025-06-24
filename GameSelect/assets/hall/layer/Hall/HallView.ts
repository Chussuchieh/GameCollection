/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

@UI.Register({
    name: "HallView",
    bundleName: "hall",
    packages: ["Hall"],
    objectName: "HallView",
    viewType: UI.ViewType.Base,
})
export default class HallView extends UI.UIView<FGUI_Hall_HallView_Declare> {
    initUI() {
        console.log("HallView initUI", this.view.KW_BTN_Event);
    }

    onBtnTH() {
        UI.Controller.inst.changeScene("holdem");
    }
}
