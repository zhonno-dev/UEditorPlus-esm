import uiUtils from "./uiutils.js";

// import cls_UIBase from "./UIBase.js";
import cls_uiStateful from "./stateful.js";

///import core
///import uicore
class cls_uiPastePicker extends cls_uiStateful {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数
		
		this.initOptions(options);
		this.initPastePicker();
	}

	initPastePicker() {
		this.initUIBase();
		this.Stateful_init();
	}
	getHtmlTpl() {
		let tpl = (
			'<div class="edui-pasteicon" onclick="$$._onClick(this)"></div>' +
			'<div class="edui-pastecontainer">' +
			'<div class="edui-title">' +
			this.editor.getLang("pasteOpt") +
			"</div>" +
			'<div class="edui-button">' +
			'<div title="' +
			this.editor.getLang("pasteSourceFormat") +
			'" onclick="$$.format(false)" stateful>' +
			'<div class="edui-richtxticon"></div></div>' +
			'<div title="' +
			this.editor.getLang("tagFormat") +
			'" onclick="$$.format(2)" stateful>' +
			'<div class="edui-tagicon"></div></div>' +
			'<div title="' +
			this.editor.getLang("pasteTextFormat") +
			'" onclick="$$.format(true)" stateful>' +
			'<div class="edui-plaintxticon"></div></div>' +
			"</div>" +
			"</div>" +
			"</div>"
		);
		return this.Stateful_getHtmlTpl(tpl);
	}
	getStateDom() {
		return this.target;
	}
	format(param) {
		this.editor.ui._isTransfer = true;
		this.editor.fireEvent("pasteTransfer", param);
	}
	_onClick(cur) {
		var node = domUtils.getNextDomNode(cur),
			screenHt = uiUtils.getViewportRect().height,
			subPop = uiUtils.getClientRect(node);
	
		if (subPop.top + subPop.height > screenHt)
			node.style.top = -subPop.height - cur.offsetHeight + "px";
		else node.style.top = "";
	
		if (/hidden/gi.test(domUtils.getComputedStyle(node, "visibility"))) {
			node.style.visibility = "visible";
			domUtils.addClass(cur, "edui-state-opened");
		} else {
			node.style.visibility = "hidden";
			domUtils.removeClasses(cur, "edui-state-opened");
		}
	}
}


// cls_uiPastePicker.prototype._UIBase_render = cls_UIBase.prototype.render;

// utils.inherits(PastePicker, UIBase);[X]
// utils.extend(PastePicker.prototype, Stateful, true);

export default cls_uiPastePicker;