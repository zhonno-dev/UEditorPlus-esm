import UE from "./UE.js";

//core/
import browser from "./core/browser.js"; //浏览器检测的模块
import utils from "./core/utils.js";
import { EventBase, getListener } from "./core/EventBase.js";
import dtd from "./core/dtd.js";
import { domUtils, fillCharReg } from "./core/domUtils.js";
import domRange from "./core/Range.js";
import domSelection from "./core/Selection.js";
import UE_Editor from "./core/Editor.js";
import './core/loadconfig.js';
import ajax from "./core/ajax.js";
import api from "./core/api.js";
import image from "./core/image.js";
import dialog from "./core/dialog.js";
import filterWord from "./core/filterword.js";
import UE_uNode from "./core/node.js";
import htmlparser from "./core/htmlparser.js";
import filterNode from "./core/filternode.js";
import plugin from "./core/plugin.js";
import keymap from "./core/keymap.js";
import LocalStorage from "./core/localstorage.js";

//core/
/** 浏览器检测的模块 */
UE.browser = browser;
/** 工具函数包 */
UE.utils = utils;
/** UE采用的事件基类 */
UE.EventBase = EventBase;
/** EventBase =获得对象所拥有监听类型的所有监听器 */
UE.getListener = getListener;
/** UEditor的核心类，为用户提供与编辑器交互的接口 */
UE.Editor = UE_Editor;
/** 提供对ajax请求的支持 */
UE.ajax = ajax;
UE.api = api;
UE.image = image;
UE.dialog = dialog;
/** 根据传入html字符串过滤word */
UE.filterWord = filterWord;
/** 编辑器模拟的节点类 */
UE.uNode = UE_uNode;
/** html字符串转换成uNode节点 */
UE.htmlparser = htmlparser;
/** 根据传入节点和过滤规则过滤相应节点 */
UE.filterNode = filterNode;
UE.plugin = plugin;
UE.keymap = keymap;
UE.LocalStorage = LocalStorage;


/**
 * dtd html语义化的体现类，引用自 "./core/dtd.js" 模块
 * @type {import('./core/dtd.js').default}
 */
UE.dom.dtd = dtd;
/** Dom操作工具包 */
UE.dom.domUtils = domUtils;
/** ？？？ */
UE.dom.fillCharReg = fillCharReg;
/** Range封装 */
UE.dom.Range = domRange;
/** 选集 */
UE.dom.Selection = domSelection;