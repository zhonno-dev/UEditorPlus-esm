// 把原本的 _src/ui/stateful.js 改为用class extends UIBase 的类定义语法

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


	/**
	 * 初始化方法，用于设置元素的初始状态
	 */
	Stateful_init() {
		// 改为 cls_uiStateful(class形式) 后，这种方式容易导致死循环，调整一下
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
	/**
	 * 新的 Stateful_getHtmlTpl，通过参数传入 tpl
	 * @param {string} tpl - 原始模板字符串
	 * @returns {string} - 替换后的模板字符串
	 */
	Stateful_getHtmlTpl(tpl) {
		// 使用 function 避免 $ 转义
		return tpl.replace(/stateful/g, function () {
			return TPL_STATEFUL;
		});
	}

	/**
	 * 鼠标进入事件处理函数（IE时直接绑定）
	 * @param {Event} evt - 事件对象
	 * @param {HTMLElement} el - 触发事件的元素
	 */
	Stateful_onMouseEnter(evt, el) {
		//IE时直接绑定 = Stateful_onMouseOver
		this.target = el;
		if (!this.isDisabled() || this.alwalysHoverable) {
			this.addState("hover");
			this.fireEvent("over"); // 注：这个事件目前无人注册
		}
	}

	/**
	 * 鼠标离开事件处理函数（IE时直接绑定）
	 * @param {Event} evt - 事件对象
	 * @param {HTMLElement} el - 触发事件的元素
	 */
	Stateful_onMouseLeave(evt, el) {
		//IE时直接绑定 = Stateful_onMouseOut
		if (!this.isDisabled() || this.alwalysHoverable) {
			this.removeState("hover");
			this.removeState("active");
			this.fireEvent("out"); // 注：这个事件目前无人注册
		}
	}

	/**
	 * 鼠标悬停事件处理函数
	 * @param {Event} evt - 事件对象
	 * @param {HTMLElement} el - 触发事件的元素
	 */
	Stateful_onMouseOver(evt, el) {
		var rel = evt.relatedTarget;
		if (!uiUtils.contains(el, rel) && el !== rel) {
			this.Stateful_onMouseEnter(evt, el);
		}
	}

	/**
	 * 鼠标移出事件处理函数
	 * @param {Event} evt - 事件对象
	 * @param {HTMLElement} el - 触发事件的元素
	 */
	Stateful_onMouseOut(evt, el) {
		var rel = evt.relatedTarget;
		if (!uiUtils.contains(el, rel) && el !== rel) {
			this.Stateful_onMouseLeave(evt, el);
		}
	}

	/**
	 * 鼠标按下事件处理函数
	 * @param {Event} evt - 事件对象
	 * @param {HTMLElement} el - 触发事件的元素
	 */
	Stateful_onMouseDown(evt, el) {
		if (!this.isDisabled()) {
			this.addState("active");
		}
	}

	/**
	 * 鼠标释放事件处理函数
	 * @param {Event} evt - 事件对象
	 * @param {HTMLElement} el - 触发事件的元素
	 */
	Stateful_onMouseUp(evt, el) {
		if (!this.isDisabled()) {
			this.removeState("active");
		}
	}

	/**
	 * 渲染后处理方法，用于设置元素的初始状态
	 */
	Stateful_postRender() {
		if (this.disabled && !this.hasState("disabled")) {
			this.addState("disabled");
		}
	}

	/**
	 * 检查元素是否具有指定状态
	 * @param {string} state - 状态名称
	 * @returns {boolean} - 元素是否具有指定状态
	 */
	hasState(state) {
		return domUtils.hasClass(this.getStateDom(), "edui-state-" + state);
	}

	/**
	 * 为元素添加指定状态
	 * @param {string} state - 状态名称
	 */
	addState(state) {
		if (!this.hasState(state)) {
			this.getStateDom().className += " edui-state-" + state;
		}
	}

	/**
	 * 从元素移除指定状态
	 * @param {string} state - 状态名称
	 */
	removeState(state) {
		if (this.hasState(state)) {
			domUtils.removeClasses(this.getStateDom(), ["edui-state-" + state]);
		}
	}

	/**
	 * 获取状态元素
	 * @returns {HTMLElement} - 状态元素
	 */
	getStateDom() {
		//eg. <div id="edui9_state" ...>
		return this.getDom("state");
	}

	/**
	 * 检查元素是否处于选中状态
	 * @returns {boolean} - 元素是否处于选中状态
	 */
	isChecked() {
		return this.hasState("checked");
	}

	/**
	 * 设置元素的选中状态
	 * @param {boolean} checked - 是否选中
	 */
	setChecked(checked) {
		if (!this.isDisabled() && checked) {
			this.addState("checked");
		} else {
			this.removeState("checked");
		}
	}

	/**
	 * 检查元素是否处于禁用状态
	 * @returns {boolean} - 元素是否处于禁用状态
	 */
	isDisabled() {
		return this.hasState("disabled");
	}

	/**
	 * 设置元素的禁用状态
	 * @param {boolean} disabled - 是否禁用
	 */
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