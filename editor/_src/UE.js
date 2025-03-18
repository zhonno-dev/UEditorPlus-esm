import __UE from './__UE.js';
import utils from './core/utils.js';
import new_clsEditor from './adapter/new_clsEditor.func.js';

/** 编辑器统一入口对象 */
const UE = {
	version: "4.3.0", //zhu:TODO 版本号待定
	/** 
	 * 编辑器配置 
	 * @type {typeof import('../ueditor.config.js').default}
	 */
	UEDITOR_CONFIG: {},
	plugins: {},
	commands: {},
	instants: {},
	I18N: {},
	_customizeUI: {},

	/**
	 * @type {typeof import("./core/plugin.js").default}
	 */
	plugin: null,
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
		 * @type {typeof import('./core/dtd.js').default}
		*/
		dtd: null,
		/**
		 * Dom操作工具包
		 * @type {typeof import('./core/domUtils.js').domUtils}
		 */
		domUtils: null,
	},

	/** 
	 * UE.ui
	 */
	ui: {
		/** UE.ui.buttons = {} */
		buttons: {},
		/** 清除文档 */
		cleardoc: null,
	},

	//原本在 editor/_src/adapter/editor.js 中的 var instances = {};
	//	移入 UE 入口实现共享。
	instances: __UE.instances,
	
	/**
	 * @name getEditor
	 * @since 1.2.4+
	 * @grammar UE.getEditor(id,[opt])  =>  Editor实例
	 * @desc 提供一个全局的方法得到编辑器实例
	 *
	 * * ''id''  放置编辑器的容器id, 如果容器下的编辑器已经存在，就直接返回
	 * * ''opt'' 编辑器的可选参数
	 * @example
	 *  UE.getEditor('containerId',{onready:function(){//创建一个编辑器实例
	 *      this.setContent('hello')
	 *  }});
	 *  UE.getEditor('containerId'); //返回刚创建的实例
	 *
	 */
	getEditor(id, opt) {
		/**
		 * @import cls_Editor from './core/Editor.cls.js'; 
		 * @type cls_Editor
		 */
		var editor = __UE.instances[id];
		
		if (!editor) {
			//     editor = instances[id] = new UE.ui.Editor(opt);
			editor = __UE.instances[id] = new_clsEditor(opt);
			// console.log(editor.constructor.name);
			editor.render(id);
		}
		return editor;
	},

	delEditor(id) {
		/**
		 * @type {typeof import('./core/Editor.cls.js').default}
		 */
		var editor;
		if ((editor = __UE.instances[id])) {
			editor.key && editor.destroy();
			delete __UE.instances[id];
		}
	},

	registerUI(uiName, fn, index, editorId) {
		var me = this;
		// console.log(me);
		utils.each(uiName.split(/\s+/), function (name) {
			// console.log(this);
			me.ui[name] = {
				id: editorId,
				execFn: fn,
				index: index
			};
		});
	},
};


export default UE;