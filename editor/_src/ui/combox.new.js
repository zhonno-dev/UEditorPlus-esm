import utils from "../core/utils.js";
import uiUtils from "./uiutils.js";
import { cls_uiMenu } from "./menu.js";
// import SplitButton from "./splitbutton.js";
import cls_uiSplitButton from "./splitbutton.js";

///import core
///import uicore
///import ui/menu.js
///import ui/splitbutton.js

class cls_uiCombox extends cls_uiSplitButton {
	uiName = "combox";

	/**
	 * 构造函数
	 */
	constructor(options) {
		super(options); // 调用父类的构造函数

		// this.initOptions(options);
		this.initCombox();
		// window.zhuLog = true;
		// console.log(this.className);
	}

	onbuttonclick() {
		this.showPopup();
	}
	initCombox() {
		var me = this;
		this.items = this.items || [];
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			item.uiName = "listitem";
			item.index = i;
			item.onclick = function () {
				me.selectByIndex(this.index);
			};
		}
		// console.log(this.items);
		this.popup = new cls_uiMenu({
			items: this.items,
			uiName: "list",
			editor: this.editor,
			captureWheel: true,
			combox: this
		});

		//     this.initSplitButton();
	}

	postRender() {
		// this._SplitButton_postRender();
		super.postRender();

		this.setLabel(this.label || "");
		this.setValue(this.initValue || "");
	}
	showPopup() {
		var rect = uiUtils.getClientRect(this.getDom());
		rect.top += 1;
		rect.bottom -= 1;
		rect.height -= 2;
		this.popup.showAnchorRect(rect);
	}
	getValue() {
		return this.value;
	}
	setValue(value) {
		var index = this.indexByValue(value);
		if (index != -1) {
			this.selectedIndex = index;
			this.setLabel(this.items[index].label);
			this.value = this.items[index].value;
		} else {
			this.selectedIndex = -1;
			this.setLabel(this.getLabelForUnknowValue(value));
			this.value = value;
		}
	}
	setLabel(label) {
		this.getDom("button_body").innerHTML = label;
		this.label = label;
	}
	getLabelForUnknowValue(value) {
		return value;
	}
	indexByValue(value) {
		for (var i = 0; i < this.items.length; i++) {
			if (value == this.items[i].value) {
				return i;
			}
		}
		return -1;
	}
	getItem(index) {
		return this.items[index];
	}
	selectByIndex(index) {
		if (
			index < this.items.length &&
			this.fireEvent("select", index) !== false
		) {
			this.selectedIndex = index;
			this.value = this.items[index].value;
			this.setLabel(this.items[index].label);
		}
	}

}

// cls_uiCombox.prototype._SplitButton_postRender = cls_uiSplitButton.prototype.postRender;

// var UE_ui_Combox;
// (function () {
// 	// todo: menu和item提成通用list
// 	// var utils = baidu.editor.utils,
// 	// 	uiUtils = baidu.editor.ui.uiUtils,
// 	// 	Menu = baidu.editor.ui.Menu,
// 	// 	SplitButton = baidu.editor.ui.SplitButton;

// 	// var Combox = (baidu.editor.ui.Combox = function (options) {
// 	var Combox = (UE_ui_Combox = function () {
// 	});
// 	Combox.prototype = {

// 	};
// })();

// utils.inherits(Combox, SplitButton);[X]

export default cls_uiCombox;