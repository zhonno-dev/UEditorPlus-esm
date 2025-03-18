import utils from "../core/utils.js";
import { cls_uiMenu } from "./menu.js";
// import SplitButton from "./splitbutton.js";
import cls_uiSplitButton from "./splitbutton.js";

///import core
///import uicore
///import ui/menu.js
///import ui/splitbutton.js

class cls_uiMenuButton extends cls_uiSplitButton{
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(options); // 调用父类的构造函数
		
		this.initOptions(options);
		this.initMenuButton();
	}

	initMenuButton() {
		var me = this;
		this.uiName = "menubutton";
		this.popup = new cls_uiMenu({
			items: me.items,
			className: me.className,
			editor: me.editor
		});
		this.popup.addListener("show", function () {
			var list = this;
			for (var i = 0; i < list.items.length; i++) {
				list.items[i].removeState("checked");
				if (list.items[i].value == me._value) {
					list.items[i].addState("checked");
					this.value = me._value;
				}
			}
		});
		this.initSplitButton();
	}
	setValue(value) {
		this._value = value;
	}
}

// utils.inherits(MenuButton, SplitButton);[X]

export default cls_uiMenuButton;