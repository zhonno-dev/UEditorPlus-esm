//TODO 这里需要import 配置|ueditor.config.js，然后赋值给 UEDITOR_CONFIG

//旧 baidu.editor = 新 UE
import UE from "./UE.js";
import UEDITOR_CONFIG from "../ueditor.config.js";
UE.UEDITOR_CONFIG = UEDITOR_CONFIG;

//core/
import './core.js';

//plugins/
import './plugins/basestyle.js';
import './plugins/anchor.js';
import './plugins/paste.js';
import './plugins/copy.js';
import './plugins/inserthtml.js';

//ui/
import './ui.js';

//adapter/
import './adapter/editorui.js';
// import './adapter/editor.js';
import './adapter/message.js';

// console.log(UE.ui);


//lang/
import '../lang/zh-cn/zh-cn.js';

//zhu:！这个 dom 可能会需要单独变成一个 esm 实现 import dom from ~
// var dom = (UE.dom = {});


export default UE;