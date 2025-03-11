## _src/

### editor.js|入口
_src/editor.js
导出 UE

## core/

### core/browser.js|浏览器检测的模块
_src/core/browser.js
//快捷方式
//const {ie, webkit, gecko, opera} = browser;

在 入口 里直接 import 并加入到 UE.browser 里。

### core/utils.js|工具函数包
_src/core/utils.js

在 入口 里直接 import 并加入到 UE.utils 里。

### core/EventBase.js|UE采用的事件基类
_src/core/EventBase.js

在 入口 里直接 import 并加入到 UE.EventBase 里。

### core/dtd.js|html语义化的体现类
_src/core/dtd.js

在 入口 里直接 import 并加入到 UE.dom.dtd 里。


### core/domUtils.js|Dom操作工具包
_src/core/domUtils.js

在 入口 里直接 import 并加入到 UE.dom.domUtils 里。

### core/Range.js|Range封装
_src/core/Range.js

在 入口 里直接 import 并加入到 UE.dom.Range 里。

### core/Selection.js|选集
_src/core/Selection.js

在 入口 里直接 import 并加入到 UE.dom.Selection 里。

### core/Editor.js|
_src/core/Editor.js

在 入口 里直接 import 并加入到 UE.Editor 里。

### core/Editor.defaultoptions.js|
_src/core/Editor.defaultoptions.js

在 editor/_src/core/Editor.js 里import 并加入到 Editor.defaultOptions

### _src/core/loadconfig.js|
_src/core/loadconfig.js

此文件 import core/Editor.js 并直接修改 UE_Editor.prototype.*

### _src/core/ajax.js
_src/core/ajax.js

在 入口 里直接 import 并加入到 UE.ajax 里。

### _src/core/api.js
_src/core/api.js

在 入口 里直接 import 并加入到 UE.api 里。

### _src/core/image.js
_src/core/image.js

在 入口 里直接 import 并加入到 UE.image 里。

### _src/core/dialog.js
_src/core/dialog.js

在 入口 里直接 import 并加入到 UE.dialog 里。

### _src/core/filterword.js
_src/core/filterword.js

在 入口 里直接 import 并加入到 UE.filterWord 里。

### _src/core/node.js
_src/core/node.js

在 入口 里直接 import 并加入到 UE.uNode 里。


### _src/core/htmlparser.js
_src/core/htmlparser.js

在 入口 里直接 import 并加入到 UE.htmlparser 里。

### _src/core/filternode.js
_src/core/filternode.js

在 入口 里直接 import 并加入到 UE.filterNode 里。

### _src/core/plugin.js
_src/core/plugin.js

在 入口 里直接 import 并加入到 UE.plugin 里。

### _src/core/keymap.js
_src/core/keymap.js

在 入口 里直接 import 并加入到 UE.keymap 里。

### _src/core/localstorage.js
_src/core/localstorage.js

在 入口 里直接 import 并加入到 UE.LocalStorage 里。
此文件 import core/Editor.js 并直接修改 UE_Editor.prototype.*

## plugins/

### _src/plugins/defaultfilter.js
_src/plugins/defaultfilter.js

## ui/

### _src/ui/ui.js
_src/ui/ui.js

此文件为初始化 UE.ui = {},不需要处理。

### _src/ui/uiutils.js
_src/ui/uiutils.js

### _src/ui/uibase.js
_src/ui/uibase.js

### _src/ui/separator.js
_src/ui/separator.js

### _src/ui/mask.js
_src/ui/mask.js

### _src/ui/popup.js
_src/ui/popup.js

### _src/ui/colorpicker.js
_src/ui/colorpicker.js

### _src/ui/tablepicker.js
_src/ui/tablepicker.js

### _src/ui/stateful.js
_src/ui/stateful.js

### _src/ui/button.js
_src/ui/button.js

### _src/ui/splitbutton.js
_src/ui/splitbutton.js

### _src/ui/colorbutton.js
_src/ui/colorbutton.js

### _src/ui/tablebutton.js
_src/ui/tablebutton.js

### _src/ui/autotypesetpicker.js
_src/ui/autotypesetpicker.js

### _src/ui/autotypesetbutton.js
_src/ui/autotypesetbutton.js

### _src/ui/cellalignpicker.js
_src/ui/cellalignpicker.js

### _src/ui/pastepicker.js
_src/ui/pastepicker.js

### _src/ui/toolbar.js
_src/ui/toolbar.js

### _src/ui/quick-operate.js
_src/ui/quick-operate.js

### _src/ui/menu.js
_src/ui/menu.js

### _src/ui/combox.js
_src/ui/combox.js

### _src/ui/dialog.js
_src/ui/dialog.js

### _src/ui/menubutton.js
_src/ui/menubutton.js

### _src/ui/multiMenu.js
_src/ui/multiMenu.js

### _src/ui/shortcutmenu.js
_src/ui/shortcutmenu.js

### _src/ui/breakline.js
_src/ui/breakline.js

### _src/ui/message.js
_src/ui/message.js

## adapter/

### _src/adapter/editorui.js
_src/adapter/editorui.js

### _src/adapter/editor.js
_src/adapter/editor.js

### _src/adapter/message.js
_src/adapter/message.js

## lang/

### lang/zh-cn/zh-cn.js
lang/zh-cn/zh-cn.js
