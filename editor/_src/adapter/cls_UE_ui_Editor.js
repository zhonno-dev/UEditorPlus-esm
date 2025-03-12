import UE_Editor from "../core/Editor.js";
import EditorUI from "./cls_EditorUI.js";
import utils from "../core/utils.js";
import UE from "../UE.js";
import { domUtils } from "../core/domUtils.js";

var instances = UE.instances;
//     UE.ui.Editor = function (options) {
const cls_UE_ui_Editor = function (options) {
	// var editor = new UE.Editor(options);
	var editor = new UE_Editor(options);
	editor.options.editor = editor;
	utils.loadFile(document, {
		href:
			editor.options.themePath + editor.options.theme + "/_css/ueditor.css?{timestamp:dist/themes/default/css/ueditor.css}",
		tag: "link",
		type: "text/css",
		rel: "stylesheet"
	});

	var oldRender = editor.render;
	editor.render = function (holder) {
		if (holder.constructor === String) {
			editor.key = holder;
			instances[holder] = editor;
		}
		utils.domReady(function () {
			editor.langIsReady
				? renderUI()
				: editor.addListener("langReady", renderUI);

			function renderUI() {
				editor.setOpt({
					labelMap: editor.options.labelMap || editor.getLang("labelMap")
				});
				new EditorUI(editor.options);
				if (holder) {
					if (holder.constructor === String) {
						holder = document.getElementById(holder);
					}
					holder &&
						holder.getAttribute("name") &&
						(editor.options.textarea = holder.getAttribute("name"));
					if (holder && /script|textarea/gi.test(holder.tagName)) {
						var newDiv = document.createElement("div");
						holder.parentNode.insertBefore(newDiv, holder);
						var cont = holder.value || holder.innerHTML;
						editor.options.initialContent = /^[\t\r\n ]*$/.test(cont)
							? editor.options.initialContent
							: cont
								.replace(/>[\n\r\t]+([ ]{4})+/g, ">")
								.replace(/[\n\r\t]+([ ]{4})+</g, "<")
								.replace(/>[\n\r\t]+</g, "><");
						holder.className && (newDiv.className = holder.className);
						holder.style.cssText &&
							(newDiv.style.cssText = holder.style.cssText);
						if (/textarea/i.test(holder.tagName)) {
							editor.textarea = holder;
							editor.textarea.style.display = "none";
						} else {
							holder.parentNode.removeChild(holder);
						}
						if (holder.id) {
							newDiv.id = holder.id;
							domUtils.removeAttributes(holder, "id");
						}
						holder = newDiv;
						holder.innerHTML = "";
					}
				}
				domUtils.addClass(holder, "edui-" + editor.options.theme);
				editor.ui.render(holder);
				var opt = editor.options;
				//给实例添加一个编辑器的容器引用
				editor.container = editor.ui.getDom();
				var parents = domUtils.findParents(holder, true);
				var displays = [];
				for (var i = 0, ci; (ci = parents[i]); i++) {
					displays[i] = ci.style.display;
					ci.style.display = "block";
				}
				if (opt.initialFrameWidth) {
					opt.minFrameWidth = opt.initialFrameWidth;
				} else {
					opt.minFrameWidth = opt.initialFrameWidth = holder.offsetWidth;
					var styleWidth = holder.style.width;
					if (/%$/.test(styleWidth)) {
						opt.initialFrameWidth = styleWidth;
					}
				}
				if (opt.initialFrameHeight) {
					opt.minFrameHeight = opt.initialFrameHeight;
				} else {
					opt.initialFrameHeight = opt.minFrameHeight = holder.offsetHeight;
				}
				for (var i = 0, ci; (ci = parents[i]); i++) {
					ci.style.display = displays[i];
				}
				//编辑器最外容器设置了高度，会导致，编辑器不占位
				//todo 先去掉，没有找到原因
				if (holder.style.height) {
					holder.style.height = "";
				}
				editor.container.style.width =
					opt.initialFrameWidth +
					(/%$/.test(opt.initialFrameWidth) ? "" : "px");
				editor.container.style.zIndex = opt.zIndex;
				oldRender.call(editor, editor.ui.getDom("iframeholder"));
				editor.fireEvent("afteruiready");
			}
		});
	};

	return editor;
};

export default cls_UE_ui_Editor;