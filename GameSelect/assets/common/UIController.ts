import { AssetManager, assetManager, director } from "cc";
import * as fgui from "fairygui-cc";

// 声明全局变量类型
declare global {
    var global: any;
    var globalThis: any;
}

namespace UI {
    // 实现全局UI命名空间
    export enum ViewType {
        Base = 0,
        Pop,
        Toast,
        Loading,
    }

    export abstract class UIView<T> extends fgui.GComponent {
        view: T;
        abstract initUI(): void;
    }

    interface IEventInfo {
        name: string;
        method: string;
    }

    export class Controller {
        private static _instance: Controller | null = null;

        public static get inst(): Controller {
            if (!this._instance) {
                this._instance = new Controller();
            }
            return this._instance;
        }

        private _activeView: fgui.GObject[] = [];
        private _viewInfo: IViewInfo[] = [];
        private _eventInfo: Map<string, IEventInfo[]> = new Map();
        private _rootBase: fgui.GComponent | null = null;
        private _rootPop: fgui.GComponent | null = null;
        private _rootToast: fgui.GComponent | null = null;
        private _rootLoading: fgui.GComponent | null = null;

        initFairyGUI() {
            fgui.GRoot.create();
            this._rootBase = new fgui.GComponent();
            this._rootBase.makeFullScreen();
            fgui.GRoot.inst.addChild(this._rootBase);

            this._rootPop = new fgui.GComponent();
            this._rootPop.makeFullScreen();
            fgui.GRoot.inst.addChild(this._rootPop);

            this._rootToast = new fgui.GComponent();
            this._rootToast.makeFullScreen();
            fgui.GRoot.inst.addChild(this._rootToast);

            this._rootLoading = new fgui.GComponent();
            this._rootLoading.makeFullScreen();
            fgui.GRoot.inst.addChild(this._rootLoading);
        }

        addViewInfo(viewInfo: IViewInfo) {
            this._viewInfo.push(viewInfo);
        }

        addEventInfo(viewName: string, eventInfo: IEventInfo) {
            if (!this._eventInfo.has(viewName)) {
                this._eventInfo.set(viewName, []);
            }
            this._eventInfo.get(viewName)?.push(eventInfo);
        }

        dispatchEvent(eventName: string, ...args: any[]) {
            director.emit(eventName, ...args);
        }

        private async loadBundle(bundleName: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                assetManager.loadBundle(bundleName, (err, bundle) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            });
        }

        private async loadPackage(bundle: AssetManager.Bundle, pkg: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                fgui.UIPackage.loadPackage(bundle, "fgui/" + pkg, (err, pkg) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            });
        }

        closeView(viewName: string) {
            const view = this._activeView.find((v) => v.constructor.name == viewName);
            if (view) {
                const proto = view.constructor.prototype;
                const eventInfo = this._eventInfo.get(viewName);
                if (eventInfo) {
                    for (const info of eventInfo) {
                        director.off(info.name, proto[info.method], proto);
                    }
                }
                this._activeView = this._activeView.filter((v) => v != view);
                view.removeFromParent();
            }
        }

        async openView(viewName: string): Promise<boolean> {
            return new Promise(async (resolve, reject) => {
                const viewInfo = this._viewInfo.find((v) => v.name == viewName);
                if (!viewInfo) {
                    reject(new Error(`viewInfo not found: ${viewName}`));
                    return;
                }

                let bundle = assetManager.getBundle(viewInfo.bundleName);
                if (!bundle) {
                    await this.loadBundle(viewInfo.bundleName);
                }

                for (const pkg of viewInfo.packages) {
                    await this.loadPackage(bundle, pkg);
                }

                const ret = fgui.UIPackage.createObjectFromURL(viewInfo.url);
                if (ret == null) {
                    reject(new Error(`createObjectFromURL failed: ${viewInfo.url}`));
                    return;
                }
                ret.makeFullScreen();
                if (viewInfo.viewType == ViewType.Base) {
                    this._rootBase.addChild(ret);
                } else if (viewInfo.viewType == ViewType.Pop) {
                    this._rootPop.addChild(ret);
                } else if (viewInfo.viewType == ViewType.Toast) {
                    this._rootToast.addChild(ret);
                } else if (viewInfo.viewType == ViewType.Loading) {
                    this._rootLoading.addChild(ret);
                }

                /**bind event */
                const handler = ret?.constructor;
                if (handler) {
                    const proto = handler.prototype as UIView<any>;
                    this._activeView.push(ret);
                    const viewname = handler.name;
                    const eventInfo = this._eventInfo.get(viewname);
                    if (eventInfo) {
                        for (const info of eventInfo) {
                            director.on(info.name, proto[info.method], proto);
                        }
                    }
                    proto.view = {};
                    ret.asCom._children.forEach((child) => {
                        proto.view[child.name] = child;
                        if (child instanceof fgui.GButton) {
                            const underScoreName = child.name.split("_");
                            if (underScoreName.length > 0) {
                                const name = "onBtn" + underScoreName[underScoreName.length - 1];
                                if (proto[name]) {
                                    child.on(fgui.Event.CLICK, proto[name], proto);
                                }
                            }
                        }
                    });
                }

                handler.prototype?.initUI();
                resolve(true);
            });
        }

        /**bundle名和场景名一致 */
        changeScene(sceneName: string) {
            this._activeView.forEach((view) => {
                this.closeView(view.constructor.name);
            });
            assetManager.loadBundle(sceneName, (err, bundle) => {
                if (err) {
                    console.error(err);
                }
                director.loadScene(sceneName);
            });
        }
    }

    export function Register(viewInfo: IViewInfo) {
        return function (target: new (...args: any[]) => any) {
            if (viewInfo.packages.length == 0) {
                throw new Error("packages is empty");
            }
            const mainPkg = viewInfo.packages[viewInfo.packages.length - 1];
            const url = `ui://${mainPkg}/${viewInfo.objectName}`;
            viewInfo.url = url;
            fgui.UIObjectFactory.setExtension(url, target);
            Controller.inst.addViewInfo(viewInfo);
        };
    }

    export function Listen(eventName: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const eventInfo: IEventInfo = {
                name: eventName,
                method: propertyKey,
            };
            Controller.inst.addEventInfo(target.constructor.name, eventInfo);
        };
    }
}

interface UI {
    Controller: typeof UI.Controller;
    ViewType: typeof UI.ViewType;
    Register: typeof UI.Register;
    Listen: typeof UI.Listen;
    UIView: typeof UI.UIView;
}

// 将UI命名空间挂载到全局
declare global {
    var UI: UI;
}

// 在全局对象上挂载UI命名空间
if (typeof global !== "undefined") {
    (global as any).UI = UI;
} else if (typeof window !== "undefined") {
    (window as any).UI = UI;
}

export default UI;
