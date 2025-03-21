//此文件是从原本的 _src/adapter/editor.js 中的 UE.ui.Editor = function (options) 独立​出来的

import cls_Editor from "../core/Editor.cls.js";
import cls_EditorUI from "./cls_EditorUI.js";
import utils from "../core/utils.js";
// import UE from "../UE.js";
import { domUtils } from "../core/domUtils.js";
import __UE from "../__UE.js";

var instances = __UE.instances;
/**
 * 定义一个UE.ui.Editor类，用于创建和管理编辑器实例\
 * @param {typeof import('../../ueditor.config.js').default} options 编辑器的配置项
 */
const new_clsEditor = function (options) {
	// var editor = new UE.Editor(options);
	var editor = new cls_Editor(options);
	// 将编辑器实例本身设置为其options的editor属性
	editor.options.editor = editor;
	// 加载编辑器的主题样式表
	utils.loadFile(document, {
		href:
			editor.options.themePath + editor.options.theme + "/_css/ueditor.css?{timestamp:dist/themes/default/css/ueditor.css}",
		tag: "link",
		type: "text/css",
		rel: "stylesheet"
	});

	// 保存原有的render方法，并重写render方法
	var oldRender = editor.render;
	editor.render = function (holder) {
		// 如果holder是一个字符串，则将其作为editor的key，并在实例中保存
		if (holder.constructor === String) {
			editor.key = holder;
			instances[holder] = editor;
		}
		// 在DOM准备好后渲染UI
		utils.domReady(function () {
			// 如果语言资源已经加载完毕，则直接渲染UI，否则等待语言资源加载完毕后再渲染
			editor.langIsReady
				? renderUI()
				: editor.addListener("langReady", renderUI);

			function renderUI() {
				// 设置编辑器的labelMap选项
				editor.setOpt({
					labelMap: editor.options.labelMap || editor.getLang("labelMap")
				});
				//创建一个新的EditorUI实例
				//	editor.ui = 这个 new cls_EditorUI(editor.options)，因为：
				//	上面设了一个 editor.options.editor = editor;
				//	然后这里把 editor.options 传进去（options.editor = editor）
				//	然后在 cls_UIBase.initOptions(options) 中：
				//		me[editor] = options[editor] 让这个 new cls_EditorUI.editor = editor
				//	最后在这个 cls_EditorUI.initEditorUI() 中：
				//		this.editor.ui = this;
				//		即 editor.ui = 这个 new cls_EditorUI(editor.options)
				//	真特么的绕~~~
				new cls_EditorUI(editor.options);
				// 如果有holder参数，则根据其类型处理相应的逻辑
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
				// 为holder添加编辑器主题的CSS类名
				domUtils.addClass(holder, "edui-" + editor.options.theme);
				// 渲染编辑器UI(toolbar|工具栏)
				editor.ui.render(holder);
				var opt = editor.options;
				// 给实例添加一个编辑器的容器引用
				editor.container = editor.ui.getDom();
				// console.log(editor.container);
				var parents = domUtils.findParents(holder, true);
				var displays = [];
				for (var i = 0, ci; (ci = parents[i]); i++) {
					//先备份原本的 style.display 到 displays，在下方再次用循环恢复
					displays[i] = ci.style.display;
					//把 style.display 临时改为 block（应该是用于计算宽、高度）
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
				//恢复原本的 style.display 值
				for (var i = 0, ci; (ci = parents[i]); i++) {
					ci.style.display = displays[i];
				}
				// 编辑器最外容器设置了高度，会导致，编辑器不占位
				// todo 先去掉，没有找到原因
				if (holder.style.height) {
					holder.style.height = "";
				}
				editor.container.style.width =
					opt.initialFrameWidth +
					(/%$/.test(opt.initialFrameWidth) ? "" : "px");
				editor.container.style.zIndex = opt.zIndex;
				// 调用原有的render方法渲染编辑器的iframe
				oldRender.call(editor, editor.ui.getDom("iframeholder"));
				// 触发afteruiready事件
				editor.fireEvent("afteruiready");
			}
		});
	};

	// 返回编辑器实例
	return editor;
};
export default new_clsEditor;