import uiUtils from "./uiutils.js";
import cls_UIBase from "./UIBase.js";

///import core
///import uicore
class cls_uiTablePicker extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.initTablePicker();
	}

}

cls_uiTablePicker.prototype.defaultNumRows = 10;
cls_uiTablePicker.prototype.defaultNumCols = 10;
cls_uiTablePicker.prototype.maxNumRows = 20;
cls_uiTablePicker.prototype.maxNumCols = 20;
cls_uiTablePicker.prototype.numRows = 10;
cls_uiTablePicker.prototype.numCols = 10;
cls_uiTablePicker.prototype.lengthOfCellSide = 22;
cls_uiTablePicker.prototype.initTablePicker = function () {
	this.initUIBase();
};
cls_uiTablePicker.prototype.getHtmlTpl = function () {
	var me = this;
	return (
		'<div id="##" class="edui-tablepicker %%">' +
		'<div class="edui-tablepicker-body">' +
		'<div class="edui-infoarea">' +
		'<span id="##_label" class="edui-label"></span>' +
		"</div>" +
		'<div class="edui-pickarea"' +
		' onmousemove="$$._onMouseMove(event, this);"' +
		' onmouseover="$$._onMouseOver(event, this);"' +
		' onmouseout="$$._onMouseOut(event, this);"' +
		' onclick="$$._onClick(event, this);"' +
		">" +
		'<div id="##_overlay" class="edui-overlay"></div>' +
		"</div>" +
		"</div>" +
		"</div>"
	);
};
cls_uiTablePicker.prototype._UIBase_render = cls_UIBase.prototype.render;
cls_uiTablePicker.prototype.render = function (holder) {
	this._UIBase_render(holder);
	this.getDom("label").innerHTML =
		"0" +
		this.editor.getLang("t_row") +
		" x 0" +
		this.editor.getLang("t_col");
};
cls_uiTablePicker.prototype._track = function (numCols, numRows) {
	var style = this.getDom("overlay").style;
	var sideLen = this.lengthOfCellSide;
	style.width = numCols * sideLen + "px";
	style.height = numRows * sideLen + "px";
	var label = this.getDom("label");
	label.innerHTML =
		numCols +
		this.editor.getLang("t_col") +
		" x " +
		numRows +
		this.editor.getLang("t_row");
	this.numCols = numCols;
	this.numRows = numRows;
};
cls_uiTablePicker.prototype._onMouseOver = function (evt, el) {
	var rel = evt.relatedTarget || evt.fromElement;
	if (!uiUtils.contains(el, rel) && el !== rel) {
		this.getDom("label").innerHTML =
			"0" +
			this.editor.getLang("t_col") +
			" x 0" +
			this.editor.getLang("t_row");
		this.getDom("overlay").style.visibility = "";
	}
};
cls_uiTablePicker.prototype._onMouseOut = function (evt, el) {
	var rel = evt.relatedTarget || evt.toElement;
	if (!uiUtils.contains(el, rel) && el !== rel) {
		this.getDom("label").innerHTML =
			"0" +
			this.editor.getLang("t_col") +
			" x 0" +
			this.editor.getLang("t_row");
		this.getDom("overlay").style.visibility = "hidden";
	}
};
cls_uiTablePicker.prototype._onMouseMove = function (evt, el) {
	var style = this.getDom("overlay").style;
	var offset = uiUtils.getEventOffset(evt);
	var sideLen = this.lengthOfCellSide;
	var numCols = Math.ceil(offset.left / sideLen);
	var numRows = Math.ceil(offset.top / sideLen);
	this._track(numCols, numRows);
};
cls_uiTablePicker.prototype._onClick = function () {
	this.fireEvent("picktable", this.numCols, this.numRows);
};

// utils.inherits(TablePicker, UIBase);[X]

export default cls_uiTablePicker;