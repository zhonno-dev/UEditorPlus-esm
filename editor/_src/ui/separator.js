import utils from "../core/utils.js";
// import UIBase from "./uibase.js";

import cls_UIBase from "./UIBase.cls.js";

class cls_uiSeparator extends cls_UIBase{
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数
		
		this.initOptions(options);
		this.initSeparator();
	}
}

cls_uiSeparator.prototype.uiName = "separator";
cls_uiSeparator.prototype.initSeparator = function () {
	this.initUIBase();
};
cls_uiSeparator.prototype.getHtmlTpl = function () {
	return '<div id="##" class="edui-box %%"></div>';
};

// utils.inherits(Separator, UIBase);[X]
export default cls_uiSeparator;