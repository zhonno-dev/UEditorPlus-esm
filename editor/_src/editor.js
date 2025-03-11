//TODO 这里需要import 配置|ueditor.config.js，然后赋值给 UEDITOR_CONFIG

import UE from "./UE.js";
import browser from "./core/browser.js"; //浏览器检测的模块
import utils from "./core/utils.js";
import { EventBase, getListener } from "./core/EventBase.js";
import dtd from "./core/dtd.js";
import { domUtils, fillCharReg } from "./core/domUtils.js";
import domRange from "./core/Range.js";
import domSelection from "./core/Selection.js";
import UE_Editor from "./core/Editor.js";
import './loadconfig.js';
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

//旧 baidu.editor = 新 UE


/** 编辑器入口对象 */
const UE = {
	version: "4.3.0", //TODO 版本号待定
	/** 编辑器配置 */
	UEDITOR_CONFIG: {

	},
	plugins: {},
	commands: {},
	instants: {},
	I18N: {},
	_customizeUI: {},
	plus: {
		fileExt: function (filename) {
			if (!filename) {
				return '';
			}
			var pcs = filename.split('.');
			if (pcs.length > 1) {
				return pcs.pop().toLowerCase();
			}
			return '';
		}
	},
	constants: {
		STATEFUL: {
			DISABLED: -1,
			OFF: 0,
			ON: 1,
		},
	},
	dom: {
		/** dtd html语义化的体现类 */
		dtd: dtd,
		/** Dom操作工具包 */
		domUtils: domUtils,
		/** ？？？ */
		fillCharReg: fillCharReg,
		/** Range封装 */
		Range: domRange,
		/** 选集 */
		Selection: domSelection,
		
	},

	//core/
	/** 浏览器检测的模块 */
	browser: browser,
	/** 工具函数包 */
	utils: utils,
	/** UE采用的事件基类 */
	EventBase: EventBase,
	/** EventBase:获得对象所拥有监听类型的所有监听器 */
	getListener: getListener,
	/** UEditor的核心类，为用户提供与编辑器交互的接口 */
	Editor: UE_Editor,
	/** 提供对ajax请求的支持 */
	ajax: ajax,
	api: api,
	image: image,
	dialog: dialog,
	/** 根据传入html字符串过滤word */
	filterWord: filterWord,
	/** 编辑器模拟的节点类 */
	uNode: UE_uNode,
	/** html字符串转换成uNode节点 */
	htmlparser: htmlparser,
	/** 根据传入节点和过滤规则过滤相应节点 */
	filterNode: filterNode,
	plugin: plugin,
	keymap: keymap,
	LocalStorage: LocalStorage,

	//ui/
	ui: {
		
	},
}

//zhu:！这个 dom 可能会需要单独变成一个 esm 实现 import dom from ~
// var dom = (UE.dom = {});

export default UE;