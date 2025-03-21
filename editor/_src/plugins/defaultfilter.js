import UE from "../UE.js";
import utils from "../core/utils.js";
import { domUtils } from "../core/domUtils.js";
import dtd from "../core/dtd.js";
import cls_uNode from "../core/node.js";
import browser from "../core/browser.js";

///import core
///plugin 编辑器默认的过滤转换机制

UE.plugins["defaultfilter"] = function () {
    var me = this;
    me.setOpt({
        allowDivTransToP: true,
        disabledTableInTable: true,
        rgb2Hex: true
    });
    //默认的过滤处理
    //进入编辑器的内容处理
    me.addInputRule(function (root) {
        var allowDivTransToP = this.options.allowDivTransToP;
        var val;

        function tdParent(node) {
            while (node && node.type == "element") {
                if (node.tagName == "td") {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        //进行默认的处理
        root.traversal(function (node) {
            if (node.type == "element") {
                if (
                    !dtd.$cdata[node.tagName] &&
                    me.options.autoClearEmptyNode &&
                    dtd.$inline[node.tagName] &&
                    !dtd.$empty[node.tagName] &&
                    (!node.attrs || utils.isEmptyObject(node.attrs))
                ) {
                    if (!node.firstChild()) node.parentNode.removeChild(node);
                    else if (
                        node.tagName == "span" &&
                        (!node.attrs || utils.isEmptyObject(node.attrs))
                    ) {
                        node.parentNode.removeChild(node, true);
                    }
                    return;
                }
                switch (node.tagName) {
                    case "style":
                    case "script":
                        node.setAttr({
                            cdata_tag: node.tagName,
                            cdata_data: node.innerHTML() || "",
                            _ue_custom_node_: "true"
                        });
                        node.tagName = "div";
                        node.innerHTML("");
                        break;
                    case "a":
                        if ((val = node.getAttr("href"))) {
                            node.setAttr("_href", val);
                        }
                        break;
                    case "img":
                        //todo base64暂时去掉，后边做远程图片上传后，干掉这个
				//zhu:act:20240701160138|粘贴图片/拖入（上传）图片文件 改用base64保存图片
				//zhu:搜索定位： (/^data:/.test(val))
			//zhu:为支持图片base64模式，注释掉下面的代码
                        // if ((val = node.getAttr("src"))) {
                        //     if (/^data:/.test(val)) {
                        //         node.parentNode.removeChild(node);
                        //         break;
                        //     }
                        // }
                        // node.setAttr("_src", node.getAttr("src"));
                        break;
                    case "span":
                        if (browser.webkit && (val = node.getStyle("white-space"))) {
                            if (/nowrap|normal/.test(val)) {
                                node.setStyle("white-space", "");
                                if (
                                    me.options.autoClearEmptyNode &&
                                    utils.isEmptyObject(node.attrs)
                                ) {
                                    node.parentNode.removeChild(node, true);
                                }
                            }
                        }
                        val = node.getAttr("id");
                        if (val && /^_baidu_bookmark_/i.test(val)) {
                            node.parentNode.removeChild(node);
                        }
                        break;
                    case "p":
                        if ((val = node.getAttr("align"))) {
                            node.setAttr("align");
                            node.setStyle("text-align", val);
                        }
                        //trace:3431
                        //                        var cssStyle = node.getAttr('style');
                        //                        if (cssStyle) {
                        //                            cssStyle = cssStyle.replace(/(margin|padding)[^;]+/g, '');
                        //                            node.setAttr('style', cssStyle)
                        //
                        //                        }
                        //p标签不允许嵌套
                        utils.each(node.children, function (n) {
                            if (n.type == "element" && n.tagName == "p") {
                                var next = n.nextSibling();
                                node.parentNode.insertAfter(n, node);
                                var last = n;
                                while (next) {
                                    var tmp = next.nextSibling();
                                    node.parentNode.insertAfter(next, last);
                                    last = next;
                                    next = tmp;
                                }
                                return false;
                            }
                        });
                        if (!node.firstChild()) {
                            node.innerHTML(browser.ie ? "&nbsp;" : "<br/>");
                        }
                        break;
                    case "div":
                        if (node.getAttr("cdata_tag")) {
                            break;
                        }
                        //针对代码这里不处理插入代码的div
                        val = node.getAttr("class");
                        if (val && /^line number\d+/.test(val)) {
                            break;
                        }
                        if (!allowDivTransToP) {
                            break;
                        }
                        var tmpNode,
                            p = cls_uNode.createElement("p");
                        while ((tmpNode = node.firstChild())) {
                            if (
                                tmpNode.type == "text" ||
                                !UE.dom.dtd.$block[tmpNode.tagName]
                            ) {
                                p.appendChild(tmpNode);
                            } else {
                                if (p.firstChild()) {
                                    node.parentNode.insertBefore(p, node);
                                    p = cls_uNode.createElement("p");
                                } else {
                                    node.parentNode.insertBefore(tmpNode, node);
                                }
                            }
                        }
                        if (p.firstChild()) {
                            node.parentNode.insertBefore(p, node);
                        }
                        node.parentNode.removeChild(node);
                        break;
                    case "dl":
                        node.tagName = "ul";
                        break;
                    case "dt":
                    case "dd":
                        node.tagName = "li";
                        break;
                    case "li":
                        var className = node.getAttr("class");
                        if (!className || !/list\-/.test(className)) {
                            node.setAttr();
                        }
                        var tmpNodes = node.getNodesByTagName("ol ul");
                        UE.utils.each(tmpNodes, function (n) {
                            node.parentNode.insertAfter(n, node);
                        });
                        break;
                    case "td":
                    case "th":
                    case "caption":
                        if (!node.children || !node.children.length) {
                            node.appendChild(
                                browser.ie11below
                                    ? cls_uNode.createText(" ")
                                    : cls_uNode.createElement("br")
                            );
                        }
                        break;
                    case "table":
                        if (me.options.disabledTableInTable && tdParent(node)) {
                            node.parentNode.insertBefore(
                                cls_uNode.createText(node.innerText()),
                                node
                            );
                            node.parentNode.removeChild(node);
                        }
                }
            }
            //            if(node.type == 'comment'){
            //                node.parentNode.removeChild(node);
            //            }
        });
    });

    //从编辑器出去的内容处理
    me.addOutputRule(function (root) {
        var val;
        root.traversal(function (node) {
            if (node.type == "element") {
                if (
                    me.options.autoClearEmptyNode &&
                    dtd.$inline[node.tagName] &&
                    !dtd.$empty[node.tagName] &&
                    (!node.attrs || utils.isEmptyObject(node.attrs))
                ) {
                    if (!node.firstChild()) node.parentNode.removeChild(node);
                    else if (
                        node.tagName == "span" &&
                        (!node.attrs || utils.isEmptyObject(node.attrs))
                    ) {
                        node.parentNode.removeChild(node, true);
                    }
                    return;
                }
                switch (node.tagName) {
                    case "div":
                        if ((val = node.getAttr("cdata_tag"))) {
                            node.tagName = val;
                            node.appendChild(cls_uNode.createText(node.getAttr("cdata_data")));
                            node.setAttr({
                                cdata_tag: "",
                                cdata_data: "",
                                _ue_custom_node_: ""
                            });
                        }
                        break;
                    case "a":
                        if ((val = node.getAttr("_href"))) {
                            node.setAttr({
                                href: utils.html(val),
                                _href: ""
                            });
                        }
                        break;
                        break;
                    case "span":
                        val = node.getAttr("id");
                        if (val && /^_baidu_bookmark_/i.test(val)) {
                            node.parentNode.removeChild(node);
                        }
                        //将color的rgb格式转换为#16进制格式
                        if (me.getOpt("rgb2Hex")) {
                            var cssStyle = node.getAttr("style");
                            if (cssStyle) {
                                node.setAttr(
                                    "style",
                                    cssStyle.replace(/rgba?\(([\d,\s]+)\)/g, function (a, value) {
                                        var array = value.split(",");
                                        if (array.length > 3) return "";
                                        value = "#";
                                        for (var i = 0, color; (color = array[i++]);) {
                                            color = parseInt(
                                                color.replace(/[^\d]/gi, ""),
                                                10
                                            ).toString(16);
                                            value += color.length == 1 ? "0" + color : color;
                                        }
                                        return value.toUpperCase();
                                    })
                                );
                            }
                        }
                        break;
                    case "img":
                        if ((val = node.getAttr("_src"))) {
                            node.setAttr({
                                src: node.getAttr("_src"),
                                _src: ""
                            });
                        }
                }
            }
        });
    });
};
