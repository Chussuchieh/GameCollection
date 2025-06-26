import * as fgui from "fairygui-cc";
import BlockFactory, { BlockColor, blockSize, BlockType } from "./BlockFactory";
import { v2 } from "cc";

@UI.Register({
    name: "TetrisView",
    bundleName: "tetris",
    packages: ["Tetris"],
    objectName: "TetrisView",
    viewType: UI.Layer.Base,
})
export default class TetrisView extends UI.ViewBase<FGUI_Tetris_TetrisView_Declare> {
    private allContainer: fgui.GComponent[] = [];

    initUI() {
        this.initContainer();
        const shape = BlockFactory.inst.createBlockShape(BlockType.doubleHor);
        this.addChild(shape);
        shape.setPosition(this.view.KW_Helper1.x, this.view.KW_Helper1.y);
        shape.on(fgui.Event.DRAG_MOVE, (event: fgui.Event) => {
            this.allContainer.forEach((container) => {
                const colorController = container.getController("C_Color");
                colorController.selectedIndex = BlockColor.null;
            });
            shape._children.forEach((child) => {
                const globalPos = child.localToGlobal(37.5, 37.5);
                this.allContainer.forEach((container) => {
                    const colorController = container.getController("C_Color");
                    if (container.hitTest(globalPos)) {
                        colorController.selectedIndex = child.asCom.getController("C_Color").selectedIndex;
                    }
                });
            });
        });
    }

    initContainer(): void {
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                const container = BlockFactory.inst.createSingleBlock();
                this.addChild(container);
                container.setPosition(
                    this.view.KW_HelperContainer.x + (j - 4) * blockSize.x,
                    this.view.KW_HelperContainer.y + (i - 4) * blockSize.y
                );
                this.allContainer.push(container);
            }
        }
    }

    onBtnClose() {
        this.changeScene("hall");
    }
}
