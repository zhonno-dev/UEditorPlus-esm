import utils from "../core/utils.js";
import UIBase from "./uibase.js";

var UE_ui_Separator;

(function () {
	// var utils = baidu.editor.utils,
	// 	UIBase = baidu.editor.ui.UIBase;
        // var Separator = (baidu.editor.ui.Separator = function (options) {
		var Separator = (UE_ui_Separator = function (options) {
            this.initOptions(options);
            this.initSeparator();
        });
    Separator.prototype = {
        uiName: "separator",
        initSeparator: function () {
            this.initUIBase();
        },
        getHtmlTpl: function () {
            return '<div id="##" class="edui-box %%"></div>';
        }
    };
    utils.inherits(Separator, UIBase);
})();

export default UE_ui_Separator;