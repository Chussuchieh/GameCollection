//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md

import { FairyEditor, System } from 'csharp';
import { uideclare } from './uideclare';

function onPublish(handler: FairyEditor.PublishHandler) {
    console.log('uideclare Plguin start');
    // if (!System.IO.File.Exists(FairyEditor.App.preferences.PNGCompressionToolPath)) {
    //     FairyEditor.App.Alert('发布失败，未配置压图工具。\n请在[编辑-首选项-外部工具]界面，\n选择[fgui工程-外部工具-pngquant.exe]');
    //     console.error('发布失败，请配置完压图工具，重新发布');
    //     return;
    // }
    uideclare(handler);
}

export { onPublish };
