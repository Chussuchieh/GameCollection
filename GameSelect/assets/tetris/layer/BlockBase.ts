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

    constructor(node: fgui.GComponent) {
        this._node = node;
    }

    get Node(): fgui.GComponent {
        return this._node;
    }

    setColor(color: number) {
        this._node.getController("C_Color").selectedIndex = color;
        this._node.alpha = this._fill ? 1 : 0.5;
    }

    getColor(): number {
        return this._node.getController("C_Color").selectedIndex;
    }

    setFill(fill: boolean) {
        this._node.getController("C_Fill").selectedIndex = fill ? 1 : 0;
    }

    getFill(): boolean {
        return this._node.getController("C_Fill").selectedIndex == 1;
    }
}
