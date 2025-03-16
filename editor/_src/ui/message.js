import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
// import UIBase from "./uibase.js";

import cls_UIBase from "./UIBase.cls.js";
///import core
///import uicore

class cls_uiMessage extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initMessage();
	}
}

cls_uiMessage.prototype.initMessage = function () {
	this.initUIBase();
};
cls_uiMessage.prototype.getHtmlTpl = function () {
	return (
		'<div id="##" class="edui-message %%">' +
		' <div id="##_closer" class="edui-message-closer">×</div>' +
		' <div id="##_body" class="edui-message-body edui-message-type-info">' +
		' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
		' <div class="edui-shadow"></div>' +
		' <div id="##_content" class="edui-message-content">' +
		"  </div>" +
		" </div>" +
		"</div>"
	);
};
cls_uiMessage.prototype.reset = function (opt) {
	var me = this;
	if (!opt.keepshow) {
		clearTimeout(this.timer);
		me.timer = setTimeout(function () {
			me.hide();
		}, opt.timeout || 4000);
	}

	opt.content !== undefined && me.setContent(opt.content);
	opt.type !== undefined && me.setType(opt.type);

	me.show();
};
cls_uiMessage.prototype.postRender = function () {
	var me = this,
		closer = this.getDom("closer");
	closer &&
		domUtils.on(closer, "click", function () {
			me.hide();
		});
};
cls_uiMessage.prototype.setContent = function (content) {
	this.getDom("content").innerHTML = content;
};
cls_uiMessage.prototype.setType = function (type) {
	type = type || "info";
	var body = this.getDom("body");
	body.className = body.className.replace(
		/edui-message-type-[\w-]+/,
		"edui-message-type-" + type
	);
};
cls_uiMessage.prototype.getContent = function () {
	return this.getDom("content").innerHTML;
};
cls_uiMessage.prototype.getType = function () {
	var arr = this.getDom("body").match(/edui-message-type-([\w-]+)/);
	return arr ? arr[1] : "";
};
cls_uiMessage.prototype.show = function () {
	this.getDom().style.display = "block";
};
cls_uiMessage.prototype.hide = function () {
	var dom = this.getDom();
	if (dom) {
		dom.style.display = "none";
		dom.parentNode && dom.parentNode.removeChild(dom);
	}
};

// utils.inherits(Message, UIBase);[X]

export default cls_uiMessage;