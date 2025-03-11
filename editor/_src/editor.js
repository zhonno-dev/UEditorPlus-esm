//TODO 这里需要import 配置|ueditor.config.js，然后赋值给 UEDITOR_CONFIG

import './core.js';
import './ui.js';

import UE from "./UE.js";
//旧 baidu.editor = 新 UE





//adapter/









//zhu:！这个 dom 可能会需要单独变成一个 esm 实现 import dom from ~
// var dom = (UE.dom = {});

export default UE;