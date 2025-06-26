@UI.Register({
    name: "SettingView",
    bundleName: "hall",
    packages: ["Setting"],
    objectName: "SettingView",
    viewType: UI.Layer.Base,
})
export default class SettingView extends UI.ViewBase<FGUI_Setting_SettingView_Declare> {
    initUI() {}

    onBtnClose() {
        this.close();
    }

    onBtnEvent() {
        this.dispatch("event_test", "arg1", "arg2");
    }
}
