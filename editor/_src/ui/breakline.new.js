// import utils from "../core/utils.js";
// import UIBase from "./uibase.js";
import cls_UIBase from "./UIBase.js";

class cls_uiBreakline extends cls_UIBase {
	uiName = "Breakline";
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
		return "<br/>";
	}
}



// utils.inherits(Breakline, UIBase);[X]

export default cls_uiBreakline;