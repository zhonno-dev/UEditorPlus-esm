import htmlparser from "./htmlparser.func.js";
import utils from "./utils.js";
import dtd from "./dtd.js";


// 不需要转换的属性，直接使用原始值
var notTransAttrs = {
	href: 1,
	src: 1,
	_src: 1,
	_href: 1,
	cdata_data: 1
};

// 不需要转换的标签，直接使用原始值
var notTransTagName = {
	style: 1,
	script: 1
};

var indentChar = "    ";
var breakChar = "\n";

function insertLine(arr, current, begin) {
	arr.push(breakChar);
	return current + (begin ? 1 : -1);
}

function insertIndent(arr, current) {
	//插入缩进
	for (var i = 0; i < current; i++) {
		arr.push(indentChar);
	}
}

function nodeToHtml(node, arr, formatter, current) {
	switch (node.type) {
		case "root":
			for (var i = 0, ci; (ci = node.children[i++]);) {
				//插入新行
				if (
					formatter &&
					ci.type == "element" &&
					!dtd.$inlineWithA[ci.tagName] &&
					i > 1
				) {
					insertLine(arr, current, true);
					insertIndent(arr, current);
				}
				nodeToHtml(ci, arr, formatter, current);
			}
			break;
		case "text":
			isText(node, arr);
			break;
		case "element":
			isElement(node, arr, formatter, current);
			break;
		case "comment":
			isComment(node, arr, formatter);
	}
	return arr;
}



function isText(node, arr) {
	if (node.parentNode.tagName == "pre") {
		//源码模式下输入html标签，不能做转换处理，直接输出
		arr.push(node.data);
	} else {
		arr.push(
			notTransTagName[node.parentNode.tagName]
				? utils.html(node.data)
				: node.data.replace(/[ ]{2}/g, " &nbsp;")
		);
	}
}

function isElement(node, arr, formatter, current) {
	var attrhtml = "";
	if (node.attrs) {
		attrhtml = [];
		var attrs = node.attrs;
		for (var a in attrs) {
			//这里就针对
			//<p>'<img src='http://nsclick.baidu.com/u.gif?&asdf=\"sdf&asdfasdfs;asdf'></p>
			//这里边的\"做转换，要不用innerHTML直接被截断了，属性src
			//有可能做的不够
			attrhtml.push(
				a +
				(attrs[a] !== undefined
					? '="' +
					(notTransAttrs[a]
						? utils.html(attrs[a]).replace(/["]/g, function (a) {
							return "&quot;";
						})
						: utils.unhtml(attrs[a])) +
					'"'
					: "")
			);
		}
		attrhtml = attrhtml.join(" ");
	}
	arr.push(
		"<" +
		node.tagName +
		(attrhtml ? " " + attrhtml : "") +
		(dtd.$empty[node.tagName] ? "/" : "") +
		">"
	);
	//插入新行
	if (formatter && !dtd.$inlineWithA[node.tagName] && node.tagName != "pre") {
		if (node.children && node.children.length) {
			current = insertLine(arr, current, true);
			insertIndent(arr, current);
		}
	}
	if (node.children && node.children.length) {
		for (var i = 0, ci; (ci = node.children[i++]);) {
			if (
				formatter &&
				ci.type == "element" &&
				!dtd.$inlineWithA[ci.tagName] &&
				i > 1
			) {
				insertLine(arr, current);
				insertIndent(arr, current);
			}
			nodeToHtml(ci, arr, formatter, current);
		}
	}
	if (!dtd.$empty[node.tagName]) {
		if (
			formatter &&
			!dtd.$inlineWithA[node.tagName] &&
			node.tagName != "pre"
		) {
			if (node.children && node.children.length) {
				current = insertLine(arr, current);
				insertIndent(arr, current);
			}
		}
		arr.push("</" + node.tagName + ">");
	}
}

function isComment(node, arr) {
	arr.push("<!--" + node.data + "-->");
}

function getNodeById(root, id) {
	var node;
	if (root.type == "element" && root.getAttr("id") == id) {
		return root;
	}
	if (root.children && root.children.length) {
		for (var i = 0, ci; (ci = root.children[i++]);) {
			if ((node = getNodeById(ci, id))) {
				return node;
			}
		}
	}
}

function getNodesByTagName(node, tagName, arr) {
	if (node.type == "element" && node.tagName == tagName) {
		arr.push(node);
	}
	if (node.children && node.children.length) {
		for (var i = 0, ci; (ci = node.children[i++]);) {
			getNodesByTagName(ci, tagName, arr);
		}
	}
}

function nodeTraversal(root, fn) {
	if (root.children && root.children.length) {
		for (var i = 0, ci; (ci = root.children[i]);) {
			nodeTraversal(ci, fn);
			//ci被替换的情况，这里就不再走 fn了
			if (ci.parentNode) {
				if (ci.children && ci.children.length) {
					fn(ci);
				}
				if (ci.parentNode) i++;
			}
		}
	} else {
		fn(root);
	}
}


/**
 * 编辑器模拟的节点类
 * @since 1.2.6.1
 */
class cls_uNode {
	/**
	 * 构造函数\
	 * 通过一个键值对，创建一个uNode对象
	 * @constructor
	 * @param { Object } attr 传入要创建的uNode的初始属性
	 * @example
	 * ```javascript
	 * var node = new uNode({
	 *     type:'element',
	 *     tagName:'span',
	 *     attrs:{style:'font-size:14px;'}
	 * })
	 * ```
	 */
	constructor(obj) {
		// super(); // 调用父类的构造函数

		this.type = obj.type;
		this.data = obj.data;
		this.tagName = obj.tagName;
		this.parentNode = obj.parentNode;
		this.attrs = obj.attrs || {};
		this.children = obj.children;
	}

	/**
	 * 当前节点对象，转换成html文本
	 * @method toHtml
	 * @return { String } 返回转换后的html字符串
	 * @example
	 * ```javascript
	 * node.toHtml();
	 * ```
	 */

	/**
	 * 当前节点对象，转换成html文本
	 * @method toHtml
	 * @param { Boolean } formatter 是否格式化返回值
	 * @return { String } 返回转换后的html字符串
	 * @example
	 * ```javascript
	 * node.toHtml( true );
	 * ```
	 */
	toHtml(formatter) {
		var arr = [];
		nodeToHtml(this, arr, formatter, 0);
		return arr.join("");
	}

	/**
	 * 获取节点的html内容
	 * @method innerHTML
	 * @warning 假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点
	 * @return { String } 返回节点的html内容
	 * @example
	 * ```javascript
	 * var htmlstr = node.innerHTML();
	 * ```
	 */

	/**
	 * 设置节点的html内容
	 * @method innerHTML
	 * @warning 假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点
	 * @param { String } htmlstr 传入要设置的html内容
	 * @return {cls_uNode} 返回节点本身
	 * @example
	 * ```javascript
	 * node.innerHTML('<span>text</span>');
	 * ```
	 */
	innerHTML(htmlstr) {
		if (this.type != "element" || dtd.$empty[this.tagName]) {
			return this;
		}
		if (utils.isString(htmlstr)) {
			if (this.children) {
				for (var i = 0, ci; (ci = this.children[i++]);) {
					ci.parentNode = null;
				}
			}
			this.children = [];
			var tmpRoot = htmlparser(htmlstr, false, cls_uNode, nodeUtils);
			for (var i = 0, ci; (ci = tmpRoot.children[i++]);) {
				this.children.push(ci);
				ci.parentNode = this;
			}
			return this;
		} else {
			var tmpRoot = new cls_uNode({
				type: "root",
				children: this.children
			});
			return tmpRoot.toHtml();
		}
	}

	/**
	 * 获取节点的纯文本内容
	 * @method innerText
	 * @warning 假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点
	 * @return { String } 返回节点的存文本内容
	 * @example
	 * ```javascript
	 * var textStr = node.innerText();
	 * ```
	 */

	/**
	 * 设置节点的纯文本内容
	 * @method innerText
	 * @warning 假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点
	 * @param { String } textStr 传入要设置的文本内容
	 * @return {cls_uNode} 返回节点本身
	 * @example
	 * ```javascript
	 * node.innerText('<span>text</span>');
	 * ```
	 */
	innerText(textStr, noTrans) {
		if (this.type != "element" || dtd.$empty[this.tagName]) {
			return this;
		}
		if (textStr) {
			if (this.children) {
				for (var i = 0, ci; (ci = this.children[i++]);) {
					ci.parentNode = null;
				}
			}
			this.children = [];
			//zhu:这里改为自己实现 uNode.createText() 的功能，这样就不需要 import 新的 nodeUtils.createText
			// this.appendChild(uNode.createText(textStr, noTrans));
			let newNode = new cls_uNode({
				type: "text",
				data: noTrans ? textStr : utils.unhtml(textStr || "")
			});
			this.appendChild(newNode);
			return this;
		} else {
			return this.toHtml().replace(/<[^>]+>/g, "");
		}
	}

	/**
	 * 获取当前对象的data属性
	 * @method getData
	 * @return { Object } 若节点的type值是elemenet，返回空字符串，否则返回节点的data属性
	 * @example
	 * ```javascript
	 * node.getData();
	 * ```
	 */
	getData() {
		if (this.type == "element") return "";
		return this.data;
	}

	/**
	 * 获取当前节点下的第一个子节点
	 * @method firstChild
	 * @return {cls_uNode} 返回第一个子节点
	 * @example
	 * ```javascript
	 * node.firstChild(); //返回第一个子节点
	 * ```
	 */
	firstChild() {
		//            if (this.type != 'element' || dtd.$empty[this.tagName]) {
		//                return this;
		//            }
		return this.children ? this.children[0] : null;
	}

	/**
	 * 获取当前节点下的最后一个子节点
	 * @method lastChild
	 * @return {cls_uNode} 返回最后一个子节点
	 * @example
	 * ```javascript
	 * node.lastChild(); //返回最后一个子节点
	 * ```
	 */
	lastChild() {
		//            if (this.type != 'element' || dtd.$empty[this.tagName] ) {
		//                return this;
		//            }
		return this.children ? this.children[this.children.length - 1] : null;
	}

	/**
	 * 获取和当前节点有相同父亲节点的前一个节点
	 * @method previousSibling
	 * @return {cls_uNode} 返回前一个节点
	 * @example
	 * ```javascript
	 * node.children[2].previousSibling(); //返回子节点node.children[1]
	 * ```
	 */
	previousSibling() {
		var parent = this.parentNode;
		for (var i = 0, ci; (ci = parent.children[i]); i++) {
			if (ci === this) {
				return i == 0 ? null : parent.children[i - 1];
			}
		}
	}

	/**
	 * 获取和当前节点有相同父亲节点的后一个节点
	 * @method nextSibling
	 * @return {cls_uNode} 返回后一个节点,找不到返回null
	 * @example
	 * ```javascript
	 * node.children[2].nextSibling(); //如果有，返回子节点node.children[3]
	 * ```
	 */
	nextSibling() {
		var parent = this.parentNode;
		for (var i = 0, ci; (ci = parent.children[i++]);) {
			if (ci === this) {
				return parent.children[i];
			}
		}
	}

	/**
	 * 用新的节点替换当前节点
	 * @method replaceChild
	 * @param {cls_uNode} target 要替换成该节点参数
	 * @param {cls_uNode} source 要被替换掉的节点
	 * @return {cls_uNode} 返回替换之后的节点对象
	 * @example
	 * ```javascript
	 * node.replaceChild(newNode, childNode); //用newNode替换childNode,childNode是node的子节点
	 * ```
	 */
	replaceChild(target, source) {
		if (this.children) {
			if (target.parentNode) {
				target.parentNode.removeChild(target);
			}
			for (var i = 0, ci; (ci = this.children[i]); i++) {
				if (ci === source) {
					this.children.splice(i, 1, target);
					source.parentNode = null;
					target.parentNode = this;
					return target;
				}
			}
		}
	}

	/**
	 * 在节点的子节点列表最后位置插入一个节点
	 * @method appendChild
	 * @param {cls_uNode} node 要插入的节点
	 * @return {cls_uNode} 返回刚插入的子节点
	 * @example
	 * ```javascript
	 * node.appendChild( newNode ); //在node内插入子节点newNode
	 * ```
	 */
	appendChild(node) {
		if (
			this.type == "root" ||
			(this.type == "element" && !dtd.$empty[this.tagName])
		) {
			if (!this.children) {
				this.children = [];
			}
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			for (var i = 0, ci; (ci = this.children[i]); i++) {
				if (ci === node) {
					this.children.splice(i, 1);
					break;
				}
			}
			this.children.push(node);
			node.parentNode = this;
			return node;
		}
	}

	/**
	 * 在传入节点的前面插入一个节点
	 * @method insertBefore
	 * @param {cls_uNode} target 要插入的节点
	 * @param {cls_uNode} source 在该参数节点前面插入
	 * @return {cls_uNode} 返回刚插入的子节点
	 * @example
	 * ```javascript
	 * node.parentNode.insertBefore(newNode, node); //在node节点后面插入newNode
	 * ```
	 */
	insertBefore(target, source) {
		if (this.children) {
			if (target.parentNode) {
				target.parentNode.removeChild(target);
			}
			for (var i = 0, ci; (ci = this.children[i]); i++) {
				if (ci === source) {
					this.children.splice(i, 0, target);
					target.parentNode = this;
					return target;
				}
			}
		}
	}

	/**
	 * 在传入节点的后面插入一个节点
	 * @method insertAfter
	 * @param {cls_uNode} target 要插入的节点
	 * @param {cls_uNode} source 在该参数节点后面插入
	 * @return {cls_uNode} 返回刚插入的子节点
	 * @example
	 * ```javascript
	 * node.parentNode.insertAfter(newNode, node); //在node节点后面插入newNode
	 * ```
	 */
	insertAfter(target, source) {
		if (this.children) {
			if (target.parentNode) {
				target.parentNode.removeChild(target);
			}
			for (var i = 0, ci; (ci = this.children[i]); i++) {
				if (ci === source) {
					this.children.splice(i + 1, 0, target);
					target.parentNode = this;
					return target;
				}
			}
		}
	}

	/**
	 * 从当前节点的子节点列表中，移除节点
	 * @method removeChild
	 * @param {cls_uNode} node 要移除的节点引用
	 * @param { Boolean } keepChildren 是否保留移除节点的子节点，若传入true，自动把移除节点的子节点插入到移除的位置
	 * @return { * } 返回刚移除的子节点
	 * @example
	 * ```javascript
	 * node.removeChild(childNode,true); //在node的子节点列表中移除child节点，并且吧child的子节点插入到移除的位置
	 * ```
	 */
	removeChild(node, keepChildren) {
		if (this.children) {
			for (var i = 0, ci; (ci = this.children[i]); i++) {
				if (ci === node) {
					this.children.splice(i, 1);
					ci.parentNode = null;
					if (keepChildren && ci.children && ci.children.length) {
						for (var j = 0, cj; (cj = ci.children[j]); j++) {
							this.children.splice(i + j, 0, cj);
							cj.parentNode = this;
						}
					}
					return ci;
				}
			}
		}
	}

	/**
	 * 获取当前节点所代表的元素属性，即获取attrs对象下的属性值
	 * @method getAttr
	 * @param { String } attrName 要获取的属性名称
	 * @return { * } 返回attrs对象下的属性值
	 * @example
	 * ```javascript
	 * node.getAttr('title');
	 * ```
	 */
	getAttr(attrName) {
		return this.attrs && this.attrs[attrName.toLowerCase()];
	}

	/**
	 * 设置当前节点所代表的元素属性，即设置attrs对象下的属性值
	 * @method setAttr
	 * @param { String } attrName 要设置的属性名称
	 * @param { * } attrVal 要设置的属性值，类型视设置的属性而定
	 * @return { * } 返回attrs对象下的属性值
	 * @example
	 * ```javascript
	 * node.setAttr('title','标题');
	 * ```
	 */
	setAttr(attrName, attrVal) {
		if (!attrName) {
			delete this.attrs;
			return;
		}
		if (!this.attrs) {
			this.attrs = {};
		}
		if (utils.isObject(attrName)) {
			for (var a in attrName) {
				if (!attrName[a]) {
					delete this.attrs[a];
				} else {
					this.attrs[a.toLowerCase()] = attrName[a];
				}
			}
		} else {
			if (!attrVal) {
				delete this.attrs[attrName];
			} else {
				this.attrs[attrName.toLowerCase()] = attrVal;
			}
		}
	}

	/**
	 * 获取当前节点在父节点下的位置索引
	 * @method getIndex
	 * @return { Number } 返回索引数值，如果没有父节点，返回-1
	 * @example
	 * ```javascript
	 * node.getIndex();
	 * ```
	 */
	getIndex() {
		var parent = this.parentNode;
		for (var i = 0, ci; (ci = parent.children[i]); i++) {
			if (ci === this) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 在当前节点下，根据id查找节点
	 * @method getNodeById
	 * @param { String } id 要查找的id
	 * @return {cls_uNode} 返回找到的节点
	 * @example
	 * ```javascript
	 * node.getNodeById('textId');
	 * ```
	 */
	getNodeById(id) {
		var node;
		if (this.children && this.children.length) {
			for (var i = 0, ci; (ci = this.children[i++]);) {
				if ((node = getNodeById(ci, id))) {
					return node;
				}
			}
		}
	}

	/**
	 * 在当前节点下，根据元素名称查找节点列表
	 * @method getNodesByTagName
	 * @param { String } tagNames 要查找的元素名称
	 * @return { Array } 返回找到的节点列表
	 * @example
	 * ```javascript
	 * node.getNodesByTagName('span');
	 * ```
	 */
	getNodesByTagName(tagNames) {
		tagNames = utils.trim(tagNames).replace(/[ ]{2,}/g, " ").split(" ");
		var arr = [],
			me = this;
		utils.each(tagNames, function (tagName) {
			if (me.children && me.children.length) {
				for (var i = 0, ci; (ci = me.children[i++]);) {
					getNodesByTagName(ci, tagName, arr);
				}
			}
		});
		return arr;
	}

	/**
	 * 根据样式名称，获取节点的样式值
	 * @method getStyle
	 * @param { String } name 要获取的样式名称
	 * @return { String } 返回样式值
	 * @example
	 * ```javascript
	 * node.getStyle('font-size');
	 * ```
	 */
	getStyle(name) {
		var cssStyle = this.getAttr("style");
		if (!cssStyle) {
			return "";
		}
		var reg = new RegExp("(^|;)\\s*" + name + ":([^;]+)", "i");
		var match = cssStyle.match(reg);
		if (match && match[0]) {
			return match[2];
		}
		return "";
	}

	/**
	 * 给节点设置样式
	 * @method setStyle
	 * @param { String } name 要设置的的样式名称
	 * @param { String } val 要设置的的样值
	 * @example
	 * ```javascript
	 * node.setStyle('font-size', '12px');
	 * ```
	 */
	setStyle(name, val) {
		function exec(name, val) {
			var reg = new RegExp("(^|;)\\s*" + name + ":([^;]+;?)", "gi");
			cssStyle = cssStyle.replace(reg, "$1");
			if (val) {
				cssStyle = name + ":" + utils.unhtml(val) + ";" + cssStyle;
			}
		}

		var cssStyle = this.getAttr("style");
		if (!cssStyle) {
			cssStyle = "";
		}
		if (utils.isObject(name)) {
			for (var a in name) {
				exec(a, name[a]);
			}
		} else {
			exec(name, val);
		}
		this.setAttr("style", utils.trim(cssStyle));
	}

	/**
	 * 传入一个函数，递归遍历当前节点下的所有节点
	 * @method traversal
	 * @param { Function } fn 遍历到节点的时，传入节点作为参数，运行此函数
	 * @example
	 * ```javascript
	 * traversal(node, function(){
	 *     console.log(node.type);
	 * });
	 * ```
	 */
	traversal(fn) {
		if (this.children && this.children.length) {
			nodeTraversal(this, fn);
		}
		return this;
	}
}

/**
 * 创建uNode的静态方法
 * 操作 uNode(模拟节点) 的工具函数
 */
const nodeUtils = {
	//创建uNode的静态方法
	//支持标签和html
	createElement: function (html) {
		if (/[<>]/.test(html)) {
			return htmlparser(html, false, cls_uNode, this).children[0];
		} else {
			return new cls_uNode({
				type: "element",
				children: [],
				tagName: html
			});
		}
	},
	createText: function (data, noTrans) {
		return new cls_uNode({
			type: "text",
			data: noTrans ? data : utils.unhtml(data || "")
		});
	},
}

export { cls_uNode, nodeUtils };