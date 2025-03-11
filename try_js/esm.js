//在 esm.js 里面尝试读写全局变量
//	结果：OK；是可以读写全局变量的，其中esm.js是在 import().js 中被导入的，test.html引用的是import().js而不是esm.js本身。
//	也就是说不管在多深的层级中，不管用哪种方式导入js文件，全局变量都是通用的。
window.test_global.esmJs = 'esm.js';

export default function () {
	console.log(import.meta.url);
}