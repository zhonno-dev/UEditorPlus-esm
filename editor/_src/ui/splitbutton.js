import utils from "../core/utils.js";
import uiUtils from "./uiutils.js";
// import { domUtils } from "../core/domUtils.js";
// import UIBase from "./uibase.js";
// import Stateful from "./stateful.js";

import cls_UIBase from "./UIBase.js";
import cls_uiStateful from "./stateful.cls.js";

///import core
///import uicore
///import ui/stateful.js

class cls_uiSplitButton extends cls_uiStateful {
	popup = null;
	uiName = "splitbutton";
	title = "";

	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		// console.log(options);
		this.initOptions(options);
		this.initSplitButton();
	}


	initSplitButton() {
		this.initUIBase();
		this.Stateful_init();
		var me = this;
		if (this.popup != null) {
			var popup = this.popup;
			this.popup = null;
			this.setPopup(popup);
		}
	}
	postRender() {
		this.Stateful_postRender();
		this._UIBase_postRender();
	}
	setPopup(popup) {
		if (this.popup === popup) return;
		if (this.popup != null) {
			this.popup.dispose();
		}
		popup.addListener("show", utils.bind(this._onPopupShow, this));
		popup.addListener("hide", utils.bind(this._onPopupHide, this));
		popup.addListener(
			"postrender",
			utils.bind(function () {
				popup
					.getDom("body")
					.appendChild(
						uiUtils.createElementByHtml(
							'<div id="' +
							this.popup.id +
							'_bordereraser" class="edui-bordereraser edui-background" style="width:' +
							(uiUtils.getClientRect(this.getDom()).width + 20) +
							'px"></div>'
						)
					);
				popup.getDom().className += " " + this.className;
			}, this)
		);
		this.popup = popup;
	}
	_onPopupShow() {
		this.addState("opened");
	}
	_onPopupHide() {
		this.removeState("opened");
	}
	getHtmlTpl() {
		let tpl = (
			'<div id="##" class="edui-box %%">' +
			"<div " +
			(this.title ? 'title="' + this.title + '"' : "") +
			' id="##_state" stateful><div class="%%-body">' +
			'<div id="##_button_body" class="edui-box edui-button-body" onclick="$$._onButtonClick(event, this);">' +
			'<div class="edui-box edui-icon"></div>' +
			"</div>" +
			'<div class="edui-box edui-splitborder"></div>' +
			'<div class="edui-box edui-arrow" onclick="$$._onArrowClick();"></div>' +
			"</div></div></div>"
		);
		// return tpl;
		return this.Stateful_getHtmlTpl(tpl);
	}
	showPopup() {
		// 当popup往上弹出的时候，做特殊处理
		var rect = uiUtils.getClientRect(this.getDom());
		rect.top -= this.popup.SHADOW_RADIUS;
		rect.height += this.popup.SHADOW_RADIUS;
		this.popup.showAnchorRect(rect);
	}
	_onArrowClick(event, el) {
		if (!this.isDisabled()) {
			this.showPopup();
		}
	}
	_onButtonClick() {
		if (!this.isDisabled()) {
			this.fireEvent("buttonclick");
		}
	}
}

cls_uiSplitButton.prototype._UIBase_postRender = cls_UIBase.prototype.postRender;

// utils.inherits(SplitButton, UIBase);[X]
// utils.extend(SplitButton.prototype, Stateful, true);
export default cls_uiSplitButton;