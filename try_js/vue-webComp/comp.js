/*
v20250123174713
*/

let __DIR__ = import.meta.resolve('./'); //当前路径的URL（以“/”结尾）
let __BNAME__ = import.meta.url.match(/\/([^\/]+)\.js$/g)[0].slice(1, -3); //自身的文件名（不包含后缀）
//组件模板（字符串）：AJAX获取同级目录下的 同名.html 文件内容
// let __TPL__ = $g.http_get_html_await(`${__DIR__}${__BNAME__}.html`);
let __TPL__ = await (await fetch(`${__DIR__}${__BNAME__}.html`)).text();
// console.log(__DIR__);

import * as Vue from '../../third-party/vue3.esm.js';


export default {
	template: __TPL__, //模板（字符串）
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
		const $refs = {}; //存放模板引用：$refs.xxx = Vue.useTemplateRef('{dom-ref-Name}');
		
		/**  */
		sr.ifVal = Vue.ref(true);

		$refs.btnRef = Vue.useTemplateRef(`btnRef`);

		Vue.onMounted(() => {
			console.log($refs.btnRef.value.innerHTML);
		});

		/**  */
		sr.btnAlert = () => {
			alert(1);
		};

		/**  */
		sr.call_btnRef_click = () => {
			$refs.btnRef.value.click();
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