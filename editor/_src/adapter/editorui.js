import utils from "../core/utils.js";
import UE from "../UE.js";
import UE_ui_Dialog from "../ui/dialog.js";
import browser from "../core/browser.js";
import cls_uiButton from "../ui/button.js";
import UE_ui_ColorButton from "../ui/colorbutton.js";
import UE_ui_Combox from "../ui/combox.js";
import UE_ui_TableButton from "../ui/tablebutton.js";
import UE_ui_MenuButton from "../ui/menubutton.js";
import UE_ui_MultiMenuPop from "../ui/multiMenu.js";
import UE_ui_AutoTypeSetButton from "../ui/autotypesetbutton.js";
import { domUtils } from "../core/domUtils.js";

//ui跟编辑器的适配層
//哪个按钮弹出是dialog，还是下拉框等都是在这个js中配置
//自己写的ui也要在这里配置，放到baidu.editor.ui下边，当编辑器实例化的时候会根据ueditor.config中的toolbars找到相应的进行实例化
UE.ui.buttons = {};

UE.ui.Dialog = function (options) {
	var dialog = new UE_ui_Dialog(options);
	dialog.addListener("hide", function () {
		if (dialog.editor) {
			var editor = dialog.editor;
			try {
				if (browser.gecko) {
					var y = editor.window.scrollY,
						x = editor.window.scrollX;
					editor.body.focus();
					editor.window.scrollTo(x, y);
				} else {
					editor.focus();
				}
			} catch (ex) {
			}
		}
	});
	return dialog;
};

//为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
var btnCmds = [
	"undo", // 撤销操作
	"redo", // 重做操作
	"formatmatch", // 格式刷，用于匹配格式
	"bold", // 加粗
	"italic", // 倾斜
	"underline", // 下划线
	"fontborder", // 字体边框
	"touppercase", // 转换为大写
	"tolowercase", // 转换为小写
	"strikethrough", // 删除线
	"subscript", // 下标
	"superscript", // 上标
	"source", // 切换到源码模式
	"indent", // 增加缩进
	"outdent", // 减少缩进
	"blockquote", // 引用块
	"pasteplain", // 纯文本粘贴
	"pagebreak", // 分页符
	"selectall", // 全选
	"print", // 打印
	"horizontal", // 插入水平线
	"removeformat", // 清除格式
	"time", // 插入当前时间
	"date", // 插入当前日期
	"unlink", // 取消链接
	"insertparagraphbeforetable", // 在表格前插入段落
	"insertrow", // 插入行
	"insertcol", // 插入列
	"mergeright", // 向右合并单元格
	"mergedown", // 向下合并单元格
	"deleterow", // 删除行
	"deletecol", // 删除列
	"splittorows", // 拆分为多行
	"splittocols", // 拆分为多列
	"splittocells", // 拆分为多个单元格
	"mergecells", // 合并单元格
	"deletetable", // 删除表格
];


//zhu:以下是在原本的代码取消了【即时执行的匿名函数】后的for循环
for (var i = 0, ci; (ci = btnCmds[i++]);) {
	ci = ci.toLowerCase();
	let cmd = ci;
	/**
	 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
	 */
	UE.ui[ci] = function (editor) {
		var ui = new cls_uiButton({
			className: "edui-for-" + cmd,
			title:
				editor.options.labelMap[cmd] ||
				editor.getLang("labelMap." + cmd) ||
				"",
			onclick: function () {
				editor.execCommand(cmd);
			},
			theme: editor.options.theme,
			showText: false
		});
		// console.log(cmd);
		switch (cmd) {
			case 'bold':
			case 'italic':
			case 'underline':
			case 'strikethrough':
			case 'fontborder':
				/**
				 * 检查按钮是否应该显示的函数。
				 * @returns {boolean} 如果按钮应该显示则返回 true，否则返回 false。
				 */
				ui.shouldUiShow = function () {
					// 检查当前编辑器中是否有选中的文本
					// 如果没有选中的文本，则按钮不应该显示，返回 false
					if (!editor.selection.getText()) {
						return false;
					}
					// 检查当前命令的状态是否为禁用状态
					// 如果命令状态不是禁用状态，则按钮应该显示，返回 true
					return editor.queryCommandState(cmd) !== UE.constants.STATEFUL.DISABLED;
				};
				break;
		}
		UE.ui.buttons[cmd] = ui;
		editor.addListener("selectionchange", function (
			type,
			causeByUi,
			uiReady
		) {
			var state = editor.queryCommandState(cmd);
			if (state === -1) {
				ui.setDisabled(true);
				ui.setChecked(false);
			} else {
				if (!uiReady) {
					ui.setDisabled(false);
					ui.setChecked(state);
				}
			}
		});
		return ui;
	};
}


/**
 * 清除文档
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.cleardoc = function (editor) {
	var ui = new cls_uiButton({
		className: "edui-for-cleardoc",
		title:
			editor.options.labelMap.cleardoc ||
			editor.getLang("labelMap.cleardoc") ||
			"",
		theme: editor.options.theme,
		onclick: function () {
			if (confirm(editor.getLang("confirmClear"))) {
				editor.execCommand("cleardoc");
			}
		}
	});
	UE.ui.buttons["cleardoc"] = ui;
	editor.addListener("selectionchange", function () {
		ui.setDisabled(editor.queryCommandState("cleardoc") == -1);
	});
	return ui;
};

var imageTypeSet = [
	'none', 'left', 'center', 'right'
];
for (let value of imageTypeSet) {
	(function (value) {
		/** @param {typeof import('../core/Editor.cls.js').default.prototype} editor */
		UE.ui['image' + value] = function (editor) {
			var ui = new cls_uiButton({
				className: "edui-for-" + 'image' + value,
				title:
					editor.options.labelMap['image' + value] ||
					editor.getLang(
						"labelMap." + 'image' + value
					) ||
					"",
				theme: editor.options.theme,
				onclick: function () {
					editor.execCommand('imagefloat', value);
				},
				shouldUiShow: function () {
					let closedNode = editor.selection.getRange().getClosedNode();
					if (!closedNode || closedNode.tagName !== "IMG") {
						return false;
					}
					if (domUtils.hasClass(closedNode, "uep-loading") || domUtils.hasClass(closedNode, "uep-loading-error")) {
						return false;
					}
					return editor.queryCommandState('imagefloat') !== UE.constants.STATEFUL.DISABLED;
				}
			});
			UE.ui.buttons['image' + value] = ui;
			editor.addListener("selectionchange", function (
				type,
				causeByUi,
				uiReady
			) {
				ui.setDisabled(editor.queryCommandState('imagefloat') === UE.constants.STATEFUL.DISABLED);
				ui.setChecked(editor.queryCommandValue('imagefloat') === value && !uiReady);
			});
			return ui;
		};
	})(value);
}

//排版，图片排版，文字方向
var typeset = {
	justify: ["left", "right", "center", "justify"],
	directionality: ["ltr", "rtl"]
};
for (var p in typeset) {
	(function (cmd, val) {
		for (var i = 0, ci; (ci = val[i++]);) {
			(function (cmd2) {
				/**
				 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
				 */
				UE.ui[cmd.replace("float", "") + cmd2] = function (editor) {
					var ui = new cls_uiButton({
						className: "edui-for-" + cmd.replace("float", "") + cmd2,
						title:
							editor.options.labelMap[cmd.replace("float", "") + cmd2] ||
							editor.getLang(
								"labelMap." + cmd.replace("float", "") + cmd2
							) ||
							"",
						theme: editor.options.theme,
						onclick: function () {
							editor.execCommand(cmd, cmd2);
						}
					});
					UE.ui.buttons[cmd] = ui;
					editor.addListener("selectionchange", function (
						type,
						causeByUi,
						uiReady
					) {
						ui.setDisabled(editor.queryCommandState(cmd) == -1);
						ui.setChecked(editor.queryCommandValue(cmd) == cmd2 && !uiReady);
					});
					return ui;
				};
			})(ci);
		}
	})(p, typeset[p]);
}

//字体颜色和背景颜色
for (var i = 0, ci; (ci = ["backcolor", "forecolor"][i++]);) {
	UE.ui[ci] = (function (cmd) {
		/**
		 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
		 */
		return function (editor) {
			var ui = new UE_ui_ColorButton({
				className: "edui-for-" + cmd,
				color: "default",
				title:
					editor.options.labelMap[cmd] ||
					editor.getLang("labelMap." + cmd) ||
					"",
				editor: editor,
				onpickcolor: function (t, color) {
					editor.execCommand(cmd, color);
				},
				onpicknocolor: function () {
					editor.execCommand(cmd, "default");
					this.setColor("transparent");
					this.color = "default";
				},
				onbuttonclick: function () {
					editor.execCommand(cmd, this.color);
				},
				shouldUiShow: function () {
					if (!editor.selection.getText()) {
						return false;
					}
					return editor.queryCommandState(cmd) !== UE.constants.STATEFUL.DISABLED;
				}
			});

			UE.ui.buttons[cmd] = ui;
			editor.addListener("selectionchange", function () {
				ui.setDisabled(editor.queryCommandState(cmd) == -1);
			});
			return ui;
		};
	})(ci);
}

var dialogIframeUrlMap = {
	anchor: "~/dialogs/anchor/anchor.html?{timestamp}",
	insertimage: "~/dialogs/image/image.html?{timestamp}",
	link: "~/dialogs/link/link.html?{timestamp}",
	spechars: "~/dialogs/spechars/spechars.html?{timestamp}",
	searchreplace: "~/dialogs/searchreplace/searchreplace.html?{timestamp}",
	insertvideo: "~/dialogs/video/video.html?{timestamp}",
	insertaudio: "~/dialogs/audio/audio.html?{timestamp}",
	help: "~/dialogs/help/help.html?{timestamp}",
	preview: "~/dialogs/preview/preview.html?{timestamp}",
	emotion: "~/dialogs/emotion/emotion.html?{timestamp}",
	wordimage: "~/dialogs/wordimage/wordimage.html?{timestamp}",
	formula: "~/dialogs/formula/formula.html?{timestamp}",
	attachment: "~/dialogs/attachment/attachment.html?{timestamp}",
	insertframe: "~/dialogs/insertframe/insertframe.html?{timestamp}",
	edittip: "~/dialogs/table/edittip.html?{timestamp}",
	edittable: "~/dialogs/table/edittable.html?{timestamp}",
	edittd: "~/dialogs/table/edittd.html?{timestamp}",
	scrawl: "~/dialogs/scrawl/scrawl.html?{timestamp}",
	template: "~/dialogs/template/template.html?{timestamp}",
	background: "~/dialogs/background/background.html?{timestamp}",
	contentimport: "~/dialogs/contentimport/contentimport.html?{timestamp}",
};
var dialogBtns = {
	noOk: ["searchreplace", "help", "spechars", "preview"],
	ok: [
		"attachment",
		"anchor",
		"link",
		"insertimage",
		"insertframe",
		"wordimage",
		"insertvideo",
		"insertaudio",
		"edittip",
		"edittable",
		"edittd",
		"scrawl",
		"template",
		"formula",
		"background",
		"contentimport",
	]
};
for (var p in dialogBtns) {
	(function (type, vals) {
		for (var i = 0, ci; (ci = vals[i++]);) {
			//todo opera下存在问题
			if (browser.opera && ci === "searchreplace") {
				continue;
			}
			(function (cmd) {
				/**
				 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
				 */
				UE.ui[cmd] = function (editor, iframeUrl, title) {
					iframeUrl =
						iframeUrl ||
						(editor.options.dialogIframeUrlMap || {})[cmd] ||
						dialogIframeUrlMap[cmd];
					title =
						editor.options.labelMap[cmd] ||
						editor.getLang("labelMap." + cmd) ||
						"";

					var dialog;
					//没有iframeUrl不创建dialog
					if (iframeUrl) {
						dialog = new UE_ui_Dialog(
							utils.extend(
								{
									iframeUrl: editor.ui.mapUrl(iframeUrl),
									editor: editor,
									className: "edui-for-" + cmd,
									title: title,
									holdScroll: cmd === "insertimage",
									fullscreen: /preview/.test(cmd),
									closeDialog: editor.getLang("closeDialog")
								},
								type === "ok"
									? {
										buttons: [
											{
												className: "edui-okbutton",
												label: editor.getLang("ok"),
												editor: editor,
												onclick: function () {
													dialog.close(true);
												}
											},
											{
												className: "edui-cancelbutton",
												label: editor.getLang("cancel"),
												editor: editor,
												onclick: function () {
													dialog.close(false);
												}
											}
										]
									}
									: {}
							)
						);

						editor.ui._dialogs[cmd + "Dialog"] = dialog;
					}

					var ui = new cls_uiButton({
						className: "edui-for-" + cmd,
						title: title,
						onclick: function () {
							if (editor.options.toolbarCallback) {
								if (true === editor.options.toolbarCallback(cmd, editor)) {
									return;
								}
							}
							if (dialog) {
								switch (cmd) {
									case "wordimage":
										var images = editor.execCommand("wordimage");
										if (images && images.length) {
											dialog.render();
											dialog.open();
										}
										break;
									case "scrawl":
										if (editor.queryCommandState("scrawl") !== -1) {
											dialog.render();
											dialog.open();
										}
										break;
									default:
										dialog.render();
										dialog.open();
								}
							}
						},
						theme: editor.options.theme,
						disabled: (cmd === "scrawl" && editor.queryCommandState("scrawl") === -1)
					});
					switch (cmd) {
						case 'insertimage':
						case 'formula':
							ui.shouldUiShow = (function (cmd) {
								return function () {
									let closedNode = editor.selection.getRange().getClosedNode();
									if (!closedNode || closedNode.tagName !== "IMG") {
										return false;
									}
									if ('formula' === cmd && closedNode.getAttribute('data-formula-image') !== null) {
										return true;
									}
									if ('insertimage' === cmd) {
										return true;
									}
									return false;
								};
							})(cmd);
							break;
					}
					UE.ui.buttons[cmd] = ui;
					editor.addListener("selectionchange", function () {
						//只存在于右键菜单而无工具栏按钮的ui不需要检测状态
						var unNeedCheckState = { edittable: 1 };
						if (cmd in unNeedCheckState) return;

						var state = editor.queryCommandState(cmd);
						if (ui.getDom()) {
							ui.setDisabled(state === -1);
							ui.setChecked(state);
						}
					});

					return ui;
				};
			})(ci.toLowerCase());
		}
	})(p, dialogBtns[p]);
}

/** @param {typeof import('../core/Editor.cls.js').default.prototype} editor */
UE.ui.insertcode = function (editor, list, title) {
	list = editor.options["insertcode"] || [];
	title =
		editor.options.labelMap["insertcode"] ||
		editor.getLang("labelMap.insertcode") ||
		"";
	// if (!list.length) return;
	var items = [];
	utils.each(list, function (key, val) {
		items.push({
			label: key,
			value: val,
			theme: editor.options.theme,
			renderLabelHtml: function () {
				return (
					'<div class="edui-label %%-label" >' + (this.label || "") + "</div>"
				);
			}
		});
	});

	var ui = new UE_ui_Combox({
		editor: editor,
		items: items,
		onselect: function (t, index) {
			editor.execCommand("insertcode", this.items[index].value);
		},
		onbuttonclick: function () {
			this.showPopup();
		},
		title: title,
		initValue: title,
		className: "edui-for-insertcode",
		indexByValue: function (value) {
			if (value) {
				for (var i = 0, ci; (ci = this.items[i]); i++) {
					if (ci.value.indexOf(value) != -1) return i;
				}
			}

			return -1;
		}
	});
	UE.ui.buttons["insertcode"] = ui;
	editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
		if (!uiReady) {
			var state = editor.queryCommandState("insertcode");
			if (state == -1) {
				ui.setDisabled(true);
			} else {
				ui.setDisabled(false);
				var value = editor.queryCommandValue("insertcode");
				if (!value) {
					ui.setValue(title);
					return;
				}
				//trace:1871 ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
				value && (value = value.replace(/['"]/g, "").split(",")[0]);
				ui.setValue(value);
			}
		}
	});
	return ui;
};

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.fontfamily = function (editor, list, title) {
	list = editor.options["fontfamily"] || [];
	title =
		editor.options.labelMap["fontfamily"] ||
		editor.getLang("labelMap.fontfamily") ||
		"";
	if (!list.length) return;
	for (var i = 0, ci, items = []; (ci = list[i]); i++) {
		var langLabel = editor.getLang("fontfamily")[ci.name] || "";
		(function (key, val) {
			items.push({
				label: key,
				value: val,
				theme: editor.options.theme,
				renderLabelHtml: function () {
					return (
						'<div class="edui-label %%-label" style="font-family:' +
						utils.unhtml(this.value) +
						'">' +
						(this.label || "") +
						"</div>"
					);
				}
			});
		})(ci.label || langLabel, ci.val);
	}
	var ui = new UE_ui_Combox({
		editor: editor,
		items: items,
		onselect: function (t, index) {
			editor.execCommand("FontFamily", this.items[index].value);
		},
		onbuttonclick: function () {
			this.showPopup();
		},
		title: title,
		initValue: title,
		className: "edui-for-fontfamily",
		indexByValue: function (value) {
			if (value) {
				for (var i = 0, ci; (ci = this.items[i]); i++) {
					if (ci.value.indexOf(value) != -1) return i;
				}
			}
			return -1;
		}
	});
	UE.ui.buttons["fontfamily"] = ui;
	editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
		if (!uiReady) {
			var state = editor.queryCommandState("FontFamily");
			if (state == -1) {
				ui.setDisabled(true);
			} else {
				ui.setDisabled(false);
				var value = editor.queryCommandValue("FontFamily");
				//trace:1871 ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
				value && (value = value.replace(/['"]/g, "").split(",")[0]);
				ui.setValue(value);
			}
		}
	});
	return ui;
};

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.fontsize = function (editor, list, title) {
	title =
		editor.options.labelMap["fontsize"] ||
		editor.getLang("labelMap.fontsize") ||
		"";
	list = list || editor.options["fontsize"] || [];
	if (!list.length) return;
	var items = [];
	for (var i = 0; i < list.length; i++) {
		var size = list[i] + "px";
		items.push({
			label: size,
			value: size,
			theme: editor.options.theme,
			renderLabelHtml: function () {
				return (
					'<div class="edui-label %%-label" style="line-height:1;font-size:' +
					this.value +
					'">' +
					(this.label || "") +
					"</div>"
				);
			}
		});
	}
	var ui = new UE_ui_Combox({
		editor: editor,
		items: items,
		title: title,
		initValue: title,
		onselect: function (t, index) {
			editor.execCommand("FontSize", this.items[index].value);
		},
		onbuttonclick: function () {
			this.showPopup();
		},
		className: "edui-for-fontsize"
	});
	UE.ui.buttons["fontsize"] = ui;
	editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
		if (!uiReady) {
			var state = editor.queryCommandState("FontSize");
			if (state == -1) {
				ui.setDisabled(true);
			} else {
				ui.setDisabled(false);
				ui.setValue(editor.queryCommandValue("FontSize"));
			}
		}
	});
	return ui;
};

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.paragraph = function (editor, list, title) {
	title =
		editor.options.labelMap["paragraph"] ||
		editor.getLang("labelMap.paragraph") ||
		"";
	list = editor.options["paragraph"] || [];
	if (utils.isEmptyObject(list)) return;
	var items = [];
	for (var i in list) {
		items.push({
			value: i,
			label: list[i] || editor.getLang("paragraph")[i],
			theme: editor.options.theme,
			renderLabelHtml: function () {
				return (
					'<div class="edui-label %%-label"><span class="edui-for-' +
					this.value +
					'">' +
					(this.label || "") +
					"</span></div>"
				);
			}
		});
	}
	var ui = new UE_ui_Combox({
		editor: editor,
		items: items,
		title: title,
		initValue: title,
		className: "edui-for-paragraph",
		onselect: function (t, index) {
			editor.execCommand("Paragraph", this.items[index].value);
		},
		onbuttonclick: function () {
			this.showPopup();
		}
	});
	UE.ui.buttons["paragraph"] = ui;
	editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
		if (!uiReady) {
			var state = editor.queryCommandState("Paragraph");
			if (state == -1) {
				ui.setDisabled(true);
			} else {
				ui.setDisabled(false);
				var value = editor.queryCommandValue("Paragraph");
				var index = ui.indexByValue(value);
				if (index != -1) {
					ui.setValue(value);
				} else {
					ui.setValue(ui.initValue);
				}
			}
		}
	});
	return ui;
};

/**
 * 自定义标题
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.customstyle = function (editor) {
	var list = editor.options["customstyle"] || [],
		title =
			editor.options.labelMap["customstyle"] ||
			editor.getLang("labelMap.customstyle") ||
			"";
	if (!list.length) return;
	var langCs = editor.getLang("customstyle");
	for (var i = 0, items = [], t; (t = list[i++]);) {
		(function (t) {
			var ck = {};
			ck.label = t.label ? t.label : langCs[t.name];
			ck.style = t.style;
			ck.className = t.className;
			ck.tag = t.tag;
			items.push({
				label: ck.label,
				value: ck,
				theme: editor.options.theme,
				renderLabelHtml: function () {
					return (
						'<div class="edui-label %%-label">' +
						"<" +
						ck.tag +
						" " +
						(ck.className ? ' class="' + ck.className + '"' : "") +
						(ck.style ? ' style="' + ck.style + '"' : "") +
						">" +
						ck.label +
						"</" +
						ck.tag +
						">" +
						"</div>"
					);
				}
			});
		})(t);
	}

	var ui = new UE_ui_Combox({
		editor: editor,
		items: items,
		title: title,
		initValue: title,
		className: "edui-for-customstyle",
		onselect: function (t, index) {
			editor.execCommand("customstyle", this.items[index].value);
		},
		onbuttonclick: function () {
			this.showPopup();
		},
		indexByValue: function (value) {
			for (var i = 0, ti; (ti = this.items[i++]);) {
				if (ti.label == value) {
					return i - 1;
				}
			}
			return -1;
		}
	});
	UE.ui.buttons["customstyle"] = ui;
	editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
		if (!uiReady) {
			var state = editor.queryCommandState("customstyle");
			if (state == -1) {
				ui.setDisabled(true);
			} else {
				ui.setDisabled(false);
				var value = editor.queryCommandValue("customstyle");
				var index = ui.indexByValue(value);
				if (index != -1) {
					ui.setValue(value);
				} else {
					ui.setValue(ui.initValue);
				}
			}
		}
	});
	return ui;
};

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.inserttable = function (editor, iframeUrl, title) {
	title =
		editor.options.labelMap["inserttable"] ||
		editor.getLang("labelMap.inserttable") ||
		"";
	var ui = new UE_ui_TableButton({
		editor: editor,
		title: title,
		className: "edui-for-inserttable",
		onpicktable: function (t, numCols, numRows) {
			editor.execCommand("InsertTable", {
				numRows: numRows,
				numCols: numCols,
				border: 1
			});
		},
		onbuttonclick: function () {
			this.showPopup();
		}
	});
	UE.ui.buttons["inserttable"] = ui;
	editor.addListener("selectionchange", function () {
		ui.setDisabled(editor.queryCommandState("inserttable") == -1);
	});
	return ui;
};

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.lineheight = function (editor) {
	var val = editor.options.lineheight || [];
	if (!val.length) return;
	for (var i = 0, ci, items = []; (ci = val[i++]);) {
		items.push({
			//todo:写死了
			label: ci,
			value: ci,
			theme: editor.options.theme,
			onclick: function () {
				editor.execCommand("lineheight", this.value);
			}
		});
	}
	var ui = new UE_ui_MenuButton({
		editor: editor,
		className: "edui-for-lineheight",
		title:
			editor.options.labelMap["lineheight"] ||
			editor.getLang("labelMap.lineheight") ||
			"",
		items: items,
		onbuttonclick: function () {
			var value = editor.queryCommandValue("LineHeight") || this.value;
			editor.execCommand("LineHeight", value);
		}
	});
	UE.ui.buttons["lineheight"] = ui;
	editor.addListener("selectionchange", function () {
		var state = editor.queryCommandState("LineHeight");
		if (state == -1) {
			ui.setDisabled(true);
		} else {
			ui.setDisabled(false);
			var value = editor.queryCommandValue("LineHeight");
			value && ui.setValue((value + "").replace(/cm/, ""));
			ui.setChecked(state);
		}
	});
	return ui;
};

var rowspacings = ["top", "bottom"];
for (var r = 0, ri; (ri = rowspacings[r++]);) {
	(function (cmd) {
		/**
		 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
		 */
		UE.ui["rowspacing" + cmd] = function (editor) {
			var val = editor.options["rowspacing" + cmd] || [];
			if (!val.length) return null;
			for (var i = 0, ci, items = []; (ci = val[i++]);) {
				items.push({
					label: ci,
					value: ci,
					theme: editor.options.theme,
					onclick: function () {
						editor.execCommand("rowspacing", this.value, cmd);
					}
				});
			}
			var ui = new UE_ui_MenuButton({
				editor: editor,
				className: "edui-for-rowspacing" + cmd,
				title:
					editor.options.labelMap["rowspacing" + cmd] ||
					editor.getLang("labelMap.rowspacing" + cmd) ||
					"",
				items: items,
				onbuttonclick: function () {
					var value =
						editor.queryCommandValue("rowspacing", cmd) || this.value;
					editor.execCommand("rowspacing", value, cmd);
				}
			});
			UE.ui.buttons[cmd] = ui;
			editor.addListener("selectionchange", function () {
				var state = editor.queryCommandState("rowspacing", cmd);
				if (state == -1) {
					ui.setDisabled(true);
				} else {
					ui.setDisabled(false);
					var value = editor.queryCommandValue("rowspacing", cmd);
					value && ui.setValue((value + "").replace(/%/, ""));
					ui.setChecked(state);
				}
			});
			return ui;
		};
	})(ri);
}

//有序，无序列表
var lists = ["insertorderedlist", "insertunorderedlist"];
for (var l = 0, cl; (cl = lists[l++]);) {
	(function (cmd) {
		/**
		 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
		 */
		UE.ui[cmd] = function (editor) {
			var vals = editor.options[cmd],
				_onMenuClick = function () {
					editor.execCommand(cmd, this.value);
				},
				items = [];
			for (var i in vals) {
				items.push({
					label: vals[i] || editor.getLang()[cmd][i] || "",
					value: i,
					theme: editor.options.theme,
					onclick: _onMenuClick
				});
			}
			var ui = new UE_ui_MenuButton({
				editor: editor,
				className: "edui-for-" + cmd,
				title: editor.getLang("labelMap." + cmd) || "",
				items: items,
				onbuttonclick: function () {
					var value = editor.queryCommandValue(cmd) || this.value;
					editor.execCommand(cmd, value);
				}
			});
			UE.ui.buttons[cmd] = ui;
			editor.addListener("selectionchange", function () {
				var state = editor.queryCommandState(cmd);
				if (state == -1) {
					ui.setDisabled(true);
				} else {
					ui.setDisabled(false);
					var value = editor.queryCommandValue(cmd);
					ui.setValue(value);
					ui.setChecked(state);
				}
			});
			return ui;
		};
	})(cl);
}

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui.fullscreen = function (editor, title) {
	title =
		editor.options.labelMap["fullscreen"] ||
		editor.getLang("labelMap.fullscreen") ||
		"";
	var ui = new cls_uiButton({
		className: "edui-for-fullscreen",
		title: title,
		theme: editor.options.theme,
		onclick: function () {
			if (editor.ui) {
				editor.ui.setFullScreen(!editor.ui.isFullScreen());
			}
			this.setChecked(editor.ui.isFullScreen());
		}
	});
	UE.ui.buttons["fullscreen"] = ui;
	editor.addListener("selectionchange", function () {
		var state = editor.queryCommandState("fullscreen");
		ui.setDisabled(state == -1);
		ui.setChecked(editor.ui.isFullScreen());
	});
	return ui;
};

/**
 * 表情
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui['emotion'] = function (editor, iframeUrl) {
	var cmd = "emotion";
	var ui = new UE_ui_MultiMenuPop({
		title:
			editor.options.labelMap[cmd] ||
			editor.getLang("labelMap." + cmd + "") ||
			"",
		editor: editor,
		className: "edui-for-" + cmd,
		iframeUrl: editor.ui.mapUrl(
			iframeUrl ||
			(editor.options.dialogIframeUrlMap || {})[cmd] ||
			dialogIframeUrlMap[cmd]
		)
	});
	UE.ui.buttons[cmd] = ui;

	editor.addListener("selectionchange", function () {
		ui.setDisabled(editor.queryCommandState(cmd) == -1);
	});
	return ui;
};

/**
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui['autotypeset'] = function (editor) {
	var ui = new UE_ui_AutoTypeSetButton({
		editor: editor,
		title:
			editor.options.labelMap["autotypeset"] ||
			editor.getLang("labelMap.autotypeset") ||
			"",
		className: "edui-for-autotypeset",
		onbuttonclick: function () {
			editor.execCommand("autotypeset");
		}
	});
	UE.ui.buttons["autotypeset"] = ui;
	editor.addListener("selectionchange", function () {
		ui.setDisabled(editor.queryCommandState("autotypeset") == -1);
	});
	return ui;
};

/**
 * 简单上传插件
 * @param {typeof import('../core/Editor.cls.js').default.prototype} editor
 */
UE.ui['simpleupload'] = function (editor) {
	var name = "simpleupload",
		ui = new cls_uiButton({
			className: "edui-for-" + name,
			title:
				editor.options.labelMap[name] ||
				editor.getLang("labelMap." + name) ||
				"",
			onclick: function () {
			},
			theme: editor.options.theme,
			showText: false
		});
	UE.ui.buttons[name] = ui;
	editor.addListener("ready", function () {
		var b = ui.getDom("body"),
			iconSpan = b.children[0];
		editor.fireEvent("simpleuploadbtnready", iconSpan);
	});
	editor.addListener("selectionchange", function (type, causeByUi, uiReady) {
		var state = editor.queryCommandState(name);
		if (state == -1) {
			ui.setDisabled(true);
			ui.setChecked(false);
		} else {
			if (!uiReady) {
				ui.setDisabled(false);
				ui.setChecked(state);
			}
		}
	});
	return ui;
};