import { _decorator, assetManager, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start')
export class start extends Component {
    start() {
        assetManager.loadBundle('hall', () => {
            director.loadScene('hall')
        })
    }

    update(deltaTime: number) {

    }
}


