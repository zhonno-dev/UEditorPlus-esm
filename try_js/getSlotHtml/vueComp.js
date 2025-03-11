/*
功能说明
*/
//#region 固定代码禁止修改{
let __DIR__ = import.meta.resolve('./'); //当前路径的URL（以“/”结尾）
let __BNAME__ = import.meta.url.match(/\/([^\.\/]+)\.js/g)[0].slice(1, -3); //自身的文件名（不包含后缀）
//组件模板（字符串）：AJAX获取同级目录下的 同名.html 文件内容
let __TPL__ = await (await fetch(`${__DIR__}${__BNAME__}.html`)).text();
// console.log(__DIR__);
//#region 固定代码禁止修改}

export default {
	template: __TPL__, //模板（字符串）
	props: { //定义参数
		/** 参数说明 */
		prop_name: { default: 0 },
	},
	emits: [ //定义事件
		'theme_input' //事件:xxx  回调参数说明()
	],
	components: { //定义会用到的组件
		//代码规范：使用 Vue.defineAsyncComponent() 引用其它Vue3组件
		// 示例：vue_comp: Vue.defineAsyncComponent(() => import('./comp.js')),
	},
	setup($props, { attrs: $attrs, slots: $slots, emit: $emit, expose }) { //组合式代码
		const sr = {}; //返回值(sr=setup return)
		const $refs = {}; //存放模板引用：$refs.xxx = Vue.useTemplateRef('domRef');


		// 声明 模板引用 示例
		$refs.slotContent = Vue.useTemplateRef('slotContent');

		// 使用 模板引用 示例
		Vue.onMounted(() => {
			// 获取插槽内容的HTML字符串
			const slotHtml = $refs.slotContent.value.innerHTML;
			console.log('直接用模板引用(ref)的innerHTML来获取：');
			console.log(slotHtml);
		});

		//使用 $slots+渲染函数 来获取：
		Vue.onMounted(() => {
			// 获取插槽内容的VNode
			const slotVNodes = $slots.default ? $slots.default() : [];
			console.log(slotVNodes);

			// 创建一个临时的DOM元素
			const tempContainer = document.createElement('div');

			// 将VNode渲染到临时DOM元素中
			//	以下这句会多加一个<div>
			// Vue.render(Vue.h('div', slotVNodes), tempContainer);
			// console.log(Vue.h('div', slotVNodes));

			// 将VNode渲染到临时DOM元素中
			//	以下这句不会多加<div>
			// Vue.render(Vue.h({ render: () => slotVNodes }), tempContainer);

			// 将VNode渲染到临时DOM元素中
			//	以下这句直接把 $slots.default 这个渲染函数传入，不会多加<div>
			Vue.render(Vue.h({ render: $slots.default }), tempContainer);
			// console.log(Vue.h({ render: $slots.default }));

			// 获取渲染后的HTML字符串
			const slotHtml = tempContainer.innerHTML;
			console.log('使用 $slots+渲染函数 来获取：');
			console.log(slotHtml);

			// 清理临时DOM元素
			Vue.render(null, tempContainer);
		});


		// 返回值会暴露给模板和其他的选项式 API 钩子
		return sr;
	},
	data() {
		return {
			FILE: import.meta.url,
		};
	},
};