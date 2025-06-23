/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class UI_HallView extends fgui.GComponent {

	public KW_KW_TH:fgui.GButton;
	public static URL:string = "ui://k3oj6dseske60";

	public static createInstance():UI_HallView {
		return <UI_HallView>(fgui.UIPackage.createObject("Hall", "HallView"));
	}

	protected onConstruct():void {
		this.KW_KW_TH = <fgui.GButton>(this.getChildAt(1));
	}
}