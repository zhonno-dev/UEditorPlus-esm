// import utils from "../core/utils.js";
import Popup from "./popup.js";
import TablePicker from "./tablepicker.js";
// import SplitButton from "./splitbutton.js";

import cls_uiSplitButton from "./splitbutton.js";

///import core
///import uicore
///import ui/popup.js
///import ui/tablepicker.js
///import ui/splitbutton.js
class cls_uiTableButton extends cls_uiSplitButton{
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(options); // 调用父类的构造函数
		
		this.initOptions(options);
		this.initTableButton();
	}
	initTableButton() {
		var me = this;
		this.popup = new Popup({
			content: new TablePicker({
				editor: me.editor,
				onpicktable: function (t, numCols, numRows) {
					me._onPickTable(numCols, numRows);
				}
			}),
			editor: me.editor
		});
		this.initSplitButton();
	}
	_onPickTable(numCols, numRows) {
		if (this.fireEvent("picktable", numCols, numRows) !== false) {
			this.popup.hide();
		}
	}
}


// utils.inherits(TableButton, SplitButton);[X]
export default cls_uiTableButton;