"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md
var FairyEditor = CS.FairyEditor;
var FairyGUI = CS.FairyGUI;
const App = FairyEditor.App;
const FAIRUI_ROOT_BIN = FairyEditor.App.pluginManager.basePath + '\\copy_new_package\\bin\\res\\';
const puerts_1 = require("puerts");
const tsProjectToolsPath = App.pluginManager.basePath + "\\copy_new_package";
FairyEditor.App.pluginManager.LoadUIPackage(FAIRUI_ROOT_BIN + 'CopyNewPackage');
// 添加右键菜单选项
let menu = App.libView.contextMenu_Package;
console.log(menu);
menu.AddItem('复制新资源包', 'copyNewPackage', 3, false, (str) => {
    console.log('复制新资源包', str);
    const chooseFolder = App.libView.GetSelectedFolder();
    let panel = FairyGUI.UIPackage.CreateObject('CopyNewPackage', 'Main').asCom;
    let view = new FairyGUI.GComponent();
    view.x = Math.ceil((1980 - panel.viewWidth) * 0.5);
    view.y = Math.ceil((1080 - panel.viewHeight) * 0.5);
    view.AddChild(panel);
    view.draggable = true;
    FairyGUI.GRoot.inst.AddChild(view);
    panel.GetChild("psdInput").title = chooseFolder.name;
    panel.GetChild("close").onClick.Add(() => {
        panel.RemoveFromParent();
    });
    panel.GetChild("sure").onClick.Add(() => {
        const newPackageName = panel.GetChild("psdInput").title;
        if (!newPackageName || newPackageName.trim() == '' || newPackageName.trim() == chooseFolder.name || newPackageName.trim() == 'Game_Name_Package') {
            console.log('请输入新资源包名称');
            return;
        }
        //判断资源包是否存在
        if (App.project.GetPackageByName(newPackageName)) {
            console.log('该资源包已存在！');
            return;
        }
        //添加判空判断
        const packageMap = {}; // 存储包ID的映射
        const newGameNameList = newPackageName.split('_'); // 解析新游戏名
        if (newGameNameList[0] == 'Game') {
            console.log('新游戏名', newGameNameList[1]);
            const newGameName = newGameNameList[1];
            // 添加判空判断
            if (chooseFolder.name && chooseFolder.name.trim() !== '') {
                const chooseFolder = App.libView.GetSelectedFolder();
                const oldGameName = chooseFolder.name.split('_')[1]; // 解析老游戏名
                // console.log('老游戏名', oldGameName);
                // 遍历所有资源包
                const packages = App.project.allPackages;
                packages.ForEach(pkg => {
                    if (pkg.name.startsWith(`Game_${oldGameName}`)) {
                        const oldPackageEnd = pkg.name.substring(`Game_${oldGameName}_`.length); // 去除掉 Game_${oldGameName}_ 的部分
                        const oldPackageId = pkg.id; // 获取老游戏包ID
                        // console.log('老游戏包ID', oldPackageId, oldPackageEnd);
                        // 获取新游戏包ID
                        const newPackageId = App.project.GetPackageByName(`Game_${newGameName}_${oldPackageEnd}`);
                        // console.log(`find`, `Game_${newGameName}_${oldPackageEnd}`, newPackageId);
                        if (newPackageId?.id) {
                            packageMap[oldPackageId] = newPackageId.id; // 存储key-value
                            // console.log(`映射: ${oldPackageId} -> ${newPackageId.id}`);
                        }
                    }
                });
                packageMap[`Game_${oldGameName}`.toLowerCase()] = `Game_${newGameName}`.toLowerCase();
                console.log('packages.ForEach', JSON.stringify(packageMap));
            }
        }
        // console.log('newPackageName', newPackageName)
        // 添加判空判断
        if (str && str.trim() !== '') {
            const chooseFolder = App.libView.GetSelectedFolder();
            const sourcePath = chooseFolder.file;
            console.log('复制新资源包 file', sourcePath, chooseFolder.fileName, chooseFolder.name, chooseFolder.path);
            // 添加判空判断
            if (sourcePath && sourcePath.trim() !== '') {
                const destinationPath = sourcePath.substring(0, sourcePath.lastIndexOf('\\')) + '\\' + newPackageName; // 使用puer的方法构建目标路径
                // console.log('复制新资源包to file 1', destinationPath, sourcePath.lastIndexOf('\\'));
                // 添加判空判断
                if (destinationPath && destinationPath.trim() !== '') {
                    // console.log('复制新资源包to file', newPackageName);
                    const newPackage = App.project.CreatePackage(newPackageName);
                    // FairyEditor.IOUtil.CopyFile(sourcePath, destinationPath); // 使用puer的方法进行复制
                    // console.log(`已成功复制文件夹 "${sourcePath}" 到 "${destinationPath}"`, newPackage.basePath);
                    const listType = (0, puerts_1.$generic)(CS.System.Collections.Generic.List$1, CS.System.String);
                    const list = new listType();
                    list.Add(sourcePath); // 文件路径
                    list.Add(destinationPath); // path
                    const jsonEncodeStr = encodeURIComponent(JSON.stringify(packageMap));
                    list.Add(jsonEncodeStr); // path
                    // tsProjectToolsPath是当前插件的路径  fs2desc.js则是在当前插件的目录下自己手动创建一个  这样就可以在fs2desc.js里写fs的相关逻辑了
                    console.log('fs2desc', sourcePath, destinationPath, jsonEncodeStr);
                    FairyEditor.ProcessUtil.Start("node fs2desc.js ", list.ToArray(), tsProjectToolsPath, true);
                    // FairyEditor.ProcessUtil.Start("node fs2desc.js ", list.ToArray() as any, tsProjectToolsPath, true)// list则是传入的参数 process.argv[2]开始为第一个
                    App.RefreshProject();
                }
                else {
                    console.error('目标路径无效');
                }
            }
            else {
                console.error('当前文件夹路径无效');
            }
        }
        else {
            console.error('当前选中的资源包名称无效');
        }
    });
});
