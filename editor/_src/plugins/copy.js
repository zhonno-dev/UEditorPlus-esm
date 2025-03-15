import UE from "../UE.js";
import browser from "../core/browser.js";
import utils from "../core/utils.js";

UE.plugin.register("copy", function () {
	var me = this;

	function initZeroClipboard() {
		console.log('initZeroClipboard()');
		ZeroClipboard.config({
			debug: false,
			swfPath:
				me.options.UEDITOR_HOME_URL +
				"../third-party/zeroclipboard/ZeroClipboard.swf"
		});

		var client = (me.zeroclipboard = new ZeroClipboard());

		// 复制内容
		client.on("copy", function (e) {
			console.log(111);
			var client = e.client,
				rng = me.selection.getRange(),
				div = document.createElement("div");

			div.appendChild(rng.cloneContents());
			client.setText(div.innerText || div.textContent);
			client.setHtml(div.innerHTML);
			rng.select();
		});
		// hover事件传递到target
		client.on("mouseover mouseout", function (e) {
			console.log(111);
			var target = e.target;
			if (target) {
				if (e.type == "mouseover") {
					domUtils.addClass(target, "edui-state-hover");
				} else if (e.type == "mouseout") {
					domUtils.removeClasses(target, "edui-state-hover");
				}
			}
		});
		// flash加载不成功
		client.on("wrongflash noflash", function () {
			console.log('flash加载不成功');
			ZeroClipboard.destroy();
		});

		// 触发事件
		me.fireEvent("zeroclipboardready", client);
	}

	return {
		bindEvents: {
			ready: function () {
				if (!browser.ie) {
					if (window.ZeroClipboard) {
						initZeroClipboard();
					} else {
						utils.loadFile(
							document,
							{
								src:
									me.options.UEDITOR_HOME_URL +
									"../third-party/zeroclipboard/ZeroClipboard.js",
								tag: "script",
								type: "text/javascript",
								defer: "defer"
							},
							function () {
								initZeroClipboard();
							}
						);
					}
				}
			}
		},
		commands: {
			copy: {
				execCommand: function (cmd) {
					if (!me.document.execCommand("copy")) {
						alert(me.getLang("copymsg"));
					}
				}
			}
		}
	};
});
