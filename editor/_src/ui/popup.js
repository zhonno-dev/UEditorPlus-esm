import uiUtils from "./uiutils.js";
import { domUtils } from "../core/domUtils.js";

import cls_UIBase from "./UIBase.cls.js";

///import core
///import uicore

var allPopups = [];
/**
 * 关闭所有弹出层
 * 
 * 此函数遍历所有弹出层对象，检查它们是否应该被隐藏，并在符合条件时隐藏它们此外，在所有弹出层都被检查过后，
 * 触发一个自定义事件来通知其他部分弹出层已关闭
 * 
 * @param {Event} evt - 可选的事件对象，用于检查触发隐藏的原因
 * @param {HTMLElement} el - 可选的触发隐藏操作的元素
 */
function closeAllPopup(evt, el) {
	// 遍历所有弹出层对象
	for (var i = 0; i < allPopups.length; i++) {
		var pop = allPopups[i];
		// 检查弹出层是否当前可见
		if (!pop.isHidden()) {
			// 查询弹出层是否自动隐藏，除非明确返回false
			if (pop.queryAutoHide(el) !== false) {
				// 特殊处理某些事件和弹出层类型
				if (
					evt &&
					/scroll/gi.test(evt.type) &&
					pop.className === "edui-wordpastepop"
				)
					return;
				// 隐藏符合条件的弹出层
				pop.hide();
			}
		}
	}

	// 如果存在弹出层对象，触发'afterhidepop'事件
	if (allPopups.length) pop.editor.fireEvent("afterhidepop");
}

var ANCHOR_CLASSES = [
	"edui-anchor-topleft",
	"edui-anchor-topright",
	"edui-anchor-bottomleft",
	"edui-anchor-bottomright"
];

class cls_uiPopup extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initPopup();
	}
}

//静态方法
cls_uiPopup.postHide = closeAllPopup;
cls_uiPopup.prototype.SHADOW_RADIUS = 5;
cls_uiPopup.prototype.content = null;
cls_uiPopup.prototype._hidden = false;
cls_uiPopup.prototype.autoRender = true;
cls_uiPopup.prototype.canSideLeft = true;
cls_uiPopup.prototype.canSideUp = true;
cls_uiPopup.prototype.initPopup = function () {
	this.initUIBase();
	allPopups.push(this);
};
cls_uiPopup.prototype.getHtmlTpl = function () {
	return (
		'<div id="##" class="edui-popup %%" onmousedown="return false;">' +
		' <div id="##_body" class="edui-popup-body">' +
		' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
		' <div class="edui-shadow"></div>' +
		' <div id="##_content" class="edui-popup-content">' +
		this.getContentHtmlTpl() +
		"  </div>" +
		" </div>" +
		"</div>"
	);
};
cls_uiPopup.prototype.getContentHtmlTpl = function () {
	if (this.content) {
		if (typeof this.content == "string") {
			return this.content;
		}
		return this.content.renderHtml();
	} else {
		return "";
	}
};
cls_uiPopup.prototype._UIBase_postRender = cls_UIBase.prototype.postRender;
cls_uiPopup.prototype.postRender = function () {
	if (this.content instanceof cls_UIBase) {
		this.content.postRender();
	}

	//捕获鼠标滚轮
	if (this.captureWheel && !this.captured) {
		this.captured = true;

		var winHeight =
			(document.documentElement.clientHeight ||
				document.body.clientHeight) - 80,
			_height = this.getDom().offsetHeight,
			_top = uiUtils.getClientRect(this.combox.getDom()).top,
			content = this.getDom("content"),
			ifr = this.getDom("body").getElementsByTagName("iframe"),
			me = this;

		ifr.length && (ifr = ifr[0]);

		while (_top + _height > winHeight) {
			_height -= 30;
		}
		content.style.height = _height + "px";
		//同步更改iframe高度
		ifr && (ifr.style.height = _height + "px");

		//阻止在combox上的鼠标滚轮事件, 防止用户的正常操作被误解
		domUtils.on(
			content,
			"onmousewheel" in document.body ? "mousewheel" : "DOMMouseScroll",
			function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}

				if (e.wheelDelta) {
					content.scrollTop -= e.wheelDelta / 120 * 60;
				} else {
					content.scrollTop -= e.detail / -3 * 60;
				}
			}
		);
	}
	this.fireEvent("postRenderAfter");
	this.hide(true);
	this._UIBase_postRender();
};
cls_uiPopup.prototype._doAutoRender = function () {
	if (!this.getDom() && this.autoRender) {
		this.render();
	}
};
cls_uiPopup.prototype.mesureSize = function () {
	var box = this.getDom("content");
	return uiUtils.getClientRect(box);
};
cls_uiPopup.prototype.fitSize = function () {
	// console.log('fitSize.popup')
	if (this.captureWheel && this.sized) {
		return this.__size;
	}
	this.sized = true;
	var popBodyEl = this.getDom("body");
	popBodyEl.style.width = "";
	popBodyEl.style.height = "";
	var size = this.mesureSize();
	if (this.captureWheel) {
		popBodyEl.style.width = -(-20 - size.width) + "px";
		var height = parseInt(this.getDom("content").style.height, 10);
		!window.isNaN(height) && (size.height = height);
	} else {
		popBodyEl.style.width = size.width + "px";
	}
	popBodyEl.style.height = size.height + "px";
	this.__size = size;
	this.captureWheel && (this.getDom("content").style.overflow = "auto");
	return size;
};
cls_uiPopup.prototype.showAnchor = function (element, hoz) {
	this.showAnchorRect(uiUtils.getClientRect(element), hoz);
};
cls_uiPopup.prototype.showAnchorRect = function (rect, hoz, adj) {
	this._doAutoRender();
	var vpRect = uiUtils.getViewportRect();
	this.getDom().style.visibility = "hidden";
	this._show();
	var popSize = this.fitSize();

	var sideLeft, sideUp, left, top;
	if (hoz) {
		sideLeft =
			this.canSideLeft &&
			(rect.right + popSize.width > vpRect.right &&
				rect.left > popSize.width);
		sideUp =
			this.canSideUp &&
			(rect.top + popSize.height > vpRect.bottom &&
				rect.bottom > popSize.height);
		left = sideLeft ? rect.left - popSize.width : rect.right;
		top = sideUp ? rect.bottom - popSize.height : rect.top;
	} else {
		sideLeft =
			this.canSideLeft &&
			(rect.right + popSize.width > vpRect.right &&
				rect.left > popSize.width);
		sideUp =
			this.canSideUp &&
			(rect.top + popSize.height > vpRect.bottom &&
				rect.bottom > popSize.height);
		left = sideLeft ? rect.right - popSize.width : rect.left;
		top = sideUp ? rect.top - popSize.height : rect.bottom;
	}
	if (!sideUp) {
		if (top + popSize.height > vpRect.bottom) {
			top = vpRect.bottom - popSize.height;
		}
	}
	// console.log('popup.showAnchorRect', vpRect, rect, hoz, sideUp, sideLeft, left, top);

	var popEl = this.getDom();
	uiUtils.setViewportOffset(popEl, {
		left: left,
		top: top
	});
	domUtils.removeClasses(popEl, ANCHOR_CLASSES);
	popEl.className +=
		" " + ANCHOR_CLASSES[(sideUp ? 1 : 0) * 2 + (sideLeft ? 1 : 0)];
	if (this.editor) {
		popEl.style.zIndex = this.editor.container.style.zIndex * 1 + 10;
		uiUtils.getFixedLayer().style.zIndex =
			popEl.style.zIndex - 1;
	}
	this.getDom().style.visibility = "visible";
};
cls_uiPopup.prototype.showAt = function (offset) {
	var left = offset.left;
	var top = offset.top;
	var rect = {
		left: left,
		top: top,
		right: left,
		bottom: top,
		height: 0,
		width: 0
	};
	this.showAnchorRect(rect, false, true);
};
cls_uiPopup.prototype._show = function () {
	if (this._hidden) {
		var box = this.getDom();
		box.style.display = "";
		this._hidden = false;
		//                if (box.setActive) {
		//                    box.setActive();
		//                }
		this.fireEvent("show");
	}
};
cls_uiPopup.prototype.isHidden = function () {
	return this._hidden;
};
cls_uiPopup.prototype.show = function () {
	this._doAutoRender();
	this._show();
};
cls_uiPopup.prototype.hide = function (notNofity) {
	if (!this._hidden && this.getDom()) {
		this.getDom().style.display = "none";
		this._hidden = true;
		if (!notNofity) {
			this.fireEvent("hide");
		}
	}
};
cls_uiPopup.prototype.queryAutoHide = function (el) {
	return !el || !uiUtils.contains(this.getDom(), el);
};

domUtils.on(document, "mousedown", function (evt) {
	var el = evt.target || evt.srcElement;
	closeAllPopup(evt, el);
});
domUtils.on(window, "scroll", function (evt, el) {
	closeAllPopup(evt, el);
});

// utils.inherits(Popup, UIBase);[X]

export default cls_uiPopup;