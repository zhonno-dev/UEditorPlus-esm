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

/*
//zhu:以下方法已移到 _src/core/Editor.cls.js 本身
(function () {

    var ROOT_KEY = "UEditorPlusPref";

    cls_Editor.prototype.setPreferences = function (key, value) {
	// console.log('setPreferences', key, value);
	var obj = {};
	if (utils.isString(key)) {
	    obj[key] = value;
	} else {
	    obj = key;
	}
	var data = LocalStorage.getLocalData(ROOT_KEY);
	if (data && (data = utils.str2json(data))) {
	    utils.extend(data, obj);
	} else {
	    data = obj;
	}
	data && LocalStorage.saveLocalData(ROOT_KEY, utils.json2str(data));
    };

    cls_Editor.prototype.getPreferences = function (key) {
	// console.log('getPreferences', key);
	var data = LocalStorage.getLocalData(ROOT_KEY);
	if (data && (data = utils.str2json(data))) {
	    return key ? data[key] : data;
	}
	return null;
    };

    cls_Editor.prototype.removePreferences = function (key) {
	// console.log('removePreferences', key);
	var data = LocalStorage.getLocalData(ROOT_KEY);
	if (data && (data = utils.str2json(data))) {
	    data[key] = undefined;
	    delete data[key];
	}
	data && LocalStorage.saveLocalData(ROOT_KEY, utils.json2str(data));
    };
})();
*/