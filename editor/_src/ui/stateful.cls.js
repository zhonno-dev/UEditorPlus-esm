//把原本的 _src/ui/stateful.js 改为用class extends UIBase 的类定义语法

import browser from "../core/browser.js";
import { domUtils } from "../core/domUtils.js";
import uiUtils from "./uiutils.js";
import cls_UIBase from "./UIBase.cls.js";

var TPL_STATEFUL =
	'onmousedown="$$.Stateful_onMouseDown(event, this);"' +
	' onmouseup="$$.Stateful_onMouseUp(event, this);"' +
	(browser.ie
		? ' onmouseenter="$$.Stateful_onMouseEnter(event, this);"' +
		' onmouseleave="$$.Stateful_onMouseLeave(event, this);"'
		: ' onmouseover="$$.Stateful_onMouseOver(event, this);"' +
		' onmouseout="$$.Stateful_onMouseOut(event, this);"');

class cls_uiStateful extends cls_UIBase {
	
}

cls_uiStateful.prototype.alwalysHoverable = false;
cls_uiStateful.prototype.target = null; //目标元素和this指向dom不一样


cls_uiStateful.prototype.Stateful_init = function () {
	this._Stateful_dGetHtmlTpl = this.getHtmlTpl;
	this.getHtmlTpl = this.Stateful_getHtmlTpl;
};
cls_uiStateful.prototype.Stateful_getHtmlTpl = function () {
	var tpl = this._Stateful_dGetHtmlTpl();
	// 使用function避免$转义
	return tpl.replace(/stateful/g, function () {
		return TPL_STATEFUL;
	});
};
cls_uiStateful.prototype.Stateful_onMouseEnter = function (evt, el) {
	this.target = el;
	if (!this.isDisabled() || this.alwalysHoverable) {
		this.addState("hover");
		this.fireEvent("over");
	}
};
cls_uiStateful.prototype.Stateful_onMouseLeave = function (evt, el) {
	if (!this.isDisabled() || this.alwalysHoverable) {
		this.removeState("hover");
		this.removeState("active");
		this.fireEvent("out");
	}
};
cls_uiStateful.prototype.Stateful_onMouseOver = function (evt, el) {
	var rel = evt.relatedTarget;
	if (!uiUtils.contains(el, rel) && el !== rel) {
		this.Stateful_onMouseEnter(evt, el);
	}
};
cls_uiStateful.prototype.Stateful_onMouseOut = function (evt, el) {
	var rel = evt.relatedTarget;
	if (!uiUtils.contains(el, rel) && el !== rel) {
		this.Stateful_onMouseLeave(evt, el);
	}
};
cls_uiStateful.prototype.Stateful_onMouseDown = function (evt, el) {
	if (!this.isDisabled()) {
		this.addState("active");
	}
};
cls_uiStateful.prototype.Stateful_onMouseUp = function (evt, el) {
	if (!this.isDisabled()) {
		this.removeState("active");
	}
};
cls_uiStateful.prototype.Stateful_postRender = function () {
	if (this.disabled && !this.hasState("disabled")) {
		this.addState("disabled");
	}
};
cls_uiStateful.prototype.hasState = function (state) {
	return domUtils.hasClass(this.getStateDom(), "edui-state-" + state);
};
cls_uiStateful.prototype.addState = function (state) {
	if (!this.hasState(state)) {
		this.getStateDom().className += " edui-state-" + state;
	}
};
cls_uiStateful.prototype.removeState = function (state) {
	if (this.hasState(state)) {
		domUtils.removeClasses(this.getStateDom(), ["edui-state-" + state]);
	}
};
cls_uiStateful.prototype.getStateDom = function () {
	return this.getDom("state");
};
cls_uiStateful.prototype.isChecked = function () {
	return this.hasState("checked");
};
cls_uiStateful.prototype.setChecked = function (checked) {
	if (!this.isDisabled() && checked) {
		this.addState("checked");
	} else {
		this.removeState("checked");
	}
};
cls_uiStateful.prototype.isDisabled = function () {
	return this.hasState("disabled");
};
cls_uiStateful.prototype.setDisabled = function (disabled) {
	if (disabled) {
		this.removeState("hover");
		this.removeState("checked");
		this.removeState("active");
		this.addState("disabled");
	} else {
		this.removeState("disabled");
	}
};

export default cls_uiStateful;