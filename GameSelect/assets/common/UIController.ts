import { AssetManager, assetManager } from "cc";
import * as fgui from "fairygui-cc";

// UI模块命名空间
export enum ViewType {
    Base = 0,
    Pop,
    Toast,
    Loading,
}

export interface IViewInfo {
    name: string;
    url?: string;
    bundleName: string;
    packages: string[];
    objectName: string;
    viewType: ViewType;
    sortingOrder?: number;
}

export interface IEventInfo {
    name: string;
    view: string;
    originalMethod: Function;
}

export interface IUIView {
    initUI(): void;
}

export class Controller {
    private static _instance: Controller | null = null;

    public static get inst(): Controller {
        if (!this._instance) {
            this._instance = new Controller();
        }
        return this._instance;
    }

    private _viewInfo: IViewInfo[] = [];
    private _eventInfo: IEventInfo[] = [];
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

    addEventInfo(eventInfo: IEventInfo) {
        this._eventInfo.push(eventInfo);
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

            resolve(true);
        });
    }
}

export function UIRegister(viewInfo: IViewInfo) {
    return function (target: new (...args: any[]) => any) {
        if (viewInfo.packages.length == 0) {
            throw new Error("packages is empty");
        }
        const mainPkg = viewInfo.packages[viewInfo.packages.length - 1];
        const url = `ui://${mainPkg}/${viewInfo.objectName}`;
        viewInfo.url = url;
        // fgui.UIObjectFactory.setExtension(url, target);
        Controller.inst.addViewInfo(viewInfo);
    };
}

export function UIListen(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const eventInfo: IEventInfo = {
            name: eventName,
            view: target.constructor.name,
            originalMethod: descriptor.value,
        };
        Controller.inst.addEventInfo(eventInfo);
    };
}
