import * as fgui from "fairygui-cc";
export enum BlockColor {
    null,
    red,
    yellow,
    blue,
    green,
    purple,
    end,
}
export default class BlockBase {
    private _node: fgui.GComponent;
    private _fill = false;
    private _realColor = 0;
    private _previewColor = 0;

    constructor(node: fgui.GComponent) {
        this._node = node;
    }

    get Node(): fgui.GComponent {
        return this._node;
    }

    setColor(color: number) {
        this._realColor = color;
        this._node.getController("C_Color").selectedIndex = color;
        // this._node.alpha = this._fill ? 1 : 0.5;
    }

    getColor(): number {
        return this._realColor;
    }

    setFill(fill: boolean) {
        this._fill = fill;
    }

    getFill(): boolean {
        return this._fill;
    }

    setPreviewColor(color: number) {
        this._previewColor = color;
        this._node.getController("C_Color").selectedIndex = color;
        this._node.alpha = 0.5;
    }

    clearPreviewColor() {
        this._previewColor = 0;
        this._node.alpha = 1;
        this.setColor(this._realColor);
    }

    getPreviewColor(): number {
        return this._previewColor;
    }
}
