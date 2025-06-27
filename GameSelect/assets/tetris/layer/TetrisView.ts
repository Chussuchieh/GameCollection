import * as fgui from "fairygui-cc";
import BlockFactory from "./BlockFactory";
import BlockBase, { BlockColor } from "./BlockBase";
import BlockShape, { BlockShapeType, blockSize } from "./BlockShape";
import { CONTAINER_SIZE } from "../config/ConfigGame";

@UI.Register({
    name: "TetrisView",
    bundleName: "tetris",
    packages: ["Tetris"],
    objectName: "TetrisView",
    viewType: UI.Layer.Base,
})
export default class TetrisView extends UI.ViewBase<FGUI_Tetris_TetrisView_Declare> {
    private _allContainer: BlockBase[] = [];
    private _dragingObject: fgui.GComponent | null = null;
    private _dragingColor: number = 0;
    private _activeShapeCnt = 0;
    private _clearLine: number[] = [];
    private _clearRow: number[] = [];

    initUI() {
        this.initContainer();
        this.initThreeShape();
    }

    initRandomShape(index: number) {
        const helper = this.view[`KW_Helper${index + 1}`];
        let shape = new BlockShape(this);
        shape.Root.on(fgui.Event.DRAG_MOVE, this.onDragMove, this);
        shape.Root.on(fgui.Event.DRAG_END, this.onDragEnd, this);
        shape.Root.data = `${helper.name}`;
        shape.genShape();
        shape.Root.setPosition(helper.x - shape.Root.width * 0.5, helper.y - shape.Root.height * 0.5);
        this._activeShapeCnt++;
    }

    onDragMove(event: fgui.Event) {
        this._dragingObject = fgui.GObject.draggingObject?.asCom;
        if (!this._dragingObject) return;
        this._allContainer.forEach((container) => {
            container.clearPreviewColor();
        });
        const allHitContainer: BlockBase[] = [];
        this._dragingObject._children.forEach((child) => {
            this._dragingColor = child.asCom.getController("C_Color").selectedIndex;
            const globalPos = child.localToGlobal(37.5, 37.5);
            this._allContainer.forEach((container) => {
                if (container.getFill()) return;
                if (container.Node.hitTest(globalPos)) {
                    allHitContainer.push(container);
                }
            });
        });
        if (allHitContainer.length == this._dragingObject._children.length) {
            allHitContainer.forEach((container) => {
                container.setPreviewColor(this._dragingColor);
            });
        }
        this.checkBoxPreview();
    }

    onDragEnd(event: fgui.Event) {
        const shape = this._dragingObject;
        if (!shape) return;
        this._allContainer.forEach((container) => {
            if (container.getFill()) return;
            container.clearPreviewColor();
        });
        let allTrigger = new Array(shape.numChildren).fill(false);
        let allTriggerContainer: BlockBase[] = [];
        shape._children.forEach((child, index) => {
            const globalPos = child.localToGlobal(37.5, 37.5);
            this._allContainer.forEach((container) => {
                if (container.getFill()) return;
                if (container.Node.hitTest(globalPos)) {
                    allTrigger[index] = true;
                    allTriggerContainer.push(container);
                }
            });
        });
        if (allTrigger.every((trigger) => trigger)) {
            allTriggerContainer.forEach((container) => {
                container.setFill(true);
                container.setColor(this._dragingColor);
            });
            shape.removeFromParent();
            this._activeShapeCnt--;
            if (this._activeShapeCnt == 0) {
                this.initThreeShape();
            }
        } else {
            const helperData = this._dragingObject.data;
            if (this.view[helperData]) {
                this._dragingObject.setPosition(
                    this.view[helperData].x - this._dragingObject.width * 0.5,
                    this.view[helperData].y - this._dragingObject.height * 0.5
                );
            }
        }
        this._dragingColor = 0;
        this._dragingObject = null;
        this.checkBoxClear();
    }

    checkBoxPreview(): void {
        this._clearLine = [];
        this._clearRow = [];
        for (let i = 0; i < CONTAINER_SIZE; ++i) {
            const line = this._allContainer.slice(i * CONTAINER_SIZE, (i + 1) * CONTAINER_SIZE);
            if (line.every((container) => container.getFill() || container.getPreviewColor() == this._dragingColor)) {
                line.forEach((container) => {
                    container.setPreviewColor(this._dragingColor);
                });
                this._clearLine.push(i);
            }
            const row = [];
            for (let j = 0; j < CONTAINER_SIZE; ++j) {
                row.push(this._allContainer[j * CONTAINER_SIZE + i]);
            }
            if (row.every((container) => container.getFill() || container.getPreviewColor() == this._dragingColor)) {
                row.forEach((container) => {
                    container.setPreviewColor(this._dragingColor);
                });
                this._clearRow.push(i);
            }
        }
    }

    checkBoxClear(): void {
        this._clearLine.forEach((line) => {
            const deleteLine = this._allContainer.slice(line * CONTAINER_SIZE, (line + 1) * CONTAINER_SIZE);
            deleteLine.forEach((container) => {
                container.setFill(false);
                container.clearPreviewColor();
                container.setColor(BlockColor.null);
            });
        });

        this._clearRow.forEach((row) => {
            const deleteRow = [];
            for (let j = 0; j < CONTAINER_SIZE; ++j) {
                deleteRow.push(this._allContainer[j * CONTAINER_SIZE + row]);
            }
            deleteRow.forEach((container) => {
                container.setFill(false);
                container.clearPreviewColor();
                container.setColor(BlockColor.null);
            });
        });
        this._clearRow = [];
        this._clearLine = [];
    }

    initContainer(): void {
        for (let i = 0; i < CONTAINER_SIZE; ++i) {
            for (let j = 0; j < CONTAINER_SIZE; ++j) {
                const container = BlockFactory.inst.createSingleBox(this);
                this.addChild(container.Node);
                container.Node.setPosition(
                    this.view.KW_HelperContainer.x + (j - 4) * blockSize.x,
                    this.view.KW_HelperContainer.y + (i - 4) * blockSize.y
                );
                this._allContainer.push(container);
            }
        }
    }

    initThreeShape() {
        this._activeShapeCnt = 0;
        this.initRandomShape(0);
        this.initRandomShape(1);
        this.initRandomShape(2);
    }

    onBtnClose() {
        this.changeScene("hall");
    }

    onBtnReplay() {
        this._allContainer.forEach((container) => {
            container.setFill(false);
            container.clearPreviewColor();
            container.setColor(BlockColor.null);
        });
        this._children.forEach((child) => {
            if (child.name == "BlockShape") {
                child.removeFromParent();
            }
        });
        this.initThreeShape();
    }
}
