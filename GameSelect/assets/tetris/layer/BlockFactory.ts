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

    private _blockPool: BlockBase[] = [];

    recycleBlock(block: BlockBase) {
        this._blockPool.push(block);
    }

    createSingleBlock(root: fgui.GComponent, color?: number): BlockBase {
        if (this._blockPool.length > 0) {
            const block = this._blockPool.pop();
            if (block) {
                block.setColor(color);
                return block;
            }
        }
        const single = fgui.UIPackage.createObject("Tetris", "Block").asCom;
        root.addChild(single);
        const pxy = new BlockBase(single);
        pxy.setColor(color);
        return pxy;
    }

    createSingleBox(root: fgui.GComponent): BlockBase {
        const single = fgui.UIPackage.createObject("Tetris", "Block").asCom;
        root.addChild(single);
        const pxy = new BlockBase(single);
        return pxy;
    }
}
