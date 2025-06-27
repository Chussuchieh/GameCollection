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
    end,
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
}

export const blockSize = v2(75, 75);
export default class BlockShape {
    private _blocks: BlockBase[] = [];
    private _type: BlockShapeType;
    private _root: fgui.GComponent;
    private _color: number;

    constructor(parent: fgui.GComponent) {
        this._root = new fgui.GComponent();
        this._root.name = "BlockShape";
        parent.addChild(this._root);
        this._root.draggable = true;
    }

    genShape(shape?: BlockShapeType, color?: number): void {
        if (shape === undefined) {
            const index = Math.floor(Math.random() * BlockShapeType.end);
            this._type = index;
        } else {
            this._type = shape;
        }
        this._color = color || this.randomColor();
        switch (this._type) {
            case BlockShapeType.single:
                this.createAxB(1, 1);
                break;
            case BlockShapeType.doubleHor:
                this.createAxB(1, 2);
                break;
            case BlockShapeType.doubleVer:
                this.createAxB(2, 1);
                break;
            case BlockShapeType.threeHor:
                this.createAxB(1, 3);
                break;
            case BlockShapeType.threeVer:
                this.createAxB(3, 1);
                break;
            case BlockShapeType.fourHor:
                this.createAxB(1, 4);
                break;
            case BlockShapeType.fourVer:
                this.createAxB(4, 1);
                break;
            case BlockShapeType.fiveHor:
                this.createAxB(1, 5);
                break;
            case BlockShapeType.fiveVer:
                this.createAxB(5, 1);
                break;
            case BlockShapeType.sixHor:
                this.createAxB(1, 6);
                break;
            case BlockShapeType.sixVer:
                this.createAxB(6, 1);
                break;
            case BlockShapeType.doubleSqr:
                this.createAxB(2, 2);
                break;
            case BlockShapeType.threeSqr:
                this.createAxB(3, 3);
                break;
            case BlockShapeType.doubleX3:
                this.createAxB(2, 3);
                break;
            case BlockShapeType.threeX2:
                this.createAxB(3, 2);
                break;
            case BlockShapeType.threeLeftAbove:
                this.createThreeTakeOneHorAbove(0);
                break;
            case BlockShapeType.threeCenAbove:
                this.createThreeTakeOneHorAbove(1);
                break;
            case BlockShapeType.threeRightAbove:
                this.createThreeTakeOneHorAbove(2);
                break;
            case BlockShapeType.threeLeftUnder:
                this.createThreeTakeOneHorUnder(0);
                break;
            case BlockShapeType.threeCenUnder:
                this.createThreeTakeOneHorUnder(1);
                break;
            case BlockShapeType.threeRightUnder:
                this.createThreeTakeOneHorUnder(2);
                break;
            case BlockShapeType.threeTopRight:
                this.createThreeTakeOneVerRight(0);
                break;
            case BlockShapeType.threeMidRight:
                this.createThreeTakeOneVerRight(1);
                break;
            case BlockShapeType.threeBottomRight:
                this.createThreeTakeOneVerRight(2);
                break;
            case BlockShapeType.threeTopLeft:
                this.createThreeTakeOneVerLeft(0);
                break;
            case BlockShapeType.threeMidLeft:
                this.createThreeTakeOneVerLeft(1);
                break;
            case BlockShapeType.threeBottomLeft:
                this.createThreeTakeOneVerLeft(2);
                break;
        }
    }

    randomColor(): number {
        return Math.floor(Math.random() * BlockColor.purple) + 1;
    }

    /**创建AxB的长方形 */
    createAxB(x: number, y: number) {
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
                pxy.Node.setPosition(blockSize.x * i, blockSize.y * j);
                this._blocks.push(pxy);
            }
        }
        this._root.setSize(blockSize.x * x, blockSize.y * y);
    }

    /**L型直角 */
    createLShape(centerX: number, centerY: number, line: number) {
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy.Node.setPosition(blockSize.x * centerX, blockSize.y * centerY);
        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        this._root.setSize(blockSize.x * centerX, blockSize.y * centerY);
    }

    /**三带1 */
    createThreeTakeOneHorAbove(pos: number) {
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy.Node.setPosition(blockSize.x * pos, 0);

        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy2 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy3 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy1.Node.setPosition(blockSize.x * 0, blockSize.y);
        pxy2.Node.setPosition(blockSize.x * 1, blockSize.y);
        pxy3.Node.setPosition(blockSize.x * 2, blockSize.y);
        this._blocks.push(pxy, pxy1, pxy2, pxy3);
        this._root.setSize(blockSize.x * 3, blockSize.y);
    }

    createThreeTakeOneHorUnder(pos: number) {
        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy2 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy3 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy1.Node.setPosition(blockSize.x * 0, 0);
        pxy2.Node.setPosition(blockSize.x * 1, 0);
        pxy3.Node.setPosition(blockSize.x * 2, 0);
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy.Node.setPosition(blockSize.x * pos, blockSize.y);
        this._blocks.push(pxy, pxy1, pxy2, pxy3);
        this._root.setSize(blockSize.x * 3, blockSize.y);
    }

    createThreeTakeOneVerLeft(pos: number) {
        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy2 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy3 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy1.Node.setPosition(blockSize.x, blockSize.y * 0);
        pxy2.Node.setPosition(blockSize.x, blockSize.y * 1);
        pxy3.Node.setPosition(blockSize.x, blockSize.y * 2);
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy.Node.setPosition(0, blockSize.y * pos);
        this._blocks.push(pxy, pxy1, pxy2, pxy3);
        this._root.setSize(blockSize.x, blockSize.y * 3);
    }

    createThreeTakeOneVerRight(pos: number) {
        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy2 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        const pxy3 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy1.Node.setPosition(0, blockSize.y * 0);
        pxy2.Node.setPosition(0, blockSize.y * 1);
        pxy3.Node.setPosition(0, blockSize.y * 2);
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy.Node.setPosition(blockSize.x, blockSize.y * pos);
        this._blocks.push(pxy, pxy1, pxy2, pxy3);
        this._root.setSize(blockSize.x, blockSize.y * 3);
    }

    get Blocks(): BlockBase[] {
        return this._blocks;
    }

    get Root(): fgui.GComponent {
        return this._root;
    }

    clear() {
        this.Root.removeFromParent();
    }
}
