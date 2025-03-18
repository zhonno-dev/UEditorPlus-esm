//这个文件是原本的 htmlparser.js，已被改成入口，实际调用新的 htmlparser.func.php

import htmlparser_new from "./htmlparser.func.js";
import cls_uNode from "./node.js";

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
	return htmlparser_new(htmlstr, ignoreBlank, cls_uNode);
}

export default htmlparser;