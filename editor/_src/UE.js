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

	},

	ui: {

	},

}

export default UE;