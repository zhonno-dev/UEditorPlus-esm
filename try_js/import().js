//在 iife[js] 里可以用 import().then 方式导入，但无法用 await import()
import('./esm.js')
	.then(module => {
		// 调用导入模块的默认导出函数
		module.default();
		console.log('import() OK');
	})
	.catch(error => {
		// 处理导入错误
		console.error('导入模块时出错:', error);
		
	});