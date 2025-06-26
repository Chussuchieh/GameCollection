import { color, v2 } from "cc";
import * as fgui from "fairygui-cc";
import { BlockColor } from "./BlockBase";
import BlockBase from "./BlockBase";

export default class BlockFactory {
    private static _instance: BlockFactory | null = null;

    public static get inst(): BlockFactory {
        if (!this._instance) {
            this._instance = new BlockFactory();
        }
        return this._instance;
    }

    createSingleBlock(root: fgui.GComponent, color?: number): BlockBase {
        const single = fgui.UIPackage.createObject("Tetris", "Block").asCom;
        root.addChild(single);
        const pxy = new BlockBase(single);
        pxy.setColor(color);
        return pxy;
    }

    createSingleBox(root: fgui.GComponent): BlockBase {
        const single = fgui.UIPackage.createObject("Tetris", "BlockBox").asCom;
        root.addChild(single);
        const pxy = new BlockBase(single);
        return pxy;
    }
}
