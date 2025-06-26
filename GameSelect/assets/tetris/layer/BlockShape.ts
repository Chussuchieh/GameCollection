import { v2 } from "cc";
import BlockBase, { BlockColor } from "./BlockBase";
import BlockFactory from "./BlockFactory";
import * as fgui from "fairygui-cc";

export enum BlockShapeType {
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

export const blockSize = v2(75, 75);
export default class BlockShape {
    private _blocks: BlockBase[] = [];
    private _type: BlockShapeType;
    private _root: fgui.GComponent;
    private _color: number;

    constructor(type: BlockShapeType, parent: fgui.GComponent, color?: number) {
        this._type = type;
        this._root = new fgui.GComponent();
        parent.addChild(this._root);
        this._root.draggable = true;
        this._color = color || this.randomColor();
        switch (type) {
            case BlockShapeType.single:
                this.createSingle();
            case BlockShapeType.doubleHor:
                this.createDoubleHor();
        }
    }

    randomColor(): number {
        return Math.floor(Math.random() * BlockColor.purple) + 1;
    }

    createSingle() {
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        this._root.setSize(blockSize.x, blockSize.y);
        this._blocks.push(pxy);
    }

    createDoubleHor() {
        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy2 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy2.Node.setPosition(blockSize.x, 0);
        this._root.setSize(blockSize.x * 2, blockSize.y);
        this._blocks.push(pxy1);
        this._blocks.push(pxy2);
    }

    get Root(): fgui.GComponent {
        return this._root;
    }
}
