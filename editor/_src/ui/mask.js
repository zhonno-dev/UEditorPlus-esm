// import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
// import UIBase from "./uibase.js";
import uiUtils from "./uiutils.js";

import cls_UIBase from "./UIBase.js";

///import core
///import uicore

class cls_uiMask extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initUIBase();
	}
}

cls_uiMask.prototype.getHtmlTpl = function () {
	return '<div id="##" class="edui-mask %%" onclick="return $$._onClick(event, this);" onmousedown="return $$._onMouseDown(event, this);"></div>';
};
cls_uiMask.prototype.postRender = function () {
	var me = this;
	domUtils.on(window, "resize", function () {
		setTimeout(function () {
			if (!me.isHidden()) {
				me._fill();
			}
		});
	});
};
cls_uiMask.prototype.show = function (zIndex) {
	this._fill();
	this.getDom().style.display = "";
	this.getDom().style.zIndex = zIndex;
};
cls_uiMask.prototype.hide = function () {
	this.getDom().style.display = "none";
	this.getDom().style.zIndex = "";
};
cls_uiMask.prototype.isHidden = function () {
	return this.getDom().style.display == "none";
};
cls_uiMask.prototype._onMouseDown = function () {
	return false;
};
cls_uiMask.prototype._onClick = function (e, target) {
	this.fireEvent("click", e, target);
};
cls_uiMask.prototype._fill = function () {
	var el = this.getDom();
	var vpRect = uiUtils.getViewportRect();
	el.style.width = vpRect.width + "px";
	el.style.height = vpRect.height + "px";
};

// utils.inherits(Mask, UIBase);[X]

export default cls_uiMask;