import { v2, Vec2 } from "cc";
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
    end,
    interVer,
    interHor,
}

export enum BlockGenLevel {
    simple,
    hard,
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

    getScore(): number {
        return this._blocks.length * 8;
    }

    genShape(level: number, shape?: BlockShapeType, color?: number): void {
        let end = BlockShapeType.end;
        if (level == BlockGenLevel.simple) {
            end = BlockShapeType.threeX2 + 1;
        }

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
            case BlockShapeType.angle2LeftBottom:
                this.createLShape(v2(1, 1), v2(0, 1), v2(1, 0));
                break;
            case BlockShapeType.angle2LeftTop:
                this.createLShape(v2(1, 0), v2(0, 0), v2(1, 1));
                break;
            case BlockShapeType.angle2RightBottom:
                this.createLShape(v2(0, 1), v2(1, 1), v2(0, 0));
                break;
            case BlockShapeType.angle2RightTop:
                this.createLShape(v2(0, 0), v2(1, 0), v2(0, 1));
                break;
            case BlockShapeType.angle3LeftBottom:
                this.createLShape(v2(2, 2), v2(0, 2), v2(2, 0));
                break;
            case BlockShapeType.angle3LeftTop:
                this.createLShape(v2(2, 0), v2(0, 0), v2(2, 2));
                break;
            case BlockShapeType.angle3RightBottom:
                this.createLShape(v2(0, 2), v2(2, 2), v2(0, 0));
                break;
            case BlockShapeType.angle3RightTop:
                this.createLShape(v2(0, 0), v2(2, 0), v2(0, 2));
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
    createLShape(center: Vec2, cornerX: Vec2, cornerY: Vec2) {
        const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy.Node.setPosition(center.x * blockSize.x, center.y * blockSize.y);
        const pxy1 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy1.Node.setPosition(cornerX.x * blockSize.x, cornerX.y * blockSize.y);
        const pxy2 = BlockFactory.inst.createSingleBlock(this._root, this._color);
        pxy2.Node.setPosition(cornerY.x * blockSize.x, cornerY.y * blockSize.y);
        this._blocks.push(pxy, pxy1, pxy2);
        let width = center.x;
        let height = center.y;
        if (cornerX.x > center.x) {
            for (let i = center.x + 1; i < cornerX.x; ++i) {
                const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
                pxy.Node.setPosition(i * blockSize.x, center.y * blockSize.y);
            }
            width = cornerX.x;
        } else if (cornerX.x < center.x) {
            for (let i = cornerX.x + 1; i < center.x; ++i) {
                const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
                pxy.Node.setPosition(i * blockSize.x, center.y * blockSize.y);
            }
        }

        if (cornerY.y > center.y) {
            height = cornerY.y;
            for (let i = center.y + 1; i < cornerY.y; ++i) {
                const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
                pxy.Node.setPosition(center.x * blockSize.x, i * blockSize.y);
            }
        } else if (cornerY.y < center.y) {
            for (let i = cornerY.y + 1; i < center.y; ++i) {
                const pxy = BlockFactory.inst.createSingleBlock(this._root, this._color);
                pxy.Node.setPosition(center.x * blockSize.x, i * blockSize.y);
            }
        }
        this._root.setSize(width * blockSize.x, height * blockSize.y);
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
