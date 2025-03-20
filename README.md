# UEditorPlus-esm版

## 说明
- 本项目基于 [UEditor Plus](https://gitcode.com/modstart-lib/ueditor-plus) v4.3.0 [2025-03-09]
- 本项目并不是`开箱即用`的 富文本编辑器，如需`开箱即用`请直接使用 [UEditor Plus](https://gitcode.com/modstart-lib/ueditor-plus)
- 本项目只是一个 **过渡性的半成品**，不会跟随原版 UEditorPlus 更新、也没有完善计划、也不会修复Bug之类的，只是为了能更方便地研究 UEditor 的实现原理与二次开发的可行性，并提供给同样有此需要的朋友。
- `esm` 即 `ECMAScript Modules`
- `_src/adapter/`，`_src/code/`，`_src/ui/` 这三个目录中编辑器的基础功能代码：
  - 把原本的 **即时执行函数** 代码模式改为 **ESM** 模式。
  - 把原本的以 **prototype** 定义`类`的模式改为用 `class`和`extends`模式定义`类`和`继承`。
  - 增加了一些 **JSDoc** 声明了一些变量的原型，JSDoc声明变量原型的语法规则可参见`docs/JSDoc_notes.md`。
  - 通过以上三点，在 VSCode 中可实现智能感知，`ctrl+点击`可快速跳转到方法、属性、变量的定义位置。
  - 如果有些文件中的方法还是无法智能感知，那就是因为这个文件中的代码改不动，比如`_src/code/dtd.js`
- `_src/plugins/` 目录下的文件没有 esm 化（也很难 esm 化，也没太大的必要esm化）。
- 改动了一些目录结构：把原项目根目录下的 `_src/` `dialogs/`, `lang/`, `themes/`, `ueditor.config.js` 都移入到新增的 `editor/` 目录下。
  - 所以 `_examples/` 目录下的Demo基本上都是无法正常演示的了。
  - 需**使用 `test_esm.html` 查看本项目的演示**。
- `try_js/` 目录里是一些试验代码，没什么用。
- 在esm化之前对 UEditorPlus 做了一些代码修改，修改位置记录在 `editor/change-log_zhu.md` 中，所以 esm 中的一些功能会与原版 UEditorPlus 有点不同。
  - 如有需要可按 `change-log_zhu.md` 中所记录的修改位置搜索定位，手动把修改的代码撤消掉。


## 已esm的代码：
- `ueditor.config.js` 文件
- `_src/adapter/` 目录下的代码文件
- `_src/code/` 目录下的大部份代码文件
- `_src/ui/` 目录下的大部份代码文件

## 出发点与作用
- 研究 UEditor 的实现原理。
- esm化后定制修改和二次开发会更容易。
- 试验：改用 Vue3 渲染编辑器UI的可行性（扔掉 UEditor 原本那一套通过JS拼接HTML字符串的渲染方式）
- 试验：使用 Vue3+Web Components 定制开发新功能的可行性。

## 附：_src/ui/ 目录下的类继承关系
- UIBase.js
  - stateful.cls.js
    - button.js
    - cls_uiMenuItem(menu.js)
    - pastepicker.js
    - splitbutton.js
      - colorbutton.js
      - tablebutton.js
      - menubutton.js
      - combox.js
      - autotypesetbutton.js
      - multiMenu.js
  - popup.js
    - menu.js
    - quick-operate.js
  - toolbar.js
  - dialog.js
  - message.js
  - breakline.js
  - separator.js
  - mask.js
  - tablepicker.js
  - colorpicker.js
  - autotypesetpicker.js
  - cellalignpicker.js
  - shortcutmenu.js

## 开源协议

- Apache 2.0
