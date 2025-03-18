//把原本的 _src/ui/stateful.js 改为用class extends UIBase 的类定义语法

import browser from "../core/browser.js";
import { domUtils } from "../core/domUtils.js";
import uiUtils from "./uiutils.js";
import cls_UIBase from "./UIBase.js";

/**
 * 定义一个全局模板字符串 TPL_STATEFUL，用于绑定鼠标事件
 * 该模板字符串根据浏览器类型（IE 或其他）绑定不同的鼠标事件
 */
var TPL_STATEFUL =
	'onmousedown="$$.Stateful_onMouseDown(event, this);"' +
	' onmouseup="$$.Stateful_onMouseUp(event, this);"' +
	// 如果是 IE 浏览器，使用 onmouseenter 和 onmouseleave 事件
	(browser.ie
		? ' onmouseenter="$$.Stateful_onMouseEnter(event, this);"' +
		' onmouseleave="$$.Stateful_onMouseLeave(event, this);"'
		// 非 IE 浏览器，使用 onmouseover 和 onmouseout 事件
		: ' onmouseover="$$.Stateful_onMouseOver(event, this);"' +
		' onmouseout="$$.Stateful_onMouseOut(event, this);"');

/**
 * 该类用于管理 UI 元素的状态，如悬停、激活、禁用等
 */
class cls_uiStateful extends cls_UIBase {
	/** 元素是否始终可悬停 */
	alwalysHoverable = false;
	/** 目标元素，与 this 指向的 DOM 元素不同 */
	target = null; 


	Stateful_init() {
		//改为 cls_uiStateful(class形式) 后，这种方式容易导致死循环，调整一下
		// this._Stateful_dGetHtmlTpl = this.getHtmlTpl;
		// this.getHtmlTpl = this.Stateful_getHtmlTpl;
	}
	//旧的（原本的）Stateful_getHtmlTpl()
	// Stateful_getHtmlTpl() {
	// 	var tpl = this._Stateful_dGetHtmlTpl();
	// 	// 使用function避免$转义
	// 	return tpl.replace(/stateful/g, function () {
	// 		return TPL_STATEFUL;
	// 	});
	// }
	/** 成新的 Stateful_getHtmlTpl，通过参数传入 tpl */
	Stateful_getHtmlTpl(tpl) {
		// 使用function避免$转义
		return tpl.replace(/stateful/g, function () {
			return TPL_STATEFUL;
		});
	}
	Stateful_onMouseEnter(evt, el) {
		//ie专用 = Stateful_onMouseOver
		this.target = el;
		if (!this.isDisabled() || this.alwalysHoverable) {
			this.addState("hover");
			this.fireEvent("over"); //zhu:这个事件没人注册
		}
	}
	Stateful_onMouseLeave(evt, el) {
		//ie专用 = Stateful_onMouseOut
		if (!this.isDisabled() || this.alwalysHoverable) {
			this.removeState("hover");
			this.removeState("active");
			this.fireEvent("out"); //zhu:这个事件没人注册
		}
	}
	Stateful_onMouseOver(evt, el) {
		var rel = evt.relatedTarget;
		if (!uiUtils.contains(el, rel) && el !== rel) {
			this.Stateful_onMouseEnter(evt, el);
		}
	}
	Stateful_onMouseOut(evt, el) {
		var rel = evt.relatedTarget;
		if (!uiUtils.contains(el, rel) && el !== rel) {
			this.Stateful_onMouseLeave(evt, el);
		}
	}
	Stateful_onMouseDown(evt, el) {
		if (!this.isDisabled()) {
			this.addState("active");
		}
	}
	Stateful_onMouseUp(evt, el) {
		if (!this.isDisabled()) {
			this.removeState("active");
		}
	}
	Stateful_postRender() {
		if (this.disabled && !this.hasState("disabled")) {
			this.addState("disabled");
		}
	}
	hasState(state) {
		return domUtils.hasClass(this.getStateDom(), "edui-state-" + state);
	}
	addState(state) {
		if (!this.hasState(state)) {
			this.getStateDom().className += " edui-state-" + state;
		}
	}
	removeState(state) {
		if (this.hasState(state)) {
			domUtils.removeClasses(this.getStateDom(), ["edui-state-" + state]);
		}
	}
	getStateDom() {
		return this.getDom("state");
	}
	isChecked() {
		return this.hasState("checked");
	}
	setChecked(checked) {
		if (!this.isDisabled() && checked) {
			this.addState("checked");
		} else {
			this.removeState("checked");
		}
	}
	isDisabled() {
		return this.hasState("disabled");
	}
	setDisabled(disabled) {
		if (disabled) {
			this.removeState("hover");
			this.removeState("checked");
			this.removeState("active");
			this.addState("disabled");
		} else {
			this.removeState("disabled");
		}
	}
}


export default cls_uiStateful;