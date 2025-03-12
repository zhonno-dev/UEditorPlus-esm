/** 编辑器入口对象 */
const UE = {
	version: "4.3.0", //zhu:TODO 版本号待定
	/** 编辑器配置 */
	UEDITOR_CONFIG: {

	},
	plugins: {},
	commands: {},
	instants: {},
	I18N: {},
	_customizeUI: {},
	plus: {
		fileExt: function (filename) {
			if (!filename) {
				return '';
			}
			var pcs = filename.split('.');
			if (pcs.length > 1) {
				return pcs.pop().toLowerCase();
			}
			return '';
		}
	},
	constants: {
		STATEFUL: {
			DISABLED: -1,
			OFF: 0,
			ON: 1,
		},
	},
	dom: {
		/**
		 * dtd html语义化的体现类，引用自 "./core/dtd.js" 模块
		 * @type {import('./core/dtd.js').default}
		*/
		dtd: null,
		/**
		 * Dom操作工具包
		 * @import {domUtils} from './core/domUtils.js'
		 * @type {domUtils}
		 */
		domUtils: null,
	},

	ui: {

	},

	//原本在 editor/_src/adapter/editor.js 中的 var instances = {};
	//	移入 UE 入口实现共享。
	instances: {},
};

export default UE;