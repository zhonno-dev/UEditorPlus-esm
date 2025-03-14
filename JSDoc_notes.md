
[JSDoc](https://jsdoc.bootcss.com/tags-type.html)

## 关于 @import 标签
注：JSDoc文档中是查不到 @import 这个标签的，但有时候这个标签有效，有时候又无效，所以不推荐使用 @import 标签。

## 声明指向一个import的东西

### 未真实import也能生效：
```javascript
var obj = {
  /**
   * ！这样是有效的！
   * @type {typeof import('./core/keymap.js').default}
   */
	abc2: null,
}
```

### 必须真实import后才能生效：
```javascript
import cls_Editor from './core/Editor.cls.js'; //必须要真实import
var obj = {
  /**
   * ！这样是有效的！
   * @type cls_Editor
   */
	abc2: null,
}
```

## 声明指向一个类的方法：

### (推荐)未真实import也能生效：
  可以直接指向一个方法，注意必须要有`prototype`
  这样声明后VSCode能感知到所指向的目标方法，能出现方法说明和参数提示。
```javascript
var obj = {
  /**
	 * @type {typeof import('./core/Editor.cls.js').default.prototype._setup}
	 */
	abc2: null,
}
```

### 必须真实import后才能生效：
  必须真实import了cls_Editor才能让VSCode感知到所指向的目标方法。
  可以直接指向一个方法，注意必须要有`prototype`
```javascript
import cls_Editor from './core/Editor.cls.js'; //必须要真实import
var obj = {
  /**
	 * @type {typeof cls_Editor.prototype.render}
	 */
	abc2: null,
}
```



## 不行的写法

```javascript
var obj = {
    /**
		 * ！以下这样是不行的！
		 * @import keymap from './core/keymap.js'
		 * @type keymap
		 */
		domUtils: null,
}
```
```javascript
var obj = {
    /**
		 * ！以下这样是不行的！
		 * @import keymap from './core/keymap.js'
		 * @type {import('./core/keymap.js').default}
		 */
		domUtils: null,
}
```
```javascript
var obj = {
    /**
		 * ！以下这样是不行的！
		 * @type {import('./core/keymap.js').default} //这样是不行的
		 */
		domUtils: null,
}
```


```javascript
```
