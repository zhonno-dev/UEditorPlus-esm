import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
// import uiUtils from "./uiutils.js";
// import UIBase from "./uibase.js";
// import Popup from "./popup.js";
// import Stateful from "./stateful.js";
// import CellAlignPicker from "./cellalignpicker.js";

// import cls_uiStateful from "./stateful.js";
// import cls_UIBase from "./UIBase.js";
import cls_uiPopup from "./popup.js";

///import core
///import uicore
///import ui\popup.js
///import ui\stateful.js
class cls_uiQuickOperate extends cls_uiPopup {
	uiName = "quick-operate";

	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		// this.initMenu();
	}

	getContentHtmlTpl() {
		
		return [
			'<div class="edui-quick-operate">',
			' <div class="edui-quick-operate-status">',
			'   <div class="edui-quick-operate-icon"><i class="icon icon-image"></i></div>',
			'   <div class="edui-quick-operate-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="DragOutlined"><path d="M8.25 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm0 7.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm1.75 5.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM14.753 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM16.5 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm-1.747 9a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z" fill="currentColor"></path></svg></div>',
			' </div>',
			' <div class="edui-quick-operate-menu">',
			'   <div class="item"><i class="icon icon-image"></i> 删除</div>',
			'   <div class="item"><i class="icon icon-image"></i> 左对齐</div>',
			'   <div class="item"><i class="icon icon-image"></i> 右对齐</div>',
			' </div>',
			'</div>',
		].join('');
	}
	
	destroy() {
		if (this.getDom()) {
			domUtils.remove(this.getDom());
		}
		//     this.clearItems();
	}
	dispose() {
		this.destroy();
	}
}

// _Popup_getContentHtmlTpl: Popup.prototype.getContentHtmlTpl,

// utils.inherits(QuickOperate, Popup);[X]
export default cls_uiQuickOperate;