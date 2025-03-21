// import utils from "../core/utils.js";
// import UIBase from "./uibase.js";

import cls_UIBase from "./UIBase.js";

class cls_uiSeparator extends cls_UIBase{
	uiName = "separator";

	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数
		
		this.initOptions(options);
		this.initSeparator();
	}
	initSeparator() {
		this.initUIBase();
	}
	getHtmlTpl() {
		return '<div id="##" class="edui-box %%"></div>';
	}
}

// utils.inherits(Separator, UIBase);[X]
export default cls_uiSeparator;