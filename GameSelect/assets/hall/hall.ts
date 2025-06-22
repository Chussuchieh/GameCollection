import { _decorator, assetManager, Component, Node } from 'cc';
import * as fgui from "fairygui-cc";
import HallView from './layer/Hall/HallView';
const { ccclass, property } = _decorator;

@ccclass('hall')
export class hall extends Component {
    start() {
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage(assetManager.getBundle('hall'), 'fgui/Hall', () => {
            fgui.UIObjectFactory.setExtension(HallView.URL, HallView)
            fgui.GRoot.inst.addChild(HallView.createInstance());
        })
    }

    update(deltaTime: number) {

    }
}


