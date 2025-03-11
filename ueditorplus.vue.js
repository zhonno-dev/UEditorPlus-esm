/*
UEditorPlus 编辑器（最基本的）
*/

// let __DIR__ = import.meta.resolve('./'); //当前路径的URL（以“/”结尾）
// let __BNAME__ = import.meta.url.match(/\/([^\/]+)\.js$/g)[0].slice(1, -3); //自身的文件名（不包含后缀）
//组件模板（字符串）：AJAX获取同级目录下的 同名.html 文件内容
// let __TPL__ = $g.http_get_html_await(`${__DIR__}${__BNAME__}.html`);
// let __TPL__ = await (await fetch(`${__DIR__}${__BNAME__}.html`)).text();
// console.log(__DIR__);

export default {
	template: `
<component is="script" id="ueditor1" type="text/plain" style="height:300px;" />
	`, //模板（字符串）
	props: { //定义参数
		/** 定义参数示例 */
		// demo: { type: String, default: '' },
	},
	// emits: [ //定义事件
	// 	'theme_input', //事件:xxx 回调参数:()
	// ],
	// components: { //定义会用到的组件
		// vue_comp: Vue.defineAsyncComponent(() => import('./comp.js')),
	// },
	setup($props, { attrs:$attrs, slots:$slots, emit:$emit, expose }){ //组合式代码
		const sr = {}; //返回值(sr=setup return)
		// const $refs = {}; //存放模板引用：$refs.xxx = Vue.useTemplateRef('{dom-ref-Name}');
		
		//先加载URL
		let root_url = '/UEditorPlus/';
		// let url_pre = `${root_url}lib.public/front/ueditorplus/ueditorplus/`;
		let url_pre = `${root_url}ueditorplus/`;
		window.UEDITOR_HOME_URL = url_pre;
		window.UEDITOR_CORS_URL = url_pre;
		let urls = [
			`${url_pre}ueditor.config.js`,
			`${url_pre}_src/editor.js`,
			`${url_pre}_src/core/browser.js`,
			`${url_pre}_src/core/utils.js`,
			`${url_pre}_src/core/EventBase.js`,
			`${url_pre}_src/core/dtd.js`,
			`${url_pre}_src/core/domUtils.js`,
			`${url_pre}_src/core/Range.js`,
			`${url_pre}_src/core/Selection.js`,
			`${url_pre}_src/core/Editor.js`,
			`${url_pre}_src/core/Editor.defaultoptions.js`,
			`${url_pre}_src/core/loadconfig.js`,
			`${url_pre}_src/core/ajax.js`,
			`${url_pre}_src/core/api.js`,
			`${url_pre}_src/core/image.js`,
			`${url_pre}_src/core/dialog.js`,
			`${url_pre}_src/core/filterword.js`,
			`${url_pre}_src/core/node.js`,
			`${url_pre}_src/core/htmlparser.js`,
			`${url_pre}_src/core/filternode.js`,
			`${url_pre}_src/core/plugin.js`,
			`${url_pre}_src/core/keymap.js`,
			`${url_pre}_src/core/localstorage.js`,
			`${url_pre}_src/plugins/defaultfilter.js`,
			`${url_pre}_src/plugins/inserthtml.js`,
			`${url_pre}_src/plugins/autotypeset.js`,
			`${url_pre}_src/plugins/autosubmit.js`,
			`${url_pre}_src/plugins/background.js`,
			`${url_pre}_src/plugins/image.js`,
			`${url_pre}_src/plugins/justify.js`,
			`${url_pre}_src/plugins/font.js`,
			`${url_pre}_src/plugins/link.js`,
			`${url_pre}_src/plugins/iframe.js`,
			`${url_pre}_src/plugins/scrawl.js`,
			`${url_pre}_src/plugins/removeformat.js`,
			`${url_pre}_src/plugins/blockquote.js`,
			`${url_pre}_src/plugins/convertcase.js`,
			`${url_pre}_src/plugins/indent.js`,
			`${url_pre}_src/plugins/print.js`,
			`${url_pre}_src/plugins/preview.js`,
			`${url_pre}_src/plugins/selectall.js`,
			`${url_pre}_src/plugins/paragraph.js`,
			`${url_pre}_src/plugins/directionality.js`,
			`${url_pre}_src/plugins/horizontal.js`,
			`${url_pre}_src/plugins/time.js`,
			`${url_pre}_src/plugins/rowspacing.js`,
			`${url_pre}_src/plugins/lineheight.js`,
			`${url_pre}_src/plugins/insertcode.js`,
			`${url_pre}_src/plugins/cleardoc.js`,
			`${url_pre}_src/plugins/anchor.js`,
			`${url_pre}_src/plugins/wordcount.js`,
			`${url_pre}_src/plugins/pagebreak.js`,
			`${url_pre}_src/plugins/wordimage.js`,
			`${url_pre}_src/plugins/autosave.js`,
			`${url_pre}_src/plugins/formula.js`,
			`${url_pre}_src/plugins/dragdrop.js`,
			`${url_pre}_src/plugins/undo.js`,
			`${url_pre}_src/plugins/copy.js`,
			`${url_pre}_src/plugins/paste.js`,
			`${url_pre}_src/plugins/puretxtpaste.js`,
			`${url_pre}_src/plugins/list.js`,
			`${url_pre}_src/plugins/source.js`,
			`${url_pre}_src/plugins/enterkey.js`,
			`${url_pre}_src/plugins/keystrokes.js`,
			`${url_pre}_src/plugins/fiximgclick.js`,
			`${url_pre}_src/plugins/autolink.js`,
			`${url_pre}_src/plugins/autoheight.js`,
			`${url_pre}_src/plugins/autofloat.js`,
			`${url_pre}_src/plugins/video.js`,
			`${url_pre}_src/plugins/audio.js`,
			`${url_pre}_src/plugins/table.core.js`,
			`${url_pre}_src/plugins/table.cmds.js`,
			`${url_pre}_src/plugins/table.action.js`,
			`${url_pre}_src/plugins/table.sort.js`,
			`${url_pre}_src/plugins/contextmenu.js`,
			`${url_pre}_src/plugins/shortcutmenu.js`,
			`${url_pre}_src/plugins/basestyle.js`,
			`${url_pre}_src/plugins/elementpath.js`,
			`${url_pre}_src/plugins/formatmatch.js`,
			`${url_pre}_src/plugins/searchreplace.js`,
			`${url_pre}_src/plugins/customstyle.js`,
			`${url_pre}_src/plugins/catchremoteimage.js`,
			`${url_pre}_src/plugins/insertparagraph.js`,
			`${url_pre}_src/plugins/template.js`,
			`${url_pre}_src/plugins/autoupload.js`,
			`${url_pre}_src/plugins/section.js`,
			`${url_pre}_src/plugins/simpleupload.js`,
			`${url_pre}_src/plugins/serverparam.js`,
			`${url_pre}_src/plugins/insertfile.js`,
			`${url_pre}_src/plugins/markdown-shortcut.js`,
			`${url_pre}_src/plugins/quick-operate.js`,

			`${url_pre}_src/ui/ui.js`,
			`${url_pre}_src/ui/uiutils.js`,
			`${url_pre}_src/ui/uibase.js`,
			`${url_pre}_src/ui/separator.js`,
			`${url_pre}_src/ui/mask.js`,
			`${url_pre}_src/ui/popup.js`,
			`${url_pre}_src/ui/colorpicker.js`,
			`${url_pre}_src/ui/tablepicker.js`,
			`${url_pre}_src/ui/stateful.js`,
			`${url_pre}_src/ui/button.js`,
			`${url_pre}_src/ui/splitbutton.js`,
			`${url_pre}_src/ui/colorbutton.js`,
			`${url_pre}_src/ui/tablebutton.js`,
			`${url_pre}_src/ui/autotypesetpicker.js`,
			`${url_pre}_src/ui/autotypesetbutton.js`,
			`${url_pre}_src/ui/cellalignpicker.js`,
			`${url_pre}_src/ui/pastepicker.js`,
			`${url_pre}_src/ui/toolbar.js`,
			`${url_pre}_src/ui/quick-operate.js`,
			`${url_pre}_src/ui/menu.js`,
			`${url_pre}_src/ui/combox.js`,
			`${url_pre}_src/ui/dialog.js`,
			`${url_pre}_src/ui/menubutton.js`,
			`${url_pre}_src/ui/multiMenu.js`,
			`${url_pre}_src/ui/shortcutmenu.js`,
			`${url_pre}_src/ui/breakline.js`,
			`${url_pre}_src/ui/message.js`,

			`${url_pre}_src/adapter/editorui.js`,
			`${url_pre}_src/adapter/editor.js`,
			`${url_pre}_src/adapter/message.js`,

			`${url_pre}lang/zh-cn/zh-cn.js`,
		];
		$g.load_file(urls, () => {
			sr.editor_init();
		});

		let cls_editor = null;

		/** 初始化编辑器 */
		sr.editor_init = () => {
			console.log('editor_init RUN!');
			cls_editor = UE.getEditor('ueditor1', {
				"textarea": "info[html]",
				// "toolbars": null,
				"serverUrl": `${root_url}lib.public/front/ueditor/ueditor_php/controller.php?run=eUeditor&sign={$_sign}&demo_id={$demo_id}`,
				// "baseurl": "",
				"autoHeightEnabled": false,
				"enableAutoSave": false,
				"saveInterval": 9999999
			});
		};
		
		
		// 返回值会暴露给模板和其他的选项式 API 钩子
		return sr;
	},
	data() {
		return {
			FILE: import.meta.url,
		}
	},
}