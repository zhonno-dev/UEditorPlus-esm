import UE from "../UE.js";
import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
import browser from "../core/browser.js";
///import core
///commands 涂鸦
///commandsName  Scrawl
///commandsTitle  涂鸦
///commandsDialog  dialogs\scrawl
UE.commands["scrawl"] = {
    queryCommandState: function () {
        return browser.ie && browser.version <= 8 ? -1 : 0;
    }
};
