var myApp = {
	name: 'myApp',
	desc: '全局功能模块',
	plugins: {
		demo: () => {
			console.log('功能插件示例');
		},
	},
};
window.myApp = myApp;
console.log('global.js');
console.log(myApp);

/* 
  global.js  global_plugins.js 这两个文件用JS的iife模式（即默认模式）加载时， global_plugins.js 中的插件函数可以借助全局变量myApp追加，并保持追加后的状态。
如果把这两文件都改成 esm 模式（但依然需要拆分为两个js文件），如何保持iife模式时的效果呢？​并且我希望改为esm模式后，也是先import global.js 后再import global_plugins.js 并让 global_plugins.js 中的插件扩展函数可以追加入 global.js 中并持续保持。
 */

