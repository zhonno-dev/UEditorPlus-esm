// import utils from "../core/utils.js";
import uiUtils from "./uiutils.js";
import ColorPicker from "./colorpicker.js";
import Popup from "./popup.js";
// import SplitButton from "./splitbutton.js";

import cls_uiSplitButton from "./splitbutton.js";

///import core
///import uicore
///import ui/colorpicker.js
///import ui/popup.js
///import ui/splitbutton.js

class cls_uiColorButton extends cls_uiSplitButton {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initColorButton();
	}
}

cls_uiColorButton.prototype.initColorButton = function () {
	var me = this;
	this.popup = new Popup({
		content: new ColorPicker({
			noColorText: me.editor.getLang("clearColor"),
			editor: me.editor,
			onpickcolor: function (t, color) {
				me._onPickColor(color);
			},
			onpicknocolor: function (t, color) {
				me._onPickNoColor(color);
			}
		}),
		editor: me.editor
	});
	this.initSplitButton();
};
cls_uiColorButton.prototype._SplitButton_postRender = cls_uiSplitButton.prototype.postRender;
cls_uiColorButton.prototype.postRender = function () {
	this._SplitButton_postRender();
	this.getDom("button_body").appendChild(
		uiUtils.createElementByHtml(
			'<div id="' + this.id + '_colorlump" class="edui-colorlump"></div>'
		)
	);
	this.getDom().className += " edui-colorbutton";
};
cls_uiColorButton.prototype.setColor = function (color) {
	this.getDom("colorlump").style.backgroundColor = color;
	this.color = color;
};
cls_uiColorButton.prototype._onPickColor = function (color) {
	if (this.fireEvent("pickcolor", color) !== false) {
		this.setColor(color);
		this.popup.hide();
	}
};
cls_uiColorButton.prototype._onPickNoColor = function (color) {
	if (this.fireEvent("picknocolor") !== false) {
		this.popup.hide();
	}
};

// utils.inherits(ColorButton, SplitButton);[X]
export default cls_uiColorButton;