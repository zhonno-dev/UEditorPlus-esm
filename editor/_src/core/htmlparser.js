import { domUtils } from "./domUtils.js";
import UE_uNode from "./node.js";

var uNode = UE_uNode;

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
			var tmpNode = uNode.createElement(needChild[parent.tagName]);
			parent.appendChild(tmpNode);
			tmpNode.appendChild(uNode.createText(data));
			parent = tmpNode;
		} else {
			parent.appendChild(uNode.createText(data));
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
		var elm = new uNode({
			parentNode: parent,
			type: "element",
			tagName: tagName.toLowerCase(),
			//是自闭合的处理一下
			children: dtd.$empty[tagName] ? null : []
		});
		//如果属性存在，处理属性
		if (htmlattr) {
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
		return dtd.$empty[tagName] ? parent : elm;
	}

	/**
	 * 创建注释节点
	 * 
	 * @param {UE.uNode} parent - 父节点
	 * @param {string} data - 注释内容
	 */
	function comment(parent, data) {
		parent.children.push(
			new uNode({
				type: "comment",
				data: data,
				parentNode: parent
			})
		);
	}

/**
 * html字符串转换成uNode节点
 * 
 * 该函数将给定的HTML字符串转换为一个树形结构，以便于进一步处理和操作
 * 它会根据HTML标签、属性和内容创建一个节点树，其中包含了所有元素、属性和文本内容
 * 
 * @param {string} htmlstr - 需要解析的HTML字符串
 * @param {boolean} ignoreBlank - 是否忽略空白字符，包括空格、换行符等；若设置为true，转换的时候忽略\n\r\t等空白字符
 * @returns {UE.uNode} 给定的html片段转换形成的uNode对象
 * @since 1.2.6.1
 * @example
 * ```javascript
 * var root = UE.htmlparser('<p><b>htmlparser</b></p>', true);
 * ```
 */
function htmlparser(htmlstr, ignoreBlank) {
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
	var uNode = UE.uNode;


	var match,
		currentIndex = 0,
		nextIndex = 0;
	//设置根节点
	var root = new uNode({
		type: "root",
		children: []
	});
	var currentParent = root;

	while ((match = re_tag.exec(htmlstr))) {
		currentIndex = match.index;
		try {
			if (currentIndex > nextIndex) {
				//text node
				text(currentParent, htmlstr.slice(nextIndex, currentIndex));
			}
			if (match[3]) {
				if (dtd.$cdata[currentParent.tagName]) {
					text(currentParent, match[0]);
				} else {
					//start tag
					currentParent = element(
						currentParent,
						match[3].toLowerCase(),
						match[4]
					);
				}
			} else if (match[1]) {
				if (currentParent.type != "root") {
					if (dtd.$cdata[currentParent.tagName] && !dtd.$cdata[match[1]]) {
						text(currentParent, match[0]);
					} else {
						var tmpParent = currentParent;
						while (
							currentParent.type == "element" &&
							currentParent.tagName != match[1].toLowerCase()
						) {
							currentParent = currentParent.parentNode;
							if (currentParent.type == "root") {
								currentParent = tmpParent;
								throw "break";
							}
						}
						//end tag
						currentParent = currentParent.parentNode;
					}
				}
			} else if (match[2]) {
				//comment
				comment(currentParent, match[2]);
			}
		} catch (e) {
		}
		nextIndex = re_tag.lastIndex;
	}
	//如果结束是文本，就有可能丢掉，所以这里手动判断一下
	//例如 <li>sdfsdfsdf<li>sdfsdfsdfsdf
	if (nextIndex < htmlstr.length) {
		text(currentParent, htmlstr.slice(nextIndex));
	}
	return root;
}

export default htmlparser;