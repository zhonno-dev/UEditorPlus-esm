import utils from "../core/utils.js";
import UIBase from "./uibase.js";

var UE_ui_Breakline;
(function () {
	// var utils = baidu.editor.utils,
	// 	UIBase = baidu.editor.ui.UIBase;
	
        // Breakline = (baidu.editor.ui.Breakline = function (options) {
		var Breakline = (UE_ui_Breakline = function (options) {
            this.initOptions(options);
            this.initSeparator();
        });
    Breakline.prototype = {
        uiName: "Breakline",
        initSeparator: function () {
            this.initUIBase();
        },
        getHtmlTpl: function () {
            return "<br/>";
        }
    };
    utils.inherits(Breakline, UIBase);
})();

export default UE_ui_Breakline;