import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
import uiUtils from "./uiutils.js";
// import UIBase from "./uibase.js";
import cls_UIBase from "./UIBase.cls.js";
import cls_uiPopup from "./popup.js";
// import Stateful from "./stateful.js";
import cls_uiStateful from "./stateful.cls.js";
import CellAlignPicker from "./cellalignpicker.js";

///import core
///import uicore
///import ui\popup.js
///import ui\stateful.js

var menuSeparator = {
	renderHtml: function () {
		return '<div class="edui-menuitem edui-menuseparator"><div class="edui-menuseparator-inner"></div></div>';
	},
	postRender: function () {
	},
	queryAutoHide: function () {
		return true;
	}
};

class cls_uiMenu extends cls_uiPopup {
	items = null;
	uiName = "menu";

	/**
	 * 构造函数
	 */
	constructor(options) {
		// console.log(options.items);
		window.zhutest = 1;
		super(options); // 调用父类的构造函数
		window.zhutest = 0;
		console.log(this.items);

		// this.initOptions(options);
		this.initMenu();
		// console.log(options.items);
	}

	initMenu() {
		this.items = this.items || [];
		// this.initPopup();
		this.initItems();
	}
	initItems() {
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if (item == "-") {
				this.items[i] = this.getSeparator();
			} else if (!(item instanceof cls_uiMenuItem)) {
				item.editor = this.editor;
				item.theme = this.editor.options.theme;
				this.items[i] = this.createItem(item);
			}
		}
	}
	getSeparator() {
		return menuSeparator;
	}
	createItem(item) {
		//新增一个参数menu, 该参数存储了menuItem所对应的menu引用
		item.menu = this;
		return new cls_uiMenuItem(item);
	}
	getContentHtmlTpl() {
		if (this.items.length == 0) {
			return this._Popup_getContentHtmlTpl();
		}
		var buff = [];
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			buff[i] = item.renderHtml();
		}
		return '<div class="%%-body">' + buff.join("") + "</div>";
	}
	postRender() {
		var me = this;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			item.ownerMenu = this;
			item.postRender();
		}
		domUtils.on(this.getDom(), "mouseover", function (evt) {
			evt = evt || event;
			var rel = evt.relatedTarget || evt.fromElement;
			var el = me.getDom();
			if (!uiUtils.contains(el, rel) && el !== rel) {
				me.fireEvent("over");
			}
		});
		this._Popup_postRender();
	}
	queryAutoHide(el) {
		if (el) {
			if (uiUtils.contains(this.getDom(), el)) {
				return false;
			}
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				if (item.queryAutoHide(el) === false) {
					return false;
				}
			}
		}
	}
	clearItems() {
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			clearTimeout(item._showingTimer);
			clearTimeout(item._closingTimer);
			if (item.subMenu) {
				item.subMenu.destroy();
			}
		}
		this.items = [];
	}
	destroy() {
		if (this.getDom()) {
			domUtils.remove(this.getDom());
		}
		this.clearItems();
	}
	dispose() {
		this.destroy();
	}
}

cls_uiMenu.prototype._Popup_getContentHtmlTpl = cls_uiPopup.prototype.getContentHtmlTpl;
cls_uiMenu.prototype._Popup_postRender = cls_uiPopup.prototype.postRender;

// utils.inherits(Menu, cls_uiPopup);[X]

/**
 * @update 2013/04/03 hancong03 新增一个参数menu, 该参数存储了menuItem所对应的menu引用
 * @type {Function}
 */
class cls_uiMenuItem extends cls_uiStateful{
	label = "";
	subMenu = null;
	ownerMenu = null;
	uiName = "menuitem";
	alwalysHoverable = true;

	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initUIBase();
		this.Stateful_init();
		if (this.subMenu && !(this.subMenu instanceof cls_uiMenu)) {
			if (options.className && options.className.indexOf("aligntd") != -1) {
				var me = this;

				//获取单元格对齐初始状态
				this.subMenu.selected = this.editor.queryCommandValue("cellalignment");

				this.subMenu = new cls_uiPopup({
					content: new CellAlignPicker(this.subMenu),
					parentMenu: me,
					editor: me.editor,
					destroy: function () {
						if (this.getDom()) {
							domUtils.remove(this.getDom());
						}
					}
				});
				this.subMenu.addListener("postRenderAfter", function () {
					domUtils.on(this.getDom(), "mouseover", function () {
						me.addState("opened");
					});
				});
			} else {
				this.subMenu = new cls_uiMenu(this.subMenu);
			}
		}
	}

	getHtmlTpl() {
		let tpl = (
			'<div id="##" class="%%" stateful onclick="$$._onClick(event, this);">' +
			'<div class="%%-body">' +
			this.renderLabelHtml() +
			"</div>" +
			"</div>"
		);
		return this.Stateful_getHtmlTpl(tpl);
	}
	postRender() {
		var me = this;
		this.addListener("over", function () {
			me.ownerMenu.fireEvent("submenuover", me);
			if (me.subMenu) {
				me.delayShowSubMenu();
			}
		});
		if (this.subMenu) {
			this.getDom().className += " edui-hassubmenu";
			this.subMenu.render();
			this.addListener("out", function () {
				me.delayHideSubMenu();
			});
			this.subMenu.addListener("over", function () {
				clearTimeout(me._closingTimer);
				me._closingTimer = null;
				me.addState("opened");
			});
			this.ownerMenu.addListener("hide", function () {
				me.hideSubMenu();
			});
			this.ownerMenu.addListener("submenuover", function (t, subMenu) {
				if (subMenu !== me) {
					me.delayHideSubMenu();
				}
			});
			this.subMenu._bakQueryAutoHide = this.subMenu.queryAutoHide;
			this.subMenu.queryAutoHide = function (el) {
				if (el && uiUtils.contains(me.getDom(), el)) {
					return false;
				}
				return this._bakQueryAutoHide(el);
			};
		}
		this.getDom().style.tabIndex = "-1";
		uiUtils.makeUnselectable(this.getDom());
		this.Stateful_postRender();
	}
	delayShowSubMenu() {
		var me = this;
		if (!me.isDisabled()) {
			me.addState("opened");
			clearTimeout(me._showingTimer);
			clearTimeout(me._closingTimer);
			me._closingTimer = null;
			me._showingTimer = setTimeout(function () {
				me.showSubMenu();
			}, 250);
		}
	}
	delayHideSubMenu() {
		var me = this;
		if (!me.isDisabled()) {
			me.removeState("opened");
			clearTimeout(me._showingTimer);
			if (!me._closingTimer) {
				me._closingTimer = setTimeout(function () {
					if (!me.hasState("opened")) {
						me.hideSubMenu();
					}
					me._closingTimer = null;
				}, 400);
			}
		}
	}
	renderLabelHtml() {
		return (
			'<div class="edui-arrow"></div>' +
			'<div class="edui-box edui-icon"></div>' +
			'<div class="edui-box edui-label %%-label">' +
			(this.label || "") +
			"</div>"
		);
	}
	getStateDom() {
		return this.getDom();
	}
	queryAutoHide(el) {
		if (this.subMenu && this.hasState("opened")) {
			return this.subMenu.queryAutoHide(el);
		}
	}
	_onClick(event, this_) {
		if (this.hasState("disabled")) return;
		if (this.fireEvent("click", event, this_) !== false) {
			if (this.subMenu) {
				this.showSubMenu();
			} else {
				cls_uiPopup.postHide(event);
			}
		}
	}
	showSubMenu() {
		var rect = uiUtils.getClientRect(this.getDom());
		rect.right -= 5;
		rect.left += 2;
		rect.width -= 7;
		rect.top -= 4;
		rect.bottom += 4;
		rect.height += 8;
		this.subMenu.showAnchorRect(rect, true, true);
	}
	hideSubMenu() {
		this.subMenu.hide();
	}
}

// utils.inherits(MenuItem, cls_UIBase);[X]
// utils.extend(MenuItem.prototype, cls_uiStateful.prototype, true);[X]

// var UE_ui_Menu;
// var UE_ui_MenuItem;
// (function () {
// 	// var utils = baidu.editor.utils,
// 	// 	domUtils = baidu.editor.dom.domUtils,
// 	// 	uiUtils = baidu.editor.ui.uiUtils,
// 	// 	UIBase = baidu.editor.ui.UIBase,
// 	// 	cls_uiPopup = baidu.editor.ui.cls_uiPopup,
// 	// 	Stateful = baidu.editor.ui.Stateful,
// 	// 	CellAlignPicker = baidu.editor.ui.CellAlignPicker;

// 	// Menu = (baidu.editor.ui.Menu = function (options) {
// 	var Menu = (UE_ui_Menu = function (options) {
// 		// this.initOptions(options);
// 		// this.initMenu();
// 	});

// 	Menu.prototype = {

// 	};
// 	utils.inherits(Menu, cls_uiPopup);

// 	/**
// 	 * @update 2013/04/03 hancong03 新增一个参数menu, 该参数存储了menuItem所对应的menu引用
// 	 * @type {Function}
// 	 */

// 	//     var MenuItem = (baidu.editor.ui.MenuItem = function (options) {
// 	var MenuItem = (UE_ui_MenuItem = function (options) {
		
// 	});
// 	MenuItem.prototype = {
		
// 	};
// })();

export { cls_uiMenu, cls_uiMenuItem };