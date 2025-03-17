import UE from "../UE.js";
import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
UE.plugin.register("formula", function () {
    var me = this, images = [];

    return {
        commands: {
            formula: {
                execCommand: function (cmdName, value) {
                    var range = me.selection.getRange(),
                        img = range.getClosedNode();

                    value = encodeURIComponent(value);
                    var formulaConfig = me.getOpt('formulaConfig');
                    var src = formulaConfig.imageUrlTemplate.replace(/\{\}/, value);

                    if (img) {
                        img.setAttribute("src", src);
                    } else {
                        me.execCommand("insertHtml", '<img src="' + src + '" data-formula-image="' + value + '" />');
                    }
                },
            }
        },
    };
});
