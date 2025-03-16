import uiUtils from "./uiutils.js";
import cls_UIBase from "./UIBase.cls.js";

class cls_uiToolbar extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initToolbar();
	}
}

cls_uiToolbar.prototype.items = null;
cls_uiToolbar.prototype.initToolbar = function () {
	this.items = this.items || [];
	this.initUIBase();
};
cls_uiToolbar.prototype.add = function (item, index) {
	if (index === undefined) {
		this.items.push(item);
	} else {
		this.items.splice(index, 0, item);
	}
};
cls_uiToolbar.prototype.getHtmlTpl = function () {
	var buff = [];
	for (var i = 0; i < this.items.length; i++) {
		buff[i] = this.items[i].renderHtml();
	}
	return (
		'<div id="##" class="edui-toolbar %%" onselectstart="return false;" onmousedown="return $$._onMouseDown(event, this);">' +
		buff.join("") +
		"</div>"
	);
};
cls_uiToolbar.prototype.postRender = function () {
	var box = this.getDom();
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].postRender();
	}
	uiUtils.makeUnselectable(box);
};
cls_uiToolbar.prototype._onMouseDown = function (e) {
	var target = e.target || e.srcElement,
		tagName = target && target.tagName && target.tagName.toLowerCase();
	if (tagName == "input" || tagName == "object" || tagName == "object") {
		return false;
	}
};

// utils.inherits(Toolbar, UIBase);[X]
export default cls_uiToolbar;