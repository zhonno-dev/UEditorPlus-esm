/**
 * 为避免 UE.js 交叉循环import的问题，把各处需要用到的共享变量单独放在 __UE.js 里面。\
 * 最后再由 UE.js 进行总集成。
 */
const __UE = {
	//原本在 editor/_src/adapter/editor.js 中的 var instances = {};
	//	移入 UE 入口实现共享。
	/** 存放cls_Editor编辑器实例 */
	instances: {},
};

export default __UE;