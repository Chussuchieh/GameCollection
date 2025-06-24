'use strict';
//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md
Object.defineProperty(exports, '__esModule', { value: true });
exports.onPublish = void 0;
const csharp_1 = require('csharp');
const uideclare_1 = require('./uideclare');
function onPublish(handler) {
    console.log('uideclare Plguin start');
    // if (!csharp_1.System.IO.File.Exists(csharp_1.FairyEditor.App.preferences.PNGCompressionToolPath)) {
    //     csharp_1.FairyEditor.App.Alert('发布失败，未配置压图工具。\n请在[编辑-首选项-外部工具]界面，\n选择[fgui工程-外部工具-pngquant.exe]');
    //     console.error('发布失败，请配置完压图工具，重新发布');
    //     return;
    // }
    uideclare_1.uideclare(handler);
}
exports.onPublish = onPublish;
