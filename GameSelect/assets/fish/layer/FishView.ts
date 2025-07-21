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
        this.view.KW_TxtLevel.text = this._level + "";
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
        this.fishMove();
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
        this._isStart = false;
        this.unschedule(this.update);
        if (win) {
            this._score += this.getScore();
            this.view.KW_TxtScore.text = this._score + "";
            this._fishCnt[this._level]++;
            this.view["KW_TxtCnt" + this._level].text = this._fishCnt[this._level] + "";
        }
        this.view.KW_Progress.value = 0;
        this.view.KW_TxtLevel.text = "0";
        this.view.KW_Fish.visible = false;
        this.view.KW_Handle.visible = false;
        this._boxShowed = false;
        this._pressingS = false;
    }

    private finishBox() {
        this._boxCnt++;
        this.view.KW_TxtCntBox.text = this._boxCnt + "";
        this.view.KW_Box.visible = false;
        this.view.KW_Box.KW_Progress.value = 0;
    }

    private getScore() {
        return (this._level + 1) * 10;
    }

    private getFishMoveInterval() {
        return 2500 / (this._level + 1);
    }

    private fishMove() {
        const newPos = Math.random() * (this._fishMoveRange.y - this._handleMoveRange.x) + this._handleMoveRange.x;
        fgui.GTween.kill(this.view.KW_Fish);
        fgui.GTween.to(this.view.KW_Fish.y, newPos, 0.5)
            .setTarget(this.view.KW_Fish, (y: number) => {
                this.view.KW_Fish.y = y;
            })
            .setEase(fgui.EaseType.SineOut);
        console.log("fishMove", newPos);
    }

    //region 宝箱
    private showBox() {
        const box = this.view.KW_Box;
        box.visible = true;
        box.y = Math.random() * (this._boxMoveRange.y - this._boxMoveRange.x) + this._boxMoveRange.x;
        box.KW_Progress.value = 0;
    }
}
