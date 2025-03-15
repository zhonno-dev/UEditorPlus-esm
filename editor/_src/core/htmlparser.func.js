//为解决 htmlparser() 与 uNode 的相互交叉引用死循环的问题，把 htmlparser 单独提取出来，并增加一个参数传入 cls_uNode ，让此文件不需要 import cls_uNode

import { domUtils } from "./domUtils.js";
import dtd from "./dtd.js";
import utils from "./utils.js";

/**
 * html字符串转换成uNode节点
 * 
 * 该函数将给定的HTML字符串转换为一个树形结构，以便于进一步处理和操作
 * 它会根据HTML标签、属性和内容创建一个节点树，其中包含了所有元素、属性和文本内容
 * 
 * @param {string} htmlstr - 需要解析的HTML字符串
 * @param {boolean} ignoreBlank - 是否忽略空白字符，包括空格、换行符等；若设置为true，转换的时候忽略\n\r\t等空白字符
 * @param {typeof import('./node.js').cls_uNode.prototype} cls_uNode - cls_uNode
 * @param {typeof import('./node.js').nodeUtils} nodeUtils - nodeUtils
 * @returns {typeof import('./node.js').cls_uNode.prototype} 给定的html片段转换形成的uNode对象
 * @since 1.2.6.1
 * @example
 * ```javascript
 * var root = UE.htmlparser('<p><b>htmlparser</b></p>', true);
 * ```
 */
function htmlparser(htmlstr, ignoreBlank, cls_uNode, nodeUtils) {
	// 正则表达式，用于匹配HTML标签和属性
	// 这里的正则表达式经过多次修改，以适应不同的HTML格式和需求
	//todo 原来的方式  [^"'<>\/] 有\/就不能配对上 <TD vAlign=top background=../AAA.JPG> 这样的标签了
	//先去掉了，加上的原因忘了，这里先记录
	//var re_tag = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/<>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g,
	//以上的正则表达式无法匹配:<div style="text-align:center;font-family:" font-size:14px;"=""><img src="http://hs-album.oss.aliyuncs.com/static/27/78/35/image/20161206/20161206174331_41105.gif" alt="" /><br /></div>
	//修改为如下正则表达式:
	var re_tag = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\/\s>]+)((?:\s+[\w\-:.]+(?:\s*=\s*?(?:(?:"[^"]*")|(?:'[^']*')|[^\s"'\/>]+))?)*)[\S\s]*?(\/?)>))/g,
		re_attr = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g;

	//ie下取得的html可能会有\n存在，要去掉，在处理replace(/[\t\r\n]*/g,'');代码高量的\n不能去除
	// 允许存在的空标签，这些标签在解析时不会被忽略
	var allowEmptyTags = {
		b: 1,
		code: 1,
		i: 1,
		u: 1,
		strike: 1,
		s: 1,
		tt: 1,
		strong: 1,
		q: 1,
		samp: 1,
		em: 1,
		span: 1,
		sub: 1,
		img: 1,
		sup: 1,
		font: 1,
		big: 1,
		small: 1,
		iframe: 1,
		a: 1,
		br: 1,
		pre: 1
	};

	// 移除HTML字符串中的特定字符，以确保解析的准确性
	htmlstr = htmlstr.replace(new RegExp(domUtils.fillChar, "g"), "");

	// 如果不忽略空白字符，则对HTML字符串进行进一步处理，以移除多余的空白字符
	if (!ignoreBlank) {
		htmlstr = htmlstr.replace(
			new RegExp(
				"[\\r\\t\\n" +
				(ignoreBlank ? "" : " ") +
				"]*</?(\\w+)\\s*(?:[^>]*)>[\\r\\t\\n" +
				(ignoreBlank ? "" : " ") +
				"]*",
				"g"
			),
			function (a, b) {
				//br暂时单独处理
				if (b && allowEmptyTags[b.toLowerCase()]) {
					return a.replace(/(^[\n\r]+)|([\n\r]+$)/g, "");
				}
				return a
					.replace(new RegExp("^[\\r\\n" + (ignoreBlank ? "" : " ") + "]+"), "")
					.replace(
						new RegExp("[\\r\\n" + (ignoreBlank ? "" : " ") + "]+$"),
						""
					);
			}
		);
	}

	// 不需要转换的属性，直接使用原始值
	var notTransAttrs = {
		href: 1,
		src: 1
	};

	// 需要父节点的标签，这些标签在解析时需要找到其父节点
	var needParentNode = {
		td: "tr",
		tr: ["tbody", "thead", "tfoot"],
		tbody: "table",
		th: "tr",
		thead: "table",
		tfoot: "table",
		caption: "table",
		li: ["ul", "ol"],
		dt: "dl",
		dd: "dl",
		option: "select"
	};

	// 需要子节点的标签，这些标签在解析时需要自动创建子节点
	var needChild = {
		ol: "li",
		ul: "li"
	};

	/**
	 * 创建文本节点
	 * 
	 * @param {UE.uNode} parent - 父节点
	 * @param {string} data - 文本内容
	 */
	function text(parent, data) {
		if (needChild[parent.tagName]) {
			var tmpNode = nodeUtils.createElement(needChild[parent.tagName]);
			parent.appendChild(tmpNode);
			tmpNode.appendChild(nodeUtils.createText(data));
			parent = tmpNode;
		} else {
			parent.appendChild(nodeUtils.createText(data));
		}
	}

	/**
	 * 创建元素节点
	 * 
	 * @param {UE.uNode} parent - 父节点
	 * @param {string} tagName - 元素标签名
	 * @param {string} htmlattr - 元素属性字符串
	 * @returns {UE.uNode} 返回创建的元素节点或其父节点
	 */
	function element(parent, tagName, htmlattr) {
		var needParentTag;
		if ((needParentTag = needParentNode[tagName])) {
			console.log(`if ((needParentTag = needParentNode[tagName])):tagName=${tagName}`);
			var tmpParent = parent,
				hasParent;
			while (tmpParent.type != "root") {
				if (
					utils.isArray(needParentTag)
						? utils.indexOf(needParentTag, tmpParent.tagName) != -1
						: needParentTag == tmpParent.tagName
				) {
					parent = tmpParent;
					hasParent = true;
					break;
				}
				tmpParent = tmpParent.parentNode;
			}
			if (!hasParent) {
				parent = element(
					parent,
					utils.isArray(needParentTag) ? needParentTag[0] : needParentTag
				);
			}
		}
		//按dtd处理嵌套
		//        if(parent.type != 'root' && !dtd[parent.tagName][tagName])
		//            parent = parent.parentNode;
		var elm = new cls_uNode({
			parentNode: parent,
			type: "element",
			tagName: tagName.toLowerCase(),
			//是自闭合的处理一下
			children: dtd.$empty[tagName] ? null : []
		});
		//如果属性存在，处理属性
		if (htmlattr) {
			// console.log(`if (htmlattr)`);
			var attrs = {},
				match;
			while ((match = re_attr.exec(htmlattr))) {
				attrs[match[1].toLowerCase()] = notTransAttrs[match[1].toLowerCase()]
					? match[2] || match[3] || match[4]
					: utils.unhtml(match[2] || match[3] || match[4]);
			}
			elm.attrs = attrs;
		}
		//trace:3970
		//        //如果parent下不能放elm
		//        if(dtd.$inline[parent.tagName] && dtd.$block[elm.tagName] && !dtd[parent.tagName][elm.tagName]){
		//            parent = parent.parentNode;
		//            elm.parentNode = parent;
		//        }
		parent.children.push(elm);
		//如果是自闭合节点返回父亲节点
		let ret = dtd.$empty[tagName] ? parent : elm;
		return ret;
	}

	/**
	 * 创建注释节点
	 * 
	 * @param {UE.uNode} parent - 父节点
	 * @param {string} data - 注释内容
	 */
	function comment(parent, data) {
		parent.children.push(
			new cls_uNode({
				type: "comment",
				data: data,
				parentNode: parent
			})
		);
	}

	var match,
		currentIndex = 0,
		nextIndex = 0;
	//设置根节点
	var root = new cls_uNode({
		type: "root",
		children: []
	});
	var currentParent = root;

	/**
	 * 使用正则表达式 re_tag 对 HTML 字符串进行循环匹配，解析 HTML 标签和内容
	 * 
	 * @param {Array} match - 正则表达式匹配结果数组
	 * @param {number} currentIndex - 当前匹配到的 HTML 字符串的索引位置
	 * @param {number} nextIndex - 下一次匹配的起始索引位置
	 */
	while ((match = re_tag.exec(htmlstr))) {
		console.log(`while BEGIN`);
		console.log(match);
		// 记录当前匹配的起始索引
		currentIndex = match.index;
		try {
			// 如果当前匹配的起始索引大于下一次匹配的起始索引，说明存在文本节点
			if (currentIndex > nextIndex) {
				//text node
				// 调用 text 函数创建文本节点
				text(currentParent, htmlstr.slice(nextIndex, currentIndex));
			}
			// 如果匹配到开始标签
			if (match[3]) {
				console.log(`if(match[3])`);
				console.log(`   currentParent.tagName：`, currentParent.tagName);
				// 如果当前父节点是 CDATA 类型，将整个匹配内容作为文本处理
				if (currentParent.tagName && dtd.$cdata[currentParent.tagName]) {
					console.log(`dtd.$cdata[currentParent.tagName]`);
					text(currentParent, match[0]);
				}
				else {
					console.log(`else`);
					//start tag
					// 调用 element 函数创建元素节点，并更新当前父节点
					currentParent = element(
						currentParent,
						match[3].toLowerCase(),
						match[4]
					);
					console.log(`   tagStart:${match[3]}:`, currentParent);
				}
			}
			// 如果匹配到结束标签
			else if (match[1]) {
				// 确保当前父节点不是根节点
				if (currentParent.type != "root") {
					// 如果当前父节点是 CDATA 类型且结束标签不是 CDATA 类型，将整个匹配内容作为文本处理
					if (dtd.$cdata[currentParent.tagName] && !dtd.$cdata[match[1]]) {
						text(currentParent, match[0]);
					} else {
						// 临时保存当前父节点
						var tmpParent = currentParent;
						// 向上查找父节点，直到找到匹配的结束标签或根节点
						while (
							currentParent.type == "element" &&
							currentParent.tagName != match[1].toLowerCase()
						) {
							currentParent = currentParent.parentNode;
							// 如果找到根节点，恢复临时父节点并抛出异常
							if (currentParent.type == "root") {
								currentParent = tmpParent;
								throw "break";
							}
						}
						//end tag
						// 更新当前父节点为其父节点
						currentParent = currentParent.parentNode;
					}
				}
			}
			// 如果匹配到注释标签
			else if (match[2]) {
				// 调用 comment 函数创建注释节点
				comment(currentParent, match[2]);
			}
		}
		// 捕获异常，不做处理
		catch (e) {
		}
		console.log(`currentParent:`, currentParent);
		// 更新下一次匹配的起始索引
		nextIndex = re_tag.lastIndex;
		console.log(`while NEXT`);
		// break;
	}
	console.log('while END');
	console.log(`root:`, root);

	//如果结束是文本，就有可能丢掉，所以这里手动判断一下
	//例如 <li>sdfsdfsdf<li>sdfsdfsdfsdf
	if (nextIndex < htmlstr.length) {
		text(currentParent, htmlstr.slice(nextIndex));
	}
	return root;
}

export default htmlparser;