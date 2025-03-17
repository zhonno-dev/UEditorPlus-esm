//把原本的 _src/ui/button.js 改为用class extends ... 的类定义语法

import utils from "../core/utils.js";
// import UIBase from "./uibase.js";
// import Stateful from "./stateful.js";
import cls_uiStateful from "./stateful.cls.js";

class cls_uiButton extends cls_uiStateful {
	uiName = "button";
	label = "";
	title = "";
	showIcon = true;
	showText = true;
	cssRules = "";
	
	//构造函数
	constructor(options) {
		super(); // 调用父类的构造函数

		if (options.name) {
			var btnName = options.name;
			var cssRules = options.cssRules;
			if (!options.className) {
				options.className = "edui-for-" + btnName;
			}
			options.cssRules =
				".edui-" +
				(options.theme || "default") +
				" .edui-toolbar .edui-button.edui-for-" +
				btnName +
				" .edui-icon {" +
				cssRules +
				"}";
		}
		this.initOptions(options);
		this.initButton();
	}


	initButton() {
		this.initUIBase();
		this.Stateful_init();
		if (this.cssRules) {
			utils.cssRule("edui-customize-" + this.name + "-style", this.cssRules);
		}
	};
	getHtmlTpl() {
		let tpl = (
			'<div id="##" class="edui-box %%">' +
			'<div id="##_state" stateful>' +
			'<div class="%%-wrap"><div id="##_body" unselectable="on" ' +
			(this.title ? 'title="' + this.title + '"' : "") +
			' class="%%-body" onmousedown="return $$._onMouseDown(event, this);" onclick="return $$._onClick(event, this);">' +
			(this.showIcon ? '<div class="edui-box edui-icon"></div>' : "") +
			(this.showText
				? '<div class="edui-box edui-label">' + this.label + "</div>"
				: "") +
			"</div>" +
			"</div>" +
			"</div></div>"
		);
		return this.Stateful_getHtmlTpl(tpl);
	};
	postRender() {
		this.Stateful_postRender();
		this.setDisabled(this.disabled);
	};
	_onMouseDown(e) {
		var target = e.target || e.srcElement,
			tagName = target && target.tagName && target.tagName.toLowerCase();
		if (tagName == "input" || tagName == "object" || tagName == "object") {
			return false;
		}
	};
	_onClick() {
		if (!this.isDisabled()) {
			this.fireEvent("click");
		}
	};
	setTitle(text) {
		var label = this.getDom("label");
		label.innerHTML = text;
	};
}



//zhu:这是button原本的继承关系
// utils.inherits(Button, UIBase);[X]
// utils.extend(Button.prototype, Stateful);[X]

export default cls_uiButton;