/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class UI_HoldemView extends fgui.GComponent {

	public KW_back:fgui.GImage;
	public static URL:string = "ui://uhd4scsxm3506";

	public static createInstance():UI_HoldemView {
		return <UI_HoldemView>(fgui.UIPackage.createObject("Holdem", "HoldemView"));
	}

	protected onConstruct():void {
		this.KW_back = <fgui.GImage>(this.getChildAt(1));
	}
}