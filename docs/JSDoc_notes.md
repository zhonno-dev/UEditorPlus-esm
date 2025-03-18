
[JSDoc](https://jsdoc.bootcss.com/tags-type.html)

## 关于 @import 标签
JSDoc文档中是查不到 @import 这个标签的，
但在声明变量时却只有 @import 是有效的；
但在声明{...}里的属性时却是无效的；
## 关于 @type 标签
经过测试后发现 @type 标签才是通用的声明方式：
- 已真实import后可用 @type 标签声明：
  - @type xxx //指向类或{..}对象
  - @type xxx.xx //指向{..}的属性
  - @type {typeof clsName.prototype.xxx} //指向class的方法
- 未真实import时也可用 @type 标签声明：
  - @type {typeof import('...').default} //指向{..}对象
  - @type {typeof import('...').default.xxx} //指向{..}的属性
  - @type {typeof import('...').default.prototype} //指向class类
  - @type {typeof import('...').default.prototype.xxx} //指向class的方法

## 已真实 import后 @type 的通用写法
若已真实import，直接用 `@type` 声明即可：

```javascript
import cls_Editor from './core/Editor.cls.js'; //真实import

//声明全局变量:
//  这样声明后就能指向已import的cls_Editor
/**
 * @type cls_Editor
 */
var v1 = null;

//声明局部变量
function () {
  //这样声明后就能指向已import的cls_Editor
  //  单行 `/**  */` 也行
  /** @type cls_Editor */
  var v2 = null;
}

//声明{..}内属性
var obj = {
  //这样声明后 obj.cls 就能指向已import的cls_Editor
  /** @type cls_Editor */
  cls:null,
}

//指向类的方法
//  这样声明后就能指向 cls_Editor.render() 方法
//  注意必须要有`prototype`
/** @type {typeof cls_Editor.prototype.render} */
var f1 = null;

//指向{..}中的属性
//  这样声明后就能指向 utils{each: ...}
//  注意 utils.each 只是{..}中的一个函数，并不是class的方法，所以不需要加`prototype`
/** @type {typeof utils.each} */
var v3 = null;

```

## 未真实import时 @type 声明变量
！注：声明变量（全局/局部）与声明{..}属性的写法是不同的：

### 有效的写法：
```javascript
//# 指向类：
/**
 * ！这样是有效的！
 * ！注意必须要有 `prototype` 才行
 * @type {typeof import('./core/Editor.cls.js').default.prototype}
 */
var v2 = null;
/**
 * ！这样也是有效的！
 * @import cls_Editor from './core/Editor.cls.js'; 
 * @type cls_Editor
 */
var editor = null;

//# 指向class的方法：
/**
 * ！这样是有效的！
 * @type {typeof import('./core/Editor.cls.js').default.prototype.render}
 */
var v2 = null;
/**
 * ！这样也是有效的！
 * @import cls_Editor from './core/Editor.cls.js'; 
 * @type {typeof cls_Editor.prototype.render}
 */
var editor = null;

//# 指向{..}：
/**
 * ！这样是有效的！
 * @type {typeof import('./core/localstorage.js').default}
 */
var v2 = null;
/**
 * ！这样也是有效的！
 * @import LocalStorage from './core/localstorage.js';
 * @type {typeof LocalStorage}
 */
var editor = null;

//# 指向{..}中的属性：
/**
 * ！这样是有效的！
 * @type {typeof import('./core/localstorage.js').default.saveLocalData}
 */
var v2 = null;
/**
 * ！这样也是有效的！
 * @import LocalStorage from './core/localstorage.js';
 * @type {typeof LocalStorage.saveLocalData}
 */
var f1 = null;

```

### 无效的写法：
```javascript
/**
 * ！这样是有问题的！
 * ！这个 Editor.cls.js 中的方法会被感知到 v2.prototype 里面！
 * @type {typeof import('./core/Editor.cls.js').default}
 */
var v2 = null;
v2.render(); //无法正确感知！
v2.prototype.render(container); //这样才能感知到 render() 方法。


```

## 未真实import时 @type 声明{..}属性
只能使用 `@type {typeof import ...}`的写法！
@import 标签是无效的！

### 有效的写法：
```javascript
//# 指向类：
var obj = {
  /**
   * ！这样是有效的！
   *  注意必须要同时有`default`和`prototype`，少一个都不行！
	 * @type {typeof import('./core/Editor.cls.js').default.prototype}
	 */
	test: null,
}

//# 指向class的方法：
var obj = {
  /**
   * ！可以直接指向一个方法，注意必须要同时有`default`和`prototype`
   * 这样声明后VSCode能感知到所指向的目标方法，能出现方法说明和参数提示。
	 * @type {typeof import('./core/Editor.cls.js').default.prototype._setup}
	 */
	abc2: null,
}

//# 指向{..}：
var obj = {
  /**
   * ！这样是有效的！
   * @type {typeof import('./core/keymap.js').default}
   */
	abc2: null,
}

//# 指向{..}中的属性：
var obj = {
  /**
   * ！这样是有效的！
	 * @type {typeof import('./core/localstorage.js').default}
	 */
	test: null,
}

```

### 无效的写法：
声明{..}中的属性时`@import`标签是无效的：
```javascript
var obj = {
  /**
   * ！这样是无效的！
	 * @import cls_Editor from './core/Editor.cls.js';
	 * @type cls_Editor
	 */
	test: null,
}

var obj = {
  /**
   * ！以下这样是不行的！
   * @import keymap from './core/keymap.js'
   * @type keymap
   */
  domUtils: null,
}

var obj = {
  /**
   * ！以下这样是不行的！
   * @type {import('./core/keymap.js').default}
   */
  domUtils: null,
}

var obj = {
  /**
   * ！这样是不行的！
   *  缺少了`default`
	 * @type {typeof import('./core/Editor.cls.js').prototype}
	 */
	test: null,
}

var obj = {
  /**
   * ！这样是不行的！
   *  缺少了`prototype`
	 * @type {typeof import('./core/Editor.cls.js').default}
	 */
	test: null,
}
```