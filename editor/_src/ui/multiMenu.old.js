import utils from "../core/utils.js";
import Popup from "./popup.js";
import SplitButton from "./splitbutton.js";


///import core
///import uicore
///commands 表情
var UE_ui_MultiMenuPop;
(function () {
	// var utils = baidu.editor.utils,
	// 	Popup = baidu.editor.ui.Popup,
	// 	SplitButton = baidu.editor.ui.SplitButton;
	
//        var MultiMenuPop = (baidu.editor.ui.MultiMenuPop = function (options) {
	var MultiMenuPop = (UE_ui_MultiMenuPop = function (options) {
            this.initOptions(options);
            this.initMultiMenu();
        });

    MultiMenuPop.prototype = {
        initMultiMenu: function () {
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
    };

    utils.inherits(MultiMenuPop, SplitButton);
})();

export default UE_ui_MultiMenuPop;