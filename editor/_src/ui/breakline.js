// import utils from "../core/utils.js";
// import UIBase from "./uibase.js";
import cls_UIBase from "./UIBase.js";

class cls_uiBreakline extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initSeparator();
	}
}

cls_uiBreakline.prototype.uiName = "Breakline";
cls_uiBreakline.prototype.initSeparator = function () {
	this.initUIBase();
};
cls_uiBreakline.prototype.getHtmlTpl = function () {
	return "<br/>";
};

// utils.inherits(Breakline, UIBase);[X]

export default cls_uiBreakline;