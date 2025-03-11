//TODO 这里需要import 配置|ueditor.config.js，然后赋值给 UEDITOR_CONFIG

//旧 baidu.editor = 新 UE
import UE from "./UE.js";
import '../ueditor.config.js';

import './core.js';
import './ui.js';

//adapter/
import './adapter/editorui.js';
import './adapter/editor.js';
import './adapter/message.js';

//lang/
import '../lang/zh-cn/zh-cn.js';

//zhu:！这个 dom 可能会需要单独变成一个 esm 实现 import dom from ~
// var dom = (UE.dom = {});

export default UE;