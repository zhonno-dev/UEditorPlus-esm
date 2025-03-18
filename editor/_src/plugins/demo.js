//import一些文件用于IDE感知
import cls_Editor from '../core/Editor.cls.js';
import utils from '../core/utils.js';
import { domUtils } from '../core/domUtils.js';

/**
 * 旧版本的插件：UE.plugins["basestyle"] = function () {
 * 如 
 * ./basestyle.js
 * ./link.js
 */
UE.plugins["basestyle"] = function () {
	/** @type {cls_Editor} */
	var me;
	//添加快捷键
	me.addshortcutkey({
		Bold: "ctrl+66", //^B
		Italic: "ctrl+73", //^I
		Underline: "ctrl+85" //^U
	});
	me.addInputRule(function (root) {
		utils.each(root.getNodesByTagName("b i"), function (node) {
			switch (node.tagName) {
				case "b":
					node.tagName = "strong";
					break;
				case "i":
					node.tagName = "em";
			}
		});
	});
	me.addOutputRule(function (root) {
		utils.each(root.getNodesByTagName('p'), function (i, node) {
			node.tagName = "div";
		});
	});
	me.commands["insertaudio"] = {
		execCommand: function (cmd, audioObjs, type) {
			audioObjs = utils.isArray(audioObjs) ? audioObjs : [audioObjs];

			if (me.fireEvent("beforeinsertaudio", audioObjs) === true) {
				return;
			}

			var html = [];
			for (var i = 0, vi, len = audioObjs.length; i < len; i++) {
				vi = audioObjs[i];
				html.push(
					createAudioHtml(
						vi.url,
						{
							cls: 'edui-audio-audio'
						}
					)
				);
			}
			me.execCommand("inserthtml", html.join(""), true);
			var rng = this.selection.getRange();
			// for (var i = 0, len = audioObjs.length; i < len; i++) {
			//   var img = this.document.getElementById("tmpAudio" + i);
			//   domUtils.removeAttributes(img, "id");
			//   rng.selectNode(img).select();
			//   me.execCommand("imagefloat", audioObjs[i].align);
			// }

			me.fireEvent("afterinsertaudio", audioObjs);
		},
		//zhu:queryCommandState说明
		//这个queryCommandState是用于查询光标当前的内容是否已是此样式
		//如果return true则表示是此样式，然后对应的工具栏按钮就会显示成【高亮】的状态。return false 工具栏按钮就是【默认】状态不高亮。
		queryCommandState: function () {
			var img = me.selection.getRange().getClosedNode(),
				flag = img &&
					(img.className == "edui-audio-audio" || img.className.indexOf("edui-audio-audio") != -1);
			return flag ? 1 : 0;
		},
		//zhu:queryCommandValue 说明
		//这个queryCommandValue是用于那种 下拉框 工具栏按钮的（比如 段落样式，字体，代码段 这些下拉框），用于返回当前的选中值，以便于下拉框自动切换到对应的值。
		//比如当前段落是 h1,那就返回 h1 ，然后【段落样式】那个下拉框就会自动变成 h1 选项。
		/**
		 * @this {typeof import('../core/Editor.cls.js').default.prototype}
		 */
		queryCommandValue: function () {
			var node = domUtils.filterNodeList(
				this.selection.getStartElementPath(),
				"p h1 h2 h3 h4 h5 h6"
			);
			return node ? node.tagName.toLowerCase() : "";
		}
	};
	me.commands[cmd] = {
		execCommand: function (cmdName) {
			var range = me.selection.getRange(),
				obj = getObj(this, tagNames);
			if (range.collapsed) {
				if (obj) {
					var tmpText = me.document.createTextNode("");
					range.insertNode(tmpText).removeInlineStyle(tagNames);
					range.setStartBefore(tmpText);
					domUtils.remove(tmpText);
				} else {
					var tmpNode = range.document.createElement(tagNames[0]);
					if (cmdName == "superscript" || cmdName == "subscript") {
						tmpText = me.document.createTextNode("");
						range
							.insertNode(tmpText)
							.removeInlineStyle(["sub", "sup"])
							.setStartBefore(tmpText)
							.collapse(true);
					}
					range.insertNode(tmpNode).setStart(tmpNode, 0);
				}
				range.collapse(true);
			} else {
				if (cmdName == "superscript" || cmdName == "subscript") {
					if (!obj || obj.tagName.toLowerCase() != cmdName) {
						range.removeInlineStyle(["sub", "sup"]);
					}
				}
				obj
					? range.removeInlineStyle(tagNames)
					: range.applyInlineStyle(tagNames[0]);
			}
			range.select();
		},
		queryCommandState: function () {
			return getObj(this, tagNames) ? 1 : 0;
		}
	};
};


/**
 * 新版本的插件注册：使用 UE.plugin.register(插件名, ...)
 * 如 ./anchor.js
 */
UE.plugin.register("anchor", function () {
	return {
		commands: {
			insertfile: {
				execCommand: function (command, filelist) {
					filelist = utils.isArray(filelist) ? filelist : [filelist];

					if (me.fireEvent("beforeinsertfile", filelist) === true) {
						return;
					}


					//console.log('themePath',  );
					var i,
						item,
						icon,
						title,
						html = "",
						URL = me.getOpt("UEDITOR_HOME_URL"),
						iconDir = me.options.themePath + me.options.theme + "/exts/";
					for (i = 0; i < filelist.length; i++) {
						item = filelist[i];
						icon = iconDir + getFileIcon(item.url);
						title =
							item.title || item.url.substr(item.url.lastIndexOf("/") + 1);
						html +=
							'<p>' +
							'<a style="background:#EEE;padding:10px;border-radius:5px;line-height:1.5em;display:inline-flex;align-items:center;" href="' +
							item.url +
							'" title="' +
							title +
							'" target="_blank">' +
							'<img style="vertical-align:middle;margin-right:0.5em;height:1.5em;" src="' + icon + '" _src="' + icon + '" />' +
							'<span style="color:#111111;line-height:1.5em;flex-grow:1;">' +
							title +
							"</span>" +
							"</a>" +
							"</p>";
					}
					me.execCommand("insertHtml", html);

					me.fireEvent("afterinsertfile", filelist);
				}
			}
		}
	};
});

/**
 * 还有一个 registerUI()\
 * 是加入到 UE.ui[name]={id, execFn:fn, index} 里面的
 * 如：
 * _src/adapter/message.js
 * _examples/addCustomizeButton.js
 * _examples/addCustomizeCombox.js
 * _examples/addCustomizeDialog.js
 * @type {typeof import('../UE.js').default.registerUI}
 */
UE.registerUI("message", function (editor, uiName) {
	me.setOpt("enableMessageShow", true);
	if (me.getOpt("enableMessageShow") === false) {
		return;
	}
	me.addListener("ready", function () {
		holder = document.getElementById(me.ui.id + "_message_holder");
		updateHolderPos();
		setTimeout(function () {
			updateHolderPos();
		}, 500);
	});

	//注册按钮执行时的command命令，使用命令默认就会带有回退操作
	editor.registerCommand(uiName, {
		execCommand: function () {
			alert('execCommand:' + uiName);
		}
	});
});