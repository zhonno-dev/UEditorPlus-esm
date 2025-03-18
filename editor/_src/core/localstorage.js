// import cls_Editor from "./Editor.cls.js";

var storage = window.localStorage;

const LocalStorage = {
	saveLocalData: function (key, data) {
		// console.log('saveLocalData', key, data);
		if (!storage) {
			return false;
		}
		storage.setItem(key, data);
		return true;
	},
	getLocalData: function (key) {
		// console.log('getLocalData', key);
		if (!storage) {
			return null;
		}
		return storage.getItem(key) || null;
	},
	removeItem: function (key) {
		// console.log('removeItem', key);
		storage && storage.removeItem(key);
	}
};

export default LocalStorage;

//zhu:以下方法已移到 _src/core/Editor.cls.js 本身，包括：
//	cls_Editor.setPreferences()
//	cls_Editor.getPreferences()
//	cls_Editor.removePreferences()