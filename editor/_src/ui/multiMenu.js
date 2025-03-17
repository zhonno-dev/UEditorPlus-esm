import utils from "../core/utils.js";
import Popup from "./popup.js";
// import SplitButton from "./splitbutton.js";

import cls_uiSplitButton from "./splitbutton.js";


///import core
///import uicore
///commands 表情

class cls_uiMultiMenuPop extends cls_uiSplitButton{
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(options); // 调用父类的构造函数
		
		this.initOptions(options);
		this.initMultiMenu();
	}
	initMultiMenu() {
		var me = this;
		this.popup = new Popup({
			content: "",
			editor: me.editor,
			iframe_rendered: false,
			onshow: function () {
				if (!this.iframe_rendered) {
					this.iframe_rendered = true;
					this.getDom("content").innerHTML =
						'<iframe id="' +
						me.id +
						'_iframe" src="' +
						me.iframeUrl +
						'" frameborder="0"></iframe>';
					me.editor.container.style.zIndex &&
						(this.getDom().style.zIndex =
							me.editor.container.style.zIndex * 1 + 1);
				}
			}
			// canSideUp:false,
			// canSideLeft:false
		});
		this.onbuttonclick = function () {
			this.showPopup();
		};
		this.initSplitButton();
	}
}

// utils.inherits(MultiMenuPop, SplitButton);[X]

export default cls_uiMultiMenuPop;