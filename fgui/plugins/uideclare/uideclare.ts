/* eslint-disable */
import { FairyEditor, FairyGUI, System } from 'csharp';
import CodeWriter from './CodeWriter';

let classNamePrefix = 'FGUI_';
let startNamePrefix = '';
const endNamePrefix = '_Declare';
const CompTypeStringArray = ['fgui.GComponent', 'fgui.GButton', 'fgui.GComboBox', 'fgui.GLabel', 'fgui.GProgressBar'];
function uideclare(handler: FairyEditor.PublishHandler) {
    // if (!handler.genCode) return;
    let settings = (<FairyEditor.GlobalPublishSettings>handler.project.GetSettings('Publish')).codeGeneration;
    let codePkgName = handler.ToFilename(handler.pkg.name); //代码生成文件夹名（包名）
    // let uideclarePath = handler.exportPath.substring(0, handler.exportPath.indexOf('assets')) + 'uideclare'; //资源发布路径
    const exportCodePath = formatVarValue(handler.exportCodePath);

    handler.SetupCodeFolder(exportCodePath, 'd.ts');

    let ns = 'fgui';
    // let namespaceName = codePkgName;

    // if (settings.packageName) namespaceName = settings.packageName + '.' + namespaceName;
    startNamePrefix = `${classNamePrefix}${codePkgName}_`;

    let classes = handler.CollectClasses(settings.ignoreNoname, settings.ignoreNoname, ns);

    let classCnt = classes.Count;
    let declareWriter = new CodeWriter({ blockFromNewLine: false, usingTabs: true }); //写.d.ts
    for (let i: number = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        let members = classInfo.members;
        declareWriter.reset();
        declareWriter.writeln('/* eslint-disable @typescript-eslint/no-empty-interface */');
        declareWriter.writeln('declare interface %s%s%s extends %s', startNamePrefix, classInfo.className, endNamePrefix, classInfo.superClassName);
        declareWriter.startBlock();

        let memberCnt = members.Count;
        for (let j: number = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            exportType(declareWriter, classes, memberInfo, classInfo.className);
        }
        declareWriter.endBlock();

        // declareWriter.save(uideclarePath + '/' + classInfo.className + startNamePrefix + '.d.ts');
        declareWriter.save(exportCodePath + '/' + startNamePrefix + classInfo.className + '.d.ts');

        // console.log('create .d.ts file success: ' + exportCodePath + '/' + classInfo.className + startNamePrefix + '.d.ts');
    }
}

function getAllType(classes: System.Collections.Generic.List$1<FairyEditor.PublishHandler.ClassInfo>, memberInfo: FairyEditor.PublishHandler.MemberInfo, className: string): Object {
    const classCnt = classes.Count;
    const obj = {};
    if (!memberInfo.varName) {
        console.error(`${className.substring(5)} 组件中有名字为空的元件，已跳过该元件导出，请至少为每个元件给个默认名字!!!`);
        return obj;
    }
    //自定义数据
    if (memberInfo.type.startsWith(classNamePrefix)) {
        // console.log(`自定义组件：type: ${memberInfo.type}, name: ${memberInfo.varName}`);
        for (let k: number = 0; k < classCnt; k++) {
            let classInfo2 = classes.get_Item(k);
            if (memberInfo.type == classInfo2.className) {
                let cnt = classInfo2.members.Count;
                obj[memberInfo.varName] = {};
                for (let h: number = 0; h < cnt; h++) {
                    let memberInfo2 = classInfo2.members.get_Item(h);
                    obj[memberInfo.varName][memberInfo2.varName] = getAllType(classes, memberInfo2, classInfo2.className)[memberInfo2.varName];
                }
            }
        }
    } else if (CompTypeStringArray.includes(memberInfo.type)) {
        // 其他包里面的组件
        const fileName = memberInfo.res?.fileName;
        if (fileName) {
            obj[memberInfo.varName] = `${memberInfo.type} & ` + classNamePrefix + fileName.substring(0, fileName.lastIndexOf('.xml')) + endNamePrefix;
        } else {
            obj[memberInfo.varName] = memberInfo.type + ' & any';
        }
    } else {
        obj[memberInfo.varName] = memberInfo.type;
    }
    return obj;
}

function exportType(
    declareWriter: CodeWriter,
    classes: System.Collections.Generic.List$1<FairyEditor.PublishHandler.ClassInfo>,
    memberInfo: FairyEditor.PublishHandler.MemberInfo,
    className: string
): void {
    const obj = getAllType(classes, memberInfo, className);
    outputType(declareWriter, obj);
}

function outputType(declareWriter: CodeWriter, obj: Object) {
    for (let key in obj) {
        const isPrivate = isPrivateKey(key);
        if (isPrivate) {
            continue;
        }
        if (typeof obj[key] === 'object') {
            console.log('输出组件类型：', key, JSON.stringify(obj[key]));
            if (isPrivateAllKeys(obj[key], key)) {
                declareWriter.writeln('%s: fgui.GComponent;', key);
            } else {
                declareWriter.writeln('%s: fgui.GComponent &', key);
                declareWriter.startBlock();
                outputType(declareWriter, obj[key]);
                declareWriter.endBlock();
            }
        } else {
            if ((key == 'icon' && obj[key] == 'fgui.GLoader') || (key == 'title' && obj[key] == 'fgui.GTextField')) {
                declareWriter.writeln('%sObj: %s;', key, obj[key]);
            } else if (key.startsWith('cgl_') && obj[key] == 'fgui.GList') {
                declareWriter.writeln('%s: %s;', key, 'fgui.GListLayout');
            } else {
                if (typeof obj[key] === 'string' && !obj[key].startsWith('fgui.')) {
                    declareWriter.writeln('%s: fgui.GComponent & %s;', key, startNamePrefix + obj[key] + endNamePrefix);
                } else {
                    declareWriter.writeln('%s: %s;', key, obj[key]);
                }
            }
        }
    }
}

function isPrivateKey(key: string): boolean {
    if (!key) {
        return false;
    }
    return /^c[0-9]+$/gu.test(key) || /^t[0-9]+$/gu.test(key) || /^n[0-9]+$/gu.test(key);
}

function isPrivateAllKeys(obj: { [key: string]: any }, currKey: string): boolean {
    return Object.keys(obj).every((v) => isPrivateKey(v));
}

function formatVarValue(path: string): string {
    if (!path) {
        // 如果为空字符串，则表示全局发布路径
        path = (<FairyEditor.GlobalPublishSettings>FairyEditor.App.project.GetSettings('Publish')).path;
    }

    const all = (<FairyEditor.CustomProps>FairyEditor.App.project.GetSettings('CustomProperties')).elements;
    const match = path.match(/\{(.*)\}/g);
    let result = FairyEditor.App.project.basePath;
    if (!match) {
        return formatUrl(System.IO.Path.Combine(result, path));
    }
    for (let str of match) {
        path = path.replace(str, all.get_Item(str.slice(1, str.length - 1)));
    }
    return formatUrl(System.IO.Path.Combine(result, path));
}

function formatUrl(path: string, is2Win: boolean = true): string {
    if (!path) {
        return '';
    }
    // path = path.replace(/\\\\/g, '/');
    // path = path.replace(/\\/g, '/');
    // if (is2Win && !FairyEditor.App.isMacOS) {
    //     path = path.replace(/\//g, '\\');
    //     path = path.replace('fguiproject\\..', '');
    // } else {
    //     path = path.replace('fguiproject/..', '');
    // }
    return path;
}

export { uideclare };
