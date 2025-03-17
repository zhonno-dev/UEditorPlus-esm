//把原本的 _src/ui/uibase.js 改为用class extends EventBase 的类定义语法

import utils from "../core/utils.js";
import uiUtils from "./uiutils.js";
import EventBase from "../core/EventBase.js";
import { domUtils } from "../core/domUtils.js";

class cls_UIBase extends EventBase {
}

//属性：
cls_UIBase.prototype.id = null;
cls_UIBase.prototype.el = null;
cls_UIBase.prototype.className = "";
cls_UIBase.prototype.uiName = "";

//方法：
cls_UIBase.prototype.initOptions = function (options) {
	var me = this;
	for (var k in options) {
		me[k] = options[k];
	}
	this.id = this.id || "edui" + uiUtils.uid();
	if (window.zhutest) {
		console.log(me.constructor.name);
		console.log(options.items);
		console.log(me.items);
		console.log(me);
	}
};
cls_UIBase.prototype.initUIBase = function () {
	this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));
};
cls_UIBase.prototype.render = function (holder) {
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
};
cls_UIBase.prototype._UIBase_render = cls_UIBase.prototype.render;
cls_UIBase.prototype.getDom = function (name) {
	if (!name) {
		return document.getElementById(this.id);
	} else {
		return document.getElementById(this.id + "_" + name);
	}
};
cls_UIBase.prototype.postRender = function () {
	this.fireEvent("postrender");
};
cls_UIBase.prototype.getHtmlTpl = function () {
	return "";
};
cls_UIBase.prototype.formatHtml = function (tpl) {
	var prefix = "edui-" + this.uiName;
	return tpl
		.replace(/##/g, this.id)
		.replace(/%%-/g, this.uiName ? prefix + "-" : "")
		.replace(/%%/g, (this.uiName ? prefix : "") + " " + this.className)
		.replace(/\$\$/g, this._globalKey);
};
cls_UIBase.prototype.renderHtml = function () {
	return this.formatHtml(this.getHtmlTpl());
};
cls_UIBase.prototype.dispose = function () {
	var box = this.getDom();
	if (box) domUtils.remove(box);
	uiUtils.unsetGlobal(this.id);
};

cls_UIBase.prototype.uiIsShow = true;
cls_UIBase.prototype.uiShowStyleBackupValue = null;
cls_UIBase.prototype.uiShow = function (enable) {
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
};

export default cls_UIBase;