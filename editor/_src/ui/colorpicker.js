// import utils from "../core/utils.js";
// import UIBase from "./uibase.js";

import cls_UIBase from "./UIBase.js";

///import core
///import uicore

var COLORS = ("ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646," +
	"f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada," +
	"d8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5," +
	"bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f," +
	"a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09," +
	"7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806," +
	"c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,").split(
		","
	);

function genColorPicker(noColorText, editor) {
	var html =
		'<div id="##" class="edui-colorpicker %%">' +
		'<div class="edui-colorpicker-topbar edui-clearfix">' +
		// '<div unselectable="on" id="##_preview" class="edui-colorpicker-preview"></div>' +
		'<div id="##_preview" class="edui-colorpicker-preview"><input type="color" id="##_input" onchange="$$._onColorSelect(event,this);" /></div>' +
		'<div unselectable="on" class="edui-colorpicker-nocolor" onclick="$$._onPickNoColor(event, this);">' +
		noColorText +
		"</div>" +
		"</div>" +
		'<table  class="edui-box" style="border-collapse: collapse;" onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);" cellspacing="0" cellpadding="0">' +
		'<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px"><td colspan="10">' +
		editor.getLang("themeColor") +
		"</td> </tr>" +
		'<tr class="edui-colorpicker-tablefirstrow" >';
	for (var i = 0; i < COLORS.length; i++) {
		if (i && i % 10 === 0) {
			html +=
				"</tr>" +
				(i == 60
					? '<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;"><td colspan="10">' +
					editor.getLang("standardColor") +
					"</td></tr>"
					: "") +
				"<tr" +
				(i == 60 ? ' class="edui-colorpicker-tablefirstrow"' : "") +
				">";
		}
		html += i < 70
			? '<td style="padding:2px 2px;"><a hidefocus title="' +
			COLORS[i] +
			'" onclick="return false;" href="javascript:" unselectable="on" class="edui-box edui-colorpicker-colorcell"' +
			' data-color="#' +
			COLORS[i] +
			'"' +
			' style="background-color:#' +
			COLORS[i] +
			";border:solid #ccc 1px;" +
			'"' +
			"></a></td>"
			: "";
	}
	html += "</tr>";
	html += "</table></div>";
	return html;
}

class cls_uiColorPicker extends cls_UIBase {
	/**
	 * 构造函数
	 */
	constructor(options) {
		super(); // 调用父类的构造函数

		this.initOptions(options);
		this.noColorText = this.noColorText || this.editor.getLang("clearColor");
		this.initUIBase();
	}
	getHtmlTpl() {
		return genColorPicker(this.noColorText, this.editor);
	}
	_onTableClick(evt) {
		var tgt = evt.target || evt.srcElement;
		var color = tgt.getAttribute("data-color");
		if (color) {
			this.fireEvent("pickcolor", color);
		}
	}
	_onTableOver(evt) {
		var tgt = evt.target || evt.srcElement;
		var color = tgt.getAttribute("data-color");
		if (color) {
			this.getDom("preview").style.backgroundColor = color;
		}
	}
	_onTableOut() {
		this.getDom("preview").style.backgroundColor = "";
	}
	_onPickNoColor() {
		this.fireEvent("picknocolor");
	}
	_onColorSelect(evt) {
		var input = evt.target || evt.srcElement;
		var color = input.value;
		if (color) {
			this.fireEvent("pickcolor", color);
		}
	}
}


// utils.inherits(ColorPicker, UIBase); [X]

export default cls_uiColorPicker;