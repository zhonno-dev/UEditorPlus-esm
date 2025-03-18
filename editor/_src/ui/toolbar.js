import uiUtils from "./uiutils.js";
import cls_UIBase from "./UIBase.js";

/**
 * 一【行】工具栏UI
 */
class cls_uiToolbar extends cls_UIBase {
	items = [];

	/**
	 * 构造函数\
	 * 一个此实例表示一【行】工具栏UI（每【行】工具栏中有多个按钮）
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initToolbar();
	}

	initToolbar() {
		this.items = this.items || [];
		this.initUIBase();
	}
	add(item, index) {
		if (index === undefined) {
			this.items.push(item);
		} else {
			this.items.splice(index, 0, item);
		}
	}
	getHtmlTpl() {
		var buff = [];
		for (var i = 0; i < this.items.length; i++) {
			buff[i] = this.items[i].renderHtml();
		}
		return (
			'<div id="##" class="edui-toolbar %%" onselectstart="return false;" onmousedown="return $$._onMouseDown(event, this);">' +
			buff.join("") +
			"</div>"
		);
	}
	postRender() {
		var box = this.getDom();
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].postRender();
		}
		uiUtils.makeUnselectable(box);
	}
	_onMouseDown(e) {
		var target = e.target || e.srcElement,
			tagName = target && target.tagName && target.tagName.toLowerCase();
		if (tagName == "input" || tagName == "object" || tagName == "object") {
			return false;
		}
	}
}



// utils.inherits(Toolbar, UIBase);[X]
export default cls_uiToolbar;