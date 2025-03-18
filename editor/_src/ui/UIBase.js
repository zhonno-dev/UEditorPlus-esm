//把原本的 _src/ui/uibase.js 改为用class extends EventBase 的类定义语法

import utils from "../core/utils.js";
import uiUtils from "./uiutils.js";
import EventBase from "../core/EventBase.js";
import { domUtils } from "../core/domUtils.js";

class cls_UIBase extends EventBase {
	//属性：
	id = null;
	el = null;
	className = "";
	uiName = "";
	uiIsShow = true;
	uiShowStyleBackupValue = null;
	/** 本UI的全局键名，即 window.$EDITORUI[_globalKey] 中的键名，值为本UI实例 */
	_globalKey = '';

	/**
	 * 构造函数
	 */
	constructor() {
		super(); // 调用父类的构造函数
		
	}

	//方法：
	initOptions(options) {
		var me = this;
		for (var k in options) {
			me[k] = options[k];
		}
		this.id = this.id || "edui" + uiUtils.uid();
		// if (window.zhutest) {
		// 	console.log(me.constructor.name);
		// 	console.log(options.items);
		// 	console.log(me.items);
		// 	console.log(me);
		// }
		// console.log(this);
		// console.log(me);
		// console.log('---------------');
	}
	initUIBase() {
		this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));
	}
	_UIBase_render(holder) {
		var html = this.renderHtml();
		var el = uiUtils.createElementByHtml(html);

		//by xuheng 给每个node添加class
		var list = domUtils.getElementsByTagName(el, "*");
		var theme = "edui-" + (this.theme || this.editor.options.theme);
		var layer = document.getElementById("edui_fixedlayer");
		// if (window.zhuLog) {
		// 	// console.log(this.constructor.name);
		// 	// console.log(this.className);
		// }
		for (var i = 0, node; (node = list[i++]);) {
			domUtils.addClass(node, theme);
		}
		domUtils.addClass(el, theme);
		if (layer) {
			layer.className = "";
			domUtils.addClass(layer, theme);
		}

		var seatEl = this.getDom();
		if (seatEl != null) {
			seatEl.parentNode.replaceChild(el, seatEl);
			uiUtils.copyAttributes(el, seatEl);
		} else {
			if (typeof holder == "string") {
				holder = document.getElementById(holder);
			}
			holder = holder || uiUtils.getFixedLayer();
			// console.log('Uibase.render',holder,el);
			domUtils.addClass(holder, theme);
			holder.appendChild(el);
		}
		this.el = el;
		this.postRender();
	}
	render(holder) {
		this._UIBase_render(holder);
	}

	getDom(name) {
		if (!name) {
			return document.getElementById(this.id);
		} else {
			return document.getElementById(this.id + "_" + name);
		}
	}
	_UIBase_postRender() {
		this.fireEvent("postrender");
	}
	postRender() {
		this._UIBase_postRender();
	}
	getHtmlTpl() {
		return "";
	}
	formatHtml(tpl) {
		var prefix = "edui-" + this.uiName;
		return tpl
			.replace(/##/g, this.id)
			.replace(/%%-/g, this.uiName ? prefix + "-" : "")
			.replace(/%%/g, (this.uiName ? prefix : "") + " " + this.className)
			.replace(/\$\$/g, this._globalKey);
	}
	renderHtml() {
		return this.formatHtml(this.getHtmlTpl());
	}
	dispose() {
		var box = this.getDom();
		if (box) domUtils.remove(box);
		uiUtils.unsetGlobal(this.id);
	}

	uiShow(enable) {
		if (enable) {
			if (this.uiIsShow) {
				return;
			}
			this.getDom().style.display = this.uiShowStyleBackupValue;
			this.uiIsShow = true;
		} else {
			if (!this.uiIsShow) {
				return;
			}
			this.uiShowStyleBackupValue = this.getDom().style.display;
			this.getDom().style.display = 'none';
			this.uiIsShow = false;
		}
	}
}

// cls_UIBase.prototype._UIBase_render = cls_UIBase.prototype.render;

export default cls_UIBase;