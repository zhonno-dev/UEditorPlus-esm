//尝试着用Vue来包装WebComp

import * as Vue from '../../third-party/vue3.esm.js';
import vue_comp from './comp.js';

// const MyVueElement = Vue.defineCustomElement({
// 	// 这里是同平常一样的 Vue 组件选项
// 	props: {},
// 	emits: {},
// 	template: `...`,

// 	// defineCustomElement 特有的：注入进 shadow root 的 CSS
// 	styles: [`/* inlined css */`]
// });

const MyVueElement = Vue.defineCustomElement(vue_comp);


// 注册自定义元素
// 注册之后，所有此页面中的 `<my-vue-element>` 标签
// 都会被升级
customElements.define('my-vue-element', MyVueElement);

// 你也可以编程式地实例化元素：
// （必须在注册之后）
// document.body.appendChild(
// 	new MyVueElement({
// 		// 初始化 props（可选）
// 	})
// );