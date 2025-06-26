import * as fgui from "fairygui-cc";
import BlockFactory from "./BlockFactory";
import BlockBase, { BlockColor } from "./BlockBase";
import BlockShape, { BlockShapeType, blockSize } from "./BlockShape";

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
    private _activeShapeCnt = 0;

    initUI() {
        this.initContainer();
        this.initRandomShape(this.view.KW_Helper1);
        this.initRandomShape(this.view.KW_Helper2);
        this.initRandomShape(this.view.KW_Helper3);
    }

    initRandomShape(helper: fgui.GGraph) {
        const shape = new BlockShape(BlockShapeType.doubleHor, this);
        this.addChild(shape.Root);
        shape.Root.setPosition(helper.x, helper.y);
        shape.Root.on(fgui.Event.DRAG_MOVE, this.onDragMove, this);
        shape.Root.on(fgui.Event.DRAG_END, this.onDragEnd, this);
        shape.Root.data = `${helper.name}`;
        this._activeShapeCnt++;
    }

    onDragMove(event: fgui.Event) {
        this._dragingObject = fgui.GObject.draggingObject?.asCom;
        if (!this._dragingObject) return;
        this._allContainer.forEach((container) => {
            if (container.getFill()) return;
            container.setColor(BlockColor.null);
        });
        this._dragingObject._children.forEach((child) => {
            const globalPos = child.localToGlobal(37.5, 37.5);
            this._allContainer.forEach((container) => {
                if (container.getFill()) return;
                if (container.Node.hitTest(globalPos)) {
                    container.setColor(child.asCom.getController("C_Color").selectedIndex);
                }
            });
        });
    }

    onDragEnd(event: fgui.Event) {
        const shape = this._dragingObject;
        if (!shape) return;
        this._allContainer.forEach((container) => {
            if (container.getFill()) return;
            container.setColor(BlockColor.null);
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
                container.setColor(shape._children[0].asCom.getController("C_Color").selectedIndex);
            });
            shape.removeFromParent();
            this._activeShapeCnt--;
            if (this._activeShapeCnt == 0) {
                this.initRandomShape(this.view.KW_Helper1);
                this.initRandomShape(this.view.KW_Helper2);
                this.initRandomShape(this.view.KW_Helper3);
            }
        } else {
            const helperData = this._dragingObject.data;
            if (this.view[helperData]) {
                this._dragingObject.setPosition(this.view[helperData].x, this.view[helperData].y);
            }
        }
        this._dragingObject = null;
    }

    initContainer(): void {
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
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

    onBtnClose() {
        this.changeScene("hall");
    }
}
