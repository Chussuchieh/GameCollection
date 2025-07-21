import { EventKeyboard, Input, input, KeyCode, Vec2 } from "cc";
import * as fgui from "fairygui-cc";

@UI.Register({
    name: "FishView",
    bundleName: "fish",
    packages: ["Fish"],
    objectName: "FishView",
    viewType: UI.Layer.Base,
})
export default class FishView extends UI.ViewBase<FGUI_Fish_FishView_Declare> {
    private _score = 0;
    /** 当前等级
     *   0 - 4
     */
    private _level = 0;
    private _isStart = false;
    private _handleMoveRange = new Vec2(0, 0);
    private _pressingS = false;
    /**鱼 */
    private _fishLastMoveTime = 0;
    private _fishMoveRange = new Vec2(0, 0);
    private _fishCnt = new Array(5).fill(0);

    /**宝箱 */
    private _boxCnt = 0;
    private _boxShowed = false;
    private _boxMoveRange = new Vec2(0, 0);

    initUI() {
        console.log("FishView initUI");
        this._handleMoveRange.set(
            this.view.KW_MoveBack.y,
            this.view.KW_MoveBack.y + this.view.KW_MoveBack.height - this.view.KW_Handle.height
        );
        this._fishMoveRange.set(this.view.KW_MoveBack.y, this.view.KW_MoveBack.y + this.view.KW_MoveBack.height - this.view.KW_Fish.height);
        this._boxMoveRange.set(this.view.KW_MoveBack.y, this.view.KW_MoveBack.y + this.view.KW_MoveBack.height - this.view.KW_Box.height);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (!this._isStart) {
            return;
        }
        switch (event.keyCode) {
            case KeyCode.KEY_S:
                this._pressingS = true;
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (!this._isStart) {
            return;
        }
        switch (event.keyCode) {
            case KeyCode.KEY_S:
                this._pressingS = false;
                break;
        }
    }
    onBtnBack() {
        this.changeScene("hall", "HallView");
    }

    onBtnEvent() {
        this.dispatch("event_test", "arg1", "arg2");
    }

    randomLevel() {
        this._level = Math.floor(Math.random() * 5);
        this.updateText(this.view.KW_TxtLevel, this._level);
        this.view.KW_Fish.C_Level.selectedIndex = this._level;
    }

    onBtnStart() {
        this.start();
    }

    start() {
        this.randomLevel();
        this._isStart = true;
        this.view.KW_Fish.visible = true;
        this.view.KW_Handle.visible = true;
        this.view.KW_Fish.y = this._fishMoveRange.y;
        this.view.KW_Handle.y = this._handleMoveRange.y;
        this.view.KW_Progress.value = 5;
        this._fishLastMoveTime = new Date().getTime();
        this.fishMove(this._fishMoveRange.x + this.view.KW_MoveBack.height * 0.5);
        this.schedule(this.update, 0);
    }

    update = () => {
        if (this.view.KW_Progress.value >= 100) {
            this.finish(true);
            return;
        }

        if (this.view.KW_Progress.value <= 0) {
            this.finish(false);
            return;
        }

        if (this.view.KW_Box.visible && this.view.KW_Box.KW_Progress.value >= 100) {
            this.finishBox();
        }

        const fishInHandle =
            this.view.KW_Fish.y >= this.view.KW_Handle.y &&
            this.view.KW_Fish.y + this.view.KW_Fish.height <= this.view.KW_Handle.y + this.view.KW_Handle.height;

        if (fishInHandle) {
            this.view.KW_Progress.value += 0.2;
        } else {
            this.view.KW_Progress.value -= 0.1;
        }

        if (this.view.KW_Box.visible) {
            const boxInHandle =
                this.view.KW_Box.y >= this.view.KW_Handle.y &&
                this.view.KW_Box.y + this.view.KW_Box.height <= this.view.KW_Handle.y + this.view.KW_Handle.height;
            if (boxInHandle) {
                this.view.KW_Box.KW_Progress.value += 0.5;
            } else {
                this.view.KW_Box.KW_Progress.value = Math.max(this.view.KW_Box.KW_Progress.value - 0.3, 0);
            }
        }

        if (this._pressingS) {
            if (this.view.KW_Handle.y - 4 >= this._handleMoveRange.x) {
                this.view.KW_Handle.y -= 4;
            } else {
                this.view.KW_Handle.y = this._handleMoveRange.x;
            }
        } else {
            if (this.view.KW_Handle.y + 3 <= this._handleMoveRange.y) {
                this.view.KW_Handle.y += 3;
            } else {
                this.view.KW_Handle.y = this._handleMoveRange.y;
            }
        }

        const now = new Date().getTime();
        const moveTimeOff = now - this._fishLastMoveTime;
        if (moveTimeOff >= this.getFishMoveInterval()) {
            this.fishMove();
            this._fishLastMoveTime = now;
        }
        if (this._boxShowed == false && Math.random() < 0.001) {
            this.showBox();
            this._boxShowed = true;
        }
    };

    private finish(win = false) {
        this.finishBox(false);
        this._isStart = false;
        this.unschedule(this.update);
        if (win) {
            this._score += this.getScore();
            this.updateText(this.view.KW_TxtScore, this._score, true);
            this._fishCnt[this._level]++;
            this.updateText(this.view["KW_TxtCnt" + this._level], this._fishCnt[this._level], true);
        }
        this.view.KW_Progress.value = 0;
        this.view.KW_TxtLevel.text = "0";
        this.view.KW_Fish.visible = false;
        this.view.KW_Handle.visible = false;
        this._boxShowed = false;
        this._pressingS = false;
    }

    private getScore() {
        return (this._level + 1) * 10;
    }

    private getFishMoveInterval() {
        return 2500 / (this._level + 1);
    }

    /**start默认0，从最小开始
     * 但是第一次不能太小，否则可能直接丢失
     */
    private fishMove(startY = this._fishMoveRange.x) {
        const newPos = Math.random() * (this._fishMoveRange.y - startY) + startY;
        fgui.GTween.kill(this.view.KW_Fish);
        fgui.GTween.to(this.view.KW_Fish.y, newPos, 0.5)
            .setTarget(this.view.KW_Fish, (y: number) => {
                this.view.KW_Fish.y = y;
            })
            .setEase(fgui.EaseType.SineOut);
    }

    //region 宝箱
    private showBox() {
        const box = this.view.KW_Box;
        box.visible = true;
        box.y = Math.random() * (this._boxMoveRange.y - this._boxMoveRange.x) + this._boxMoveRange.x;
        box.KW_Progress.value = 0;
    }

    private finishBox(get = true) {
        if (get) {
            this._boxCnt++;
            this.updateText(this.view.KW_TxtCntBox, this._boxCnt, true);
        }
        this.view.KW_Box.visible = false;
        this.view.KW_Box.KW_Progress.value = 0;
    }

    //region 更新文本
    updateText(node: fgui.GTextField, number: number, ani = false) {
        node.text = number + "";
        if (ani) {
            node.setScale(2, 2);
            fgui.GTween.to(2, 1, 0.5).setTarget(node, (scale: number) => {
                node.setScale(scale, scale);
            });
        }
    }
}
