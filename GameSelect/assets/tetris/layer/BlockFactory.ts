import { color, v2 } from "cc";
import * as fgui from "fairygui-cc";

export enum BlockType {
    single,
    doubleHor,
    doubleVer,
    threeHor,
    threeVer,
    fourHor,
    fourVer,
    fiveHor,
    fiveVer,
    sixHor,
    sixVer,
    doubleSqr,
    threeSqr,
    doubleX3,
    threeX2,
    threeLeftAbove,
    threeCenAbove,
    threeRightAbove,
    threeLeftUnder,
    threeCenUnder,
    threeRightUnder,
    threeTopRight,
    threeMidRight,
    threeBottomRight,
    threeTopLeft,
    threeMidLeft,
    threeBottomLeft,
    angle2LeftBottom,
    angle2LeftTop,
    angle2RightBottom,
    angle2RightTop,
    angle3LeftBottom,
    angle3LeftTop,
    angle3RightBottom,
    angle3RightTop,
    interVer,
    interHor,
    end,
}

export enum BlockColor {
    null,
    red,
    yellow,
    blue,
    green,
    purple,
    end,
}

export const blockSize = v2(75, 75);

export default class BlockFactory {
    private static _instance: BlockFactory | null = null;

    public static get inst(): BlockFactory {
        if (!this._instance) {
            this._instance = new BlockFactory();
        }
        return this._instance;
    }

    createSingleBlock(color?: number): fgui.GComponent {
        const single = fgui.UIPackage.createObject("Tetris", "Block").asCom;
        single.getController("C_Color").selectedIndex = color ?? BlockColor.null;
        return single;
    }

    createBlockShape(blockType?: number, color?: number): fgui.GComponent {
        if (blockType === undefined) {
            blockType = Math.floor(Math.random() * BlockType.end);
        }
        switch (blockType) {
            case BlockType.single:
                return this.createSingle(color);
            case BlockType.doubleHor:
                return this.createDoubleHor(color);
        }
    }

    createSingle(color?: number): fgui.GComponent {
        const ret = new fgui.GComponent();
        if (color === undefined) {
            color = Math.floor(Math.random() * BlockColor.purple) + 1;
        }
        const node = this.createSingleBlock(color);
        ret.addChild(node);
        ret.setSize(blockSize.x, blockSize.y);
        ret.draggable = true;
        return ret;
    }

    createDoubleHor(color?: number) {
        const ret = new fgui.GComponent();
        if (color === undefined) {
            color = Math.floor(Math.random() * BlockColor.end);
        }
        const node = this.createSingleBlock(color);
        ret.addChild(node);
        const node2 = this.createSingleBlock(color);
        ret.addChild(node2);
        node2.setPosition(blockSize.x, 0);
        ret.setSize(blockSize.x * 2, blockSize.y);
        ret.draggable = true;
        return ret;
    }
}
