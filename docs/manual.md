# UEditorPlus 配置文档

## 基础使用

```html
<script id="editor" type="text/plain" style="height:300px;"></script>
<script type="text/javascript" src="/path/to/UEditorPlus/ueditor.config.js"></script>
<script type="text/javascript" src="/path/to/UEditorPlus/ueditor.all.js"></script>
<script>
    var ue = UE.getEditor('editor', {
        // ... 更多配置
    });
</script>
```

EUditorPlus 是基于 UEditor 二次开发的富文本编辑器，部分变量、配置参数部分尽可能保持与 UEditor 一致，以便于更好的迁移替代。
但是部分配置参数已经不再适用，已经被废弃，具体请参考下面的配置文档，对于配置部分不兼容的本文档中尽可能说明，方便大家使用。

## 编辑器配置参数

### UEDITOR\_HOME\_URL

UEditorPlus 的根目录，绝对路径。

### UEDITOR\_CORS\_URL

UEditorPlus 的跨域根目录，绝对路径。

### serverUrl

UEditorPlus 的服务端地址，绝对路径。该路径用于返回配置信息和响应前端的请求等。

### serverHeaders

服务器统一请求头信息，会在所有请求中带上该信息

如

```js
{
    // ...
    serverHeaders: {
      'Authorization': 'Bearer xxx'
    }
    // ...
}
```

### serverResponsePrepare

服务器响应数据预处理，会在所有请求响应后，对响应数据进行处理

```js
{
    // ...
    serverResponsePrepare: function( res ){
        // 这里返回的结果需要是 UEditor 原始需要的数据结构
        return res
    }
    // ...
}
```

### toolbars

UEditorPlus 的工具栏配置。

`|` 为分隔符，`[]` 表示多个分组。

```js
[
    [
        "fullscreen",   // 全屏
        "source",       // 源代码
        "|",
        "undo",         // 撤销
        "redo",         // 重做
        "|",
        "bold",         // 加粗
        "italic",       // 斜体
        "underline",    // 下划线
        "fontborder",   // 字符边框
        "strikethrough",// 删除线
        "superscript",  // 上标
        "subscript",    // 下标
        "removeformat", // 清除格式
        "formatmatch",  // 格式刷
        "autotypeset",  // 自动排版
        "blockquote",   // 引用
        "pasteplain",   // 纯文本粘贴模式
        "|",
        "forecolor",    // 字体颜色
        "backcolor",    // 背景色
        "insertorderedlist",   // 有序列表
        "insertunorderedlist", // 无序列表
        "selectall",    // 全选
        "cleardoc",     // 清空文档
        "|",
        "rowspacingtop",// 段前距
        "rowspacingbottom",    // 段后距
        "lineheight",          // 行间距
        "|",
        "customstyle",         // 自定义标题
        "paragraph",           // 段落格式
        "fontfamily",          // 字体
        "fontsize",            // 字号
        "|",
        "directionalityltr",   // 从左向右输入
        "directionalityrtl",   // 从右向左输入
        "indent",              // 首行缩进
        "|",
        "justifyleft",         // 居左对齐
        "justifycenter",       // 居中对齐
        "justifyright",
        "justifyjustify",      // 两端对齐
        "|",
        "touppercase",         // 字母大写
        "tolowercase",         // 字母小写
        "|",
        "link",                // 超链接
        "unlink",              // 取消链接
        "anchor",              // 锚点
        "|",
        "imagenone",           // 图片默认
        "imageleft",           // 图片左浮动
        "imageright",          // 图片右浮动
        "imagecenter",         // 图片居中
        "|",
        "simpleupload",        // 单图上传
        "insertimage",         // 多图上传
        "emotion",             // 表情
        "scrawl",              // 涂鸦
        "insertvideo",         // 视频
        "attachment",          // 附件
        "insertframe",         // 插入Iframe
        "insertcode",          // 插入代码
        "pagebreak",           // 分页
        "template",            // 模板
        "background",          // 背景
        "formula",             // 公式
        "|",
        "horizontal",          // 分隔线
        "date",                // 日期
        "time",                // 时间
        "spechars",            // 特殊字符
        "wordimage",           // Word图片转存
        "|",
        "inserttable",         // 插入表格
        "deletetable",         // 删除表格
        "insertparagraphbeforetable",     // 表格前插入行
        "insertrow",           // 前插入行
        "deleterow",           // 删除行
        "insertcol",           // 前插入列
        "deletecol",           // 删除列
        "mergecells",          // 合并多个单元格
        "mergeright",          // 右合并单元格
        "mergedown",           // 下合并单元格
        "splittocells",        // 完全拆分单元格
        "splittorows",         // 拆分成行
        "splittocols",         // 拆分成列
        "contentimport",       // 内容导入（支持Word、Markdown）
        "|",
        "print",               // 打印
        "preview",             // 预览
        "searchreplace",       // 查询替换
        "help",                // 帮助
    ]
]
```

### toolbarCallback

自定义工具栏按钮点击，返回 true 表示已经处理点击，会阻止默认事件。

```js
{
    toolbarCallback: function(cmd, editor) {
      // switch(cmd){
      //   case 'insertimage':
      //     editor.execCommand('insertHtml', '<p><img src="xxxxx" /></p>');
      //     console.log('toolbarCallback',cmd, editor)
      //     return true;
      //   case 'insertvideo':
      //     editor.execCommand('insertHtml', '<p><img src="xxxxx" /></p>');
      //     console.log('toolbarCallback',cmd, editor)
      //     return true;
      // }
    }
}
```

### imageConfig

图片配置

```js
{
    imageConfig: {
        // 禁止本地上传
        disableUpload: false,
            // 禁止在线管理
            disableOnline: false,
            // 自定义选择按钮
            selectCallback: null,
        // selectCallback: function(editor,cb){
        //     console.log('selectCallback',cb);
        //     setTimeout(function(){
        //       cb({
        //         path:'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        //         name:'测试图片'
        //       });
        //     },1000);
        // }
    }
}
```

### videoConfig

插入视频配置

```js
{
    videoConfig: {
        // 禁止本地上传,
        disableUpload: false,
            // 自定义选择按钮
            selectCallback: null,
        // selectCallback: function(editor,cb){
        //     console.log('selectCallback',cb);
        //     setTimeout(function(){
        //       cb({
        //         path:'https://www.bilibili.com/video/BV1y44y1g7NR?spm_id_from=333.1007.tianma.1-1-1.click',
        //         name:'测试视频'
        //       });
        //     },1000);
        // }
    }
}
```

### formulaConfig

公式配置

```js
{
    formulaConfig: {
        // 公式渲染链接模板
        imageUrlTemplate: 'https://latex.codecogs.com/svg.image?{}',
        // 为了更稳定的公式渲染服务，可以使用
        // 魔众官方公式转图片渲染引擎 https://api.tecmz.com
    }
}
```

### autoSaveEnable

自动保存，开启自动保存，默认为 `true`

### autoSaveRestore

自动保存，自动恢复，默认为 `false`

### autoSaveKey

自动保存键，多个编辑器可以使用不同的键，默认为 `null`

### initialContent

初始化编辑器的内容，也可以通过 textarea/script 给值

```js
{
    initialContent: '<p>初始化内容</p>'
}
```

### focus

初始化时，是否让编辑器获得焦点，默认为 `false`

### initialStyle

编辑区自定义样式，如果自定义，最好给 p 标签如下的行高，要不输入中文时，会有跳动感

```js
{
    initialStyle: 'p{line-height:1.5em}'
}
```

### indentValue

首行缩进距离,默认是 2em

### initialFrameWidth

初始化编辑器宽度,默认 1000

### initialFrameHeight

初始化编辑器高度,默认 320

### readonly

编辑器初始化结束后,编辑区域是否是只读的，默认是 `false`

### autoClearEmptyNode

getContent时，是否删除空的inlineElement节点（包括嵌套的情况）

### fullscreen

是否开启初始化时即全屏，默认为 `false`

### allHtmlEnabled

提交到后台的数据是否包含整个html字符串，默认为 `false`

### enableContextMenu

打开右键菜单功能，默认为 `true`

### shortcutMenu

快捷菜单

```js
[
  "fontfamily",   // 字体
  "fontsize",     // 字号
  "bold",         // 加粗
  "italic",       // 斜体
  "underline",    // 下划线
  "strikethrough",// 删除线
  "fontborder",   // 字符边框
  "forecolor",    // 字体颜色
  // "shadowcolor", // 字体阴影
  // "backcolor",   // 背景色
  "justifyleft",    // 居左对齐
  "justifycenter",  // 居中对齐
  "justifyright",   // 居右对齐
  "justifyjustify", // 两端对齐
  // "textindent",  // 首行缩进
  // "rowspacingtop",     // 段前距
  // "rowspacingbottom",  // 段后距
  // "outpadding",        // 两侧距离
  "lineheight",           // 行间距
  // "letterspacing" ,    // 字间距
  "insertorderedlist",    // 有序列表
  "insertunorderedlist",  // 无序列表
  "superscript",    // 上标
  "subscript",      // 下标
  "link",           // 超链接
  "unlink",         // 取消链接
  "touppercase",    // 字母大写
  "tolowercase"     // 字母小写
]
```

### elementPathEnabled

是否启用元素路径，默认是显示

### wordCount

是否开启字数统计，默认为 `true`

### maximumWords

允许的最大字符数，默认为 `10000`

### maxUndoCount

可以最多撤销退回的次数，默认 `20`

### maxInputCount

当输入的字符数超过该值时，保存一次现场

### autoHeightEnabled

自动高度，开启自动高度，默认为 `true`

### catchRemoteImageEnable

远程图片，开启远程图片，默认为 `true`

### allowDivTransToP

允许进入编辑器的 div 标签自动变成 p 标签，默认为 true

### rgb2Hex

默认产出的数据中的color自动从rgb格式变成16进制格式，默认为 true

### autotypeset

自动排版

```js
{
    // 自动排版参数
    autotypeset: {
        // 合并空行
        mergeEmptyline: true,
        // 去掉冗余的class
        removeClass: true,
        // 去掉空行
        removeEmptyline: false,
        // 段落的排版方式，可以是 left,right,center,justify 去掉这个属性表示不执行排版
        textAlign: "left",
        // 图片的浮动方式，独占一行剧中,左右浮动，默认: center,left,right,none 去掉这个属性表示不执行排版
        imageBlockLine: "center",
        // 根据规则过滤没事粘贴进来的内容
        pasteFilter: false,
        // 去掉所有的内嵌字号，使用编辑器默认的字号
        clearFontSize: false,
        // 去掉所有的内嵌字体，使用编辑器默认的字体
        clearFontFamily: false,
        // 去掉空节点
        removeEmptyNode: false,
        // 可以去掉的标签
        removeTagNames: { div: 1 },
        // 行首缩进
        indent: false,
        // 行首缩进的大小
        indentValue: "2em",
        // 全角转半角
        bdc2sb: false,
        // 半角转全角
        tobdc: false
    }
}
```

## UE.Editor方法

### ready

`ready(Function fn)`

- `fn` 编辑器ready之后所执行的回调, 如果在注册事件之前编辑器已经ready，将会 立即触发该回调。

编辑器初始化完成后的回调

```js
editor.ready(function(){
    console.log('编辑器初始化完成');
    // 编辑器家在完成后，让编辑器拿到焦点 
    editor.execCommand( 'focus' );
});
```

### setOpt

`setOpt(String key, * val)`

- `key` 编辑器的可接受的选项名称
- `val` 编辑器的可接受的选项值
  该方法是提供给插件里面使用，设置配置项默认值

`setOpt(Object options)`

- `options` 编辑器的可接受的选项对象


该方法是提供给插件里面使用，以{key:value}集合的方式设置插件内用到的配置项默认值

> 警告： 三处设置配置项的优先级: 实例化时传入参数 > setOpt()设置 > config文件里设置
> 警告： 该方法仅供编辑器插件内部和编辑器初始化时调用，其他地方不能调用。

```js
editor.setOpt( 'initContent', '欢迎使用编辑器' );
editor.setOpt( {
  'initContent': '欢迎使用编辑器'
} );
```


### destroy

销毁编辑器实例，使用textarea代替

```js
editor.destroy();
```

### render

`render(String containerId)`

- `containerId` 编辑器容器的id

渲染编辑器的DOM到指定容器

`render(Element containerDom)`

- `containerDom` 编辑器容器的DOM对象

> 提示： 执行该方法，会触发ready事件，必须且只能调用一次

### sync

`sync()`

同步数据到编辑器所在的form 从编辑器的容器节点向上查找form元素，若找到，就同步编辑内容到找到的form里，为提交数据做准备，主要用于是手动提交的情况 后台取得数据的键值，使用你容器上的name属性，如果没有就使用参数里的textarea项


`sync(String formID)`

- `formID` 同步到的表单的id

根据传入的formId，在页面上查找要同步数据的表单，若找到，就同步编辑内容到找到的form里，为提交数据做准备 后台取得数据的键值，该键值默认使用给定的编辑器容器的name属性，如果没有name属性则使用参数项里给定的“textarea”项

```js
editor.sync();
```

### setHeight

`setHeight(Number number)`

- `number` 设置的高度值，纯数值，不带单位

设置编辑器高度， 当配置项autoHeightEnabled为真时，该方法无效

```js
editor.setHeight(300);
```

### addshortcutkey

`addshortcutkey(Object keyset)`

- `keyset` 命令名和快捷键键值对对象，多个按钮的快捷键用“＋”分隔

为编辑器的编辑命令提供快捷键 这个接口是为插件扩展提供的接口,主要是为新添加的插件，如果需要添加快捷键，所提供的接口

`addshortcutkey(String cmd, String keys)`

- `cmd` 触发快捷键时，响应的命令
- `keys` 快捷键的字符串，多个按钮用“＋”分隔

```js
editor.addshortcutkey({
   "Bold" : "ctrl+66",//^B
   "Italic" : "ctrl+73", //^I
});
editor.addshortcutkey("Underline", "ctrl+85");
```

### getContent

`getContent()`

- 返回 编辑器的内容字符串

编辑器的内容字符串, 如果编辑器的内容为空，或者是空的标签内容（如:`<p><br/></p>`）， 则返回空字符串

`getContent(Function fn)`

- `fn` 自定的判空规则， 要求该方法返回一个boolean类型的值， 代表当前编辑器的内容是否空， 如果返回true， 则该方法将直接返回空字符串；如果返回false，则编辑器将返回 经过内置过滤规则处理后的内容。
- 返回 编辑器的内容字符串

获取编辑器的内容。 可以通过参数定义编辑器内置的判空规则。

该方法在处理包含有初始化内容的时候能起到很好的作用。该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容。

```js
// 编辑器html内容:<p>1<strong>2<em>34</em>5</strong>6</p>
// 返回值:<p>1<strong>2<em>34</em>5</strong>6</p>
var content = editor.getContent();
// editor 是一个编辑器的实例
var content = editor.getContent( function ( editor ) {
  return editor.body.innerHTML === '欢迎使用UEditor'; //返回空字符串
} );
```

### getAllHtml

`getAllHtml()`

- 返回 编辑器的内容字符串

取得完整的html代码，可以直接显示成完整的html文档

### getContentTxt

得到编辑器的纯文本内容，但会保留段落格式

```js
var value = editor.getContentTxt();
```

```js
//编辑器html内容:<p><strong>1</strong></p><p><strong>2</strong></p>
console.log(editor.getPlainTxt()); //输出:"1\n2\n
```

### getContentTxt

`getContentTxt()`

获取编辑器中的纯文本内容,没有段落格式

```js
//编辑器html内容:<p><strong>1</strong></p><p><strong>2</strong></p>
//输出:12
var value = editor.getContentTxt();
```

### setContent

`setContent(String html)`

- `html` 要设置的内容

设置编辑器的内容，可修改编辑器当前的html内容

`setContent(String html, Boolean isAppendTo)`

- `html` 要设置的内容
- `isAppendTo` 若传入true，不清空原来的内容，在最后插入内容，否则，清空内容再插入

通过该方法插入的内容，是经过编辑器内置的过滤规则进行过滤后得到的内容。该方法会触发selectionchange事件。

```js
editor.setContent('<p>测试内容</p>');
// 假设设置前的编辑器内容是 <p>old text</p>
// 插入的结果是<p>old text</p><p>new text</p>
editor.setContent('<p>new text</p>', true); 
```

### focus

`focus()`

让编辑器获得焦点，默认focus到编辑器头部

`focus(Boolean toEnd)`

- `toEnd` 默认focus到编辑器头部，toEnd为true时focus到内容尾部

让编辑器获得焦点，toEnd确定focus位置

```js
editor.focus();
editor.focus(true)
```

### hasContents

`hasContents()`

检查编辑区域中是否有内容

`hasContents(Array tags)`

- `tags` 传入数组判断时用到的节点类型
- 返回 若文档中包含tags数组里对应的tag，返回true，否则返回false

检查编辑区域中是否有内容，若包含参数tags中的节点类型，直接返回true

默认有文本内容，或者有以下节点都不认为是空 table,ul,ol,dl,iframe,area,base,col,hr,img,embed,input,link,meta,param

```js
editor.hasContents();
editor.hasContents(['span']);
```

### reset

重置编辑器，可用来做多个tab使用同一个编辑器实例

此方法会清空编辑器内容，清空回退列表，会触发reset事件

```js
editor.reset()
```

### setEnabled

设置编辑器是否可用

```js
editor.setEnabled();
```

### setDisabled

`setDisabled()`

设置当前编辑区域不可编辑

`setDisabled(Array except)`

- `except` 传入数组，例外命令的字符串

即使设置了disable，此处配置的例外命令仍然可以执行

```js
editor.setDisabled();
// 禁用工具栏中除加粗之外的所有功能
editor.setDisabled('bold');
// 禁用工具栏中除加粗和插入图片之外的所有功能
editor.setDisabled(['bold','insertimage']); 
```

### setShow

显示编辑器

```js
editor.setShow();
```

### setHide

隐藏编辑器

```js
editor.setHide();
```

### getLang

`getLang(String path)`

- `path` 路径根据的是lang目录下的语言文件的路径结构
- 返回 根据路径返回语言资源的Json格式对象或者语言字符串

根据指定的路径，获取对应的语言资源

```js
// 如果当前是中文，那返回是的是'删除'
editor.getLang('contextMenu.delete'); 
```

### getContentLength

`getContentLength()`

获取编辑器内容的长度

`getContentLength(Boolean ingoneHtml)`

- `ingoneHtml` 传入true时，只按照纯文本来计算
- 返回 返回计算的长度，内容中有hr/img/iframe标签，长度加1

```js
//编辑器html内容<p><strong>132</strong></p>
// 返回27
editor.getContentLength()
// 编辑器html内容<p><strong>132</strong></p>
// 返回3
editor.getContentLength(true)
```

### addInputRule

`addInputRule(Function rule)`

- `rule` 要添加的过滤规则

注册输入过滤规则

```js
editor.addInputRule(function(root){
   $.each(root.getNodesByTagName('div'),function(i,node){
       node.tagName="p";
   });
});
```

### filterInputRule

`filterInputRule(UE.uNode root)`

- `root` 要过滤的uNode节点

执行注册的过滤规则

执行editor.setContent方法和执行'inserthtml'命令后，会运行该过滤函数

```js
editor.filterInputRule(editor.body);
```

### addOutputRule

`addOutputRule(Function rule)`

- `rule` 要添加的过滤规则

```js
editor.addOutputRule(function(root){
   $.each(root.getNodesByTagName('p'),function(i,node){
       node.tagName="div";
   });
});
```

### filterOutputRule

`filterOutputRule(UE.uNode root)`

- `root` 要过滤的uNode节点

根据输出过滤规则，过滤编辑器内容，执行editor.getContent方法的时候，会先运行该过滤函数

```js
editor.filterOutputRule(editor.body);
```

### getPlainTxt

获取编辑器纯文本内容，但会保留段落格式

```js
editor.getPlainTxt();
```

### clear

清空编辑器内容

```js
editor.clear();
```

### execCommand

执行编辑命令，该方法的第一个参数是需要执行的命令。剩下的可选的参数根据每个命令的不同而有一些差异， 具体请参照相应的命令详情。

```js
editor.execCommand( String cmd, * params... )
```

### queryCommandState

查询给定命令在当前选区内的状态。通用的返回状态有：

- 1 => 代表当前命令在当前选区内已执行
- 0 => 代表当前命令在当前选区内未执行， 但处于可用状态
- -1 => 代表当前命令在当前选区内处于不可用状态

```js
let state = editor.queryCommandState( String cmd )
```

### queryCommandValue

查询给定命令在当前选区内的值， 默认返回undefined。根据命令的不同其返回值也会不同。

```js
let value = editor.queryCommandValue()
```

### loadServerConfig

执行这个方法，会向后端请求config

### isServerConfigLoaded

判断是否已加载后端config

### afterConfigReady

加载后端配置项结束后会执行回调函数，假如已加载，立即执行该回调函数

## UE.EventBase方法

### addListener

`addListener(String types, Function fn)`

- `types` 监听的事件名称，同时监听多个事件使用空格分隔
- `fn` 监听的事件被触发时，会执行该回调函数

```js
editor.addListener('selectionchange',function(){
    console.log("选区已经变化！");
})
editor.addListener('beforegetcontent aftergetcontent',function(type){
     if(type == 'beforegetcontent'){
         //do something
     }else{
         //do something
     }
     console.log(this.getContent) // this是注册的事件的编辑器实例
})
```

### removeListener

`removeListener(String types, Function fn)`

- `types` 移除的事件名称，同时移除多个事件使用空格分隔
- `fn` 要移除的事件回调函数

```js
// changeCallback为方法体
editor.removeListener("selectionchange",changeCallback);
```

### fireEvent

`fireEvent(String types)`

- `types` 触发的事件名称，同时触发多个事件使用空格分隔
- 返回 返回触发事件的队列中，最后执行的回调函数的返回值

`fireEvent(String types, *... options)`

- `types` 触发的事件名称，同时触发多个事件使用空格分隔
- `options` 可选参数，可以传入一个或多个参数，会传给事件触发的回调函数
- 返回 返回触发事件的队列中，最后执行的回调函数的返回值

```js
editor.fireEvent("selectionchange");

editor.addListener( "selectionchange", function ( type, arg1, arg2 ) {
  console.log( arg1 + " " + arg2 );
} );
// 触发selectionchange事件， 会执行上面的事件监听器
// output: Hello World
editor.fireEvent("selectionchange", "Hello", "World");
```

## UE.uNode方法

### toHtml

`toHtml()`

- 返回 返回转换后的html字符串

`toHtml(Boolean formatter)`

- `formatter` 是否格式化输出，默认为false
- 返回 返回转换后的html字符串

当前节点对象，转换成html文本

```js
node.toHtml();
node.toHtml( true );
```

### innerHTML

`innerHTML()`

获取节点的html内容，假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点

```js
var htmlstr = node.innerHTML();
```

### innerHTML

`innerHTML(String htmlstr)`

- `htmlstr` 要设置的html字符串
- 返回 节点本身

设置节点的html内容，假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点

```js
node.innerHTML('<span>text</span>');
```

### innerText

`innerText()`

获取节点的纯文本内容 ，假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点

```js
var htmlstr = node.innerText();
```

### innerText

`innerText(String htmlstr)`

- `htmlstr` 传入要设置的文本内容
- 返回 节点本身

设置节点的纯文本内容 ，假如节点的type不是'element'，或节点的标签名称不在dtd列表里，直接返回当前节点

```js
node.innerText('text');
```

### getData

`getData()`

- 返回 若节点的type值是elemenet，返回空字符串，否则返回节点的data属性

获取当前对象的data属性

```js
node.getData();
```

### firstChild

`firstChild()`

- 返回 返回当前节点的第一个子节点

### lastChild

`lastChild()`

- 返回 返回当前节点的最后一个子节点

### previousSibling

`previousSibling()`

- 返回 返回当前节点的前一个兄弟节点

### nextSibling

`nextSibling()`

- 返回 返回当前节点的后一个兄弟节点

### replaceChild

`replaceChild(UE.uNode target, UE.uNode source)`

- `target` 要替换成该节点参数
- `source` 要被替换掉的节点

替换当前节点的子节点

```js
node.replaceChild(newNode, oldNode);
```

### appendChild

`appendChild(UE.uNode node)`

- `node` 要添加的节点

在节点的子节点列表最后位置插入一个节点


### insertBefore

`insertBefore(UE.uNode node, UE.uNode refNode)`

- `node` 要插入的节点
- `refNode` 要插入的参考节点

在节点的子节点列表中，参考节点前面插入一个节点

### insertAfter

`insertAfter(UE.uNode node, UE.uNode refNode)`

- `node` 要插入的节点
- `refNode` 要插入的参考节点

在节点的子节点列表中，参考节点后面插入一个节点

### removeChild

`removeChild(UE.uNode node, Boolean keepChildren)`

- `node` 要删除的节点
- `keepChildren` 是否保留移除节点的子节点，若传入true，自动把移除节点的子节点插入到移除的位置
- 返回 刚移除的子节点

从当前节点的子节点列表中，移除节点

### getAttr

`getAttr(String attrName)`

- `attrName` 要获取的属性名

### setAttr

`setAttr(String attrName, String attrVal)`

- `attrName` 要设置的属性名
- `attrVal` 要设置的属性值

### getIndex

`getIndex()`

获取当前节点在父节点下的位置索引，返回索引数值，如果没有父节点，返回-1


### getNodeById

`getNodeById(String id)`

- `id` 要查找的节点id

### getNodeByTagName

`getNodeByTagName(String tagName)`

- `tagName` 要查找的节点标签名

### getStyle

`getStyle(String styleName)`

- `styleName` 要获取的样式名

```js
node.getStyle('font-size');
```

### setStyle

`setStyle(String styleName, String styleVal)`

- `styleName` 要设置的样式名
- `styleVal` 要设置的样式值

```js
node.setStyle('font-size', '12px');
```

### traversal

`traversal(Function fn)`

- `fn` 遍历时的回调函数

遍历当前节点的子节点，执行回调函数

```js
node.traversal(function(node){
    console.log(node);
});
```


## 编辑器命令

### anchor

插入锚点

```js
editor.execCommand('anchor', 'anchor1');
```

### autosubmit

提交表单

```js
editor.execCommand( 'autosubmit' );
```

### autotypeset

对当前编辑器的内容执行自动排版， 排版的行为根据config配置文件里的“autotypeset”选项进行控制。

```js
editor.execCommand( 'autotypeset' );
```

### bold

字体加粗

```js
// 第一次执行， 文本内容加粗
editor.execCommand( 'bold' );
// 第二次执行， 文本内容取消加粗
editor.execCommand( 'bold' );
```

### italic

字体倾斜

```js
// 第一次操作， 文本内容将变成斜体
editor.execCommand( 'italic' );
// 再次对同一文本内容执行， 则文本内容将恢复正常
editor.execCommand( 'italic' );
```

### subscript

下标文本，与“superscript”命令互斥

```js
// 第一次操作， 文本内容将变成下标文本
editor.execCommand( 'subscript' );
// 再次对同一文本内容执行， 则文本内容将恢复正常
editor.execCommand( 'subscript' );
```

### superscript

上标文本，与“subscript”命令互斥

```js
// 第一次操作， 文本内容将变成上标文本
editor.execCommand( 'superscript' );
// 再次对同一文本内容执行， 则文本内容将恢复正常
editor.execCommand( 'superscript' );
```

### blockquote

添加引用

```js
editor.execCommand( 'blockquote' );
editor.execCommand( 'blockquote',{
    style: "color: red;"
} );
```

### cleardoc

清空文档

```js
editor.execCommand('cleardoc');
```

### touppercase

把选区内文本变大写，与“tolowercase”命令互斥

```js
editor.execCommand( 'touppercase' );
```

### tolowercase

把选区内文本变小写，与“touppercase”命令互斥

```js
editor.execCommand( 'tolowercase' );
```

### customstyle

根据config配置文件里“customstyle”选项的值对匹配的标签执行样式替换。

```js
editor.execCommand( 'customstyle' );
```

### directionality

文字输入方向

```js
editor.execCommand( 'directionality', 'ltr');
var value = editor.queryCommandValue( 'directionality');
```

### forecolor

字体颜色

```js
editor.execCommand( 'forecolor', '#000' );
var value = editor.queryCommandValue( 'forecolor' );
```

### backcolor

字体背景颜色

```js
editor.execCommand( 'backcolor', '#000' );
var value = editor.queryCommandValue( 'backcolor' );
```

### fontsize

字体大小

```js
editor.execCommand( 'fontsize', '14px' );
var value = editor.queryCommandValue( 'fontsize' );
```

### fontfamily

字体样式

```js
editor.execCommand( 'fontfamily', '微软雅黑' );
var value = editor.queryCommandValue( 'fontfamily' );
```

### underline

字体下划线,与删除线互斥

```js
editor.execCommand( 'underline' );
```

### strikethrough

字体删除线,与下划线互斥

```js
editor.execCommand( 'strikethrough' );
```

### fontborder

字体边框

```js
editor.execCommand( 'fontborder' );
```

### formatmatch

格式刷

```js
editor.execCommand( 'formatmatch' );
```

### horizontal

插入分割线

```js
editor.execCommand( 'horizontal' );
```

### imagefloat

图片对齐方式

```js
editor.execCommand( 'imagefloat', 'left' );
editor.execCommand( 'imagefloat', 'right' );
editor.execCommand( 'imagefloat', 'center' );
editor.execCommand( 'imagefloat', 'none' );
var value = editor.queryCommandValue( 'imagefloat' );
```

### insertimage

插入图片

```js
editor.execCommand( 'insertimage', {
 src:'a/b/c.jpg',
 width:'100',
 height:'100'
} );

editor.execCommand( 'insertimage', [{
    src:'a/b/c.jpg',
    width:'100',
    height:'100'
},{
    src:'a/b/d.jpg',
    width:'100',
    height:'100'
}] );
```

### indent

缩进

```js
editor.execCommand( 'indent' );
```

### insertcode

插入代码

```js
editor.execCommand( 'insertcode', 'javascript' );
// 返回代码的语言
var value = editor.queryCommandValue( 'insertcode' );
```

### inserthtml

插入html代码

```
// xxx[BB]xxx 当前选区为非闭合选区，选中BB这两个文本
// 执行命令，插入<b>CC</b>
// 插入后的效果 xxx<b>CC</b>xxx
// <p>xx|xxx</p> 当前选区为闭合状态
// 插入<p>CC</p>
// 结果 <p>xx</p><p>CC</p><p>xxx</p>
// <p>xxxx</p>|</p>xxx</p> 当前选区在两个p标签之间
// 插入 xxxx
// 结果 <p>xxxx</p><p>xxxx</p></p>xxx</p>
```

### insertparagraph

插入段落

```js
editor.execCommand( 'insertparagraph' );
```

### justify

段落对齐方式

```js
left => 居左，right => 居右，center => 居中，justify => 两端对齐
editor.execCommand( 'justify', 'center' );
var value = editor.queryCommandValue( 'justify' );
```

### lineheight

行距

```js
editor.execCommand( 'lineheight', 1.5);
var value = editor.queryCommandValue( 'lineheight' );
```

### link

插入超链接

```js
editor.execCommand( 'link', {
     url:'modstart.com',
     title:'ueditor',
     target:'_blank'
 } );
// Element 超链接节点
var value = editor.queryCommandValue( 'link' );
```

### unlink

取消超链接

```js
editor.execCommand( 'unlink');
```

### insertorderedlist

有序列表，与“insertunorderedlist”命令互斥

```js
// 返回当前有序列表的类型，值为null或decimal,lower-alpha,lower-roman,upper-alpha,upper-roman,cn,cn1,cn2,num,num1,num2
editor.queryCommandValue( 'insertorderedlist' );
// 返回当前有序列表的类型，值为null或decimal,lower-alpha,lower-roman,upper-alpha,upper-roman,cn,cn1,cn2,num,num1,num2
var value = editor.queryCommandValue( 'insertorderedlist' );
```

### insertunorderedlist

无序列表，与“insertorderedlist”命令互斥

```js
// 插入的有序列表类型，值为：decimal,lower-alpha,lower-roman,upper-alpha,upper-roman,cn,cn1,cn2,num,num1,num2
editor.execCommand( 'insertunorderedlist','decimal');
// 如果当前选区是有序列表返回1，否则返回0
var value = editor.queryCommandValue( 'insertunorderedlist' );
```

### music

插入音乐

```js
editor.execCommand( 'music' , {
     width: 400,
     height: 95,
     align: "center",
     url: "音乐地址"
 } );
```

### pagebreak

插入分页符

获取编辑器内的数据时， 编辑器会把分页符转换成“_ueditor_page_break_tag_”字符串， 以便于提交数据到服务器端后处理分页。

```js
// 插入一个hr标签，带有样式类名pagebreak
editor.execCommand( 'pagebreak'); 
```

### paragraph

段落格式

```js
// 标签值为：'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
editor.execCommand( 'paragraph','h1',{
     class:'test'
 } );
// String 节点标签名
var value = editor.queryCommandValue( 'Paragraph' );
```

### preview

预览

```js
editor.execCommand( 'preview' );
```

### print

打印

```js
editor.execCommand( 'print' );
```

### pasteplain

启用或取消纯文本粘贴模式

```js
editor.execCommand( 'pasteplain' );
// 如果处于纯文本模式，返回1，否则，返回0
var value = editor.queryCommandValue( 'pasteplain' );
```

### removeformat

`execCommand('removeformat', String tags, String style, String attrs)`

- `tags` 以逗号隔开的标签。如：strong
- `style` 样式如：color
- `attrs` 属性如:width

清除文字样式

```js
// 以逗号隔开的标签。如：strong
// 样式如：color
// 属性如:width
editor.execCommand( 'removeformat', 'strong','color','width' );
```

### rowspacing

设置段间距

```js
// 段间距的值，以px为单位
// 间距位置，top或bottom，分别表示段前和段后
editor.execCommand( 'rowspacing', '10', 'top' );
```

### selectall

选中所有内容

```js
editor.execCommand( 'selectall' );
```

### source

切换源码模式和编辑模式

```js
editor.execCommand( 'source');
// 如果当前是源码编辑模式，返回1，否则返回0
var value = editor.queryCommandValue( 'source' );
```

### time

插入时间，默认格式：12:59:59

```js
editor.execCommand( 'time');
```

### date

插入日期，默认格式：2013-08-30

```js
editor.execCommand( 'date');
```

### undo

撤销上一次执行的命令

```js
editor.execCommand( 'undo' );
```

### redo

重做上一次执行的命令

```js
editor.execCommand( 'redo' );
```

### insertvideo

插入视频

```js
var videoAttr = {
      //视频地址
      url: 'http://www.youku.com/xxx',
      //视频宽高值， 单位px
      width: 200,
      height: 100
};

//editor 是编辑器实例
//向编辑器插入单个视频
editor.execCommand( 'insertvideo', videoAttr );

var videoAttr1 = {
    //视频地址
    url: 'http://www.youku.com/xxx',
    //视频宽高值， 单位px
    width: 200,
    height: 100
},
videoAttr2 = {
    //视频地址
    url: 'http://www.youku.com/xxx',
    //视频宽高值， 单位px
    width: 200,
    height: 100
}

//editor 是编辑器实例
//该方法将会向编辑器内插入两个视频
editor.execCommand( 'insertvideo', [ videoAttr1, videoAttr2 ] );

// 如果当前光标所在处的元素是一个视频对象， 则返回1，否则返回0
var value = editor.queryCommandState( 'insertvideo' );
```

### inserthtml

插入 html

```js
editor.execCommand('inserthtml', '<p>测试内容</p>');
```

### get\_auto\_save\_content

获取草稿箱内容

```js
let draft = editor.execCommand('get_auto_save_content');
```

### clear\_auto\_save\_content

清空草稿箱内容

```js
editor.execCommand('clear_auto_save_content');
```

### set\_auto\_save\_content

草稿箱立即保存

```js
editor.execCommand('set_auto_save_content');
```

### auto\_save\_restore

草稿箱立即恢复

```js
editor.execCommand('auto_save_restore');
```

### cleardoc

清空文档

```js
editor.execCommand('cleardoc');
```

### focus

聚焦编辑器

```js
editor.execCommand('focus');
```

### preview

预览

```js
editor.execCommand('preview');
```

### undo

撤销

```js
editor.execCommand('undo');
```

### redo

重做

```js
editor.execCommand('redo');
```

## 编辑器事件监听

### ready

编辑器准备就绪后会触发该事件

```js
editor.addListener("ready", function () {
    console.log('编辑器初始化完成');
})
```

### destroy

执行destroy方法,会触发该事件

```js
editor.addListener("destroy", function () {
    console.log('编辑器已经销毁');
})
```

### reset

执行reset方法,会触发该事件

### focus

执行focus方法,会触发该事件

### langReady

语言包加载完成后会触发该事件

### beforeExecCommand

运行命令之前会触发该命令

### afterExecCommand

运行命令之后会触发该命令

### firstBeforeExecCommand

运行命令之前会触发该命令

### beforeGetContent

在getContent方法执行之前会触发该事件

### afterGetContent

在getContent方法执行之后会触发该事件

### getAllHtml

在getAllHtml方法执行时会触发该事件

### beforeSetContent

在setContent方法执行之前会触发该事件

### afterSetContent

在setContent方法执行之后会触发该事件

### selectionchange

每当编辑器内部选区发生改变时，将触发该事件

```js
editor.addListener('selectionchange', function(){
    console.log('选区改变');
});
```

### beforeSelectionChange

在所有selectionchange的监听函数执行之前，会触发该事件

### afterSelectionChange

在所有selectionchange的监听函数执行完之后，会触发该事件


### contentChange

编辑器内容发生改变时会触发该事件

```js
editor.addListener("contentchange", function () {
    console.log('编辑器内容发生改变');
})
```

### serverConfigLoaded

加载后端配置项结束后，会触发这个事件

```js
editor.addListener("serverConfigLoaded", function () {
    console.log('加载后端配置项结束');
})
```

## 公共属性/方法

### UE.Editor

UEditor的核心类，为用户提供与编辑器交互的接口。

```js
// 以默认参数构建一个编辑器实例
new Editor()
// 以给定的参数集合创建一个编辑器实例，对于未指定的参数，将应用默认参数。
new Editor(Object setting)
```

### UE.EventBase

UE采用的事件基类，继承此类的对应类将获取addListener,removeListener,fireEvent方法。 在UE中，Editor以及所有ui实例都继承了该类，故可以在对应的ui对象以及editor对象上使用上述方法。

- `addListener(String types, Function fn)` 注册事件监听器
- `removeListener(String types, Function fn)` 移除事件监听器
- `fireEvent(String types)` 触发事件
- `fireEvent(String types, *... options)` 触发事件

通过此构造器，子类可以继承EventBase获取事件监听的方法

```js
UE.EventBase.call(editor);
```

### UE.uNode

编辑器模拟的节点类

通过一个键值对，创建一个uNode对象

```js
var node = new uNode({
   type:'element',
   tagName:'span',
   attrs:{style:'font-size:14px;'}
}
```

### UE.dom.Range

Range实现类，本类是UEditor底层核心类，封装不同浏览器之间的Range操作。

`Range(Document document)`

创建一个跟document绑定的空的Range实例

> 待整理，请参考 <a href="/ueditor-plus/ueditor-api.html" target="_blank">ueditor-api</a>

### UE.dom.Selection

选区集合

> 待整理，请参考 <a href="/ueditor-plus/ueditor-api.html" target="_blank">ueditor-api</a>

### UE.dom.domUtils

Dom操作工具包

> 待整理，请参考 <a href="/ueditor-plus/ueditor-api.html" target="_blank">ueditor-api</a>

### UE.ajax

提供对ajax请求的支持

> 待整理，请参考 <a href="/ueditor-plus/ueditor-api.html" target="_blank">ueditor-api</a>

### UE.browser

提供浏览器检测的模块

> 待整理，请参考 <a href="/ueditor-plus/ueditor-api.html" target="_blank">ueditor-api</a>

### UE.utils

静态工具函数

> 待整理，请参考 <a href="/ueditor-plus/ueditor-api.html" target="_blank">ueditor-api</a>

### UE.getEditor

获取编辑器实例

```js
let editor = UE.getEditor('editor', {
    // 配置
});
```

### UE.getListener

`getListener(Object obj, String type, Boolean force)`

- `obj` 查询监听器的对象
- `type` 事件类型
- `force` 为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组

获得对象所拥有监听类型的所有监听器

### UE.filterNode

`filterNode(Object root, Object rules)`

- `root` 指定root节点
- `rules` 过滤规则json对象

根据传入节点和过滤规则过滤相应节点

```js
UE.filterNode(root, editor.options.filterRules);
```

### UE.filterWord

`filterWord(String html)`

- `html` html字符串

根据传入html字符串过滤word

### UE.htmlparser

`htmlparser(String htmlstr, Boolean ignoreBlank)`

- `htmlstr` 要转换的html代码
- `ignoreBlank` 是否忽略空格
- 返回 给定的html片段转换形成的uNode对象

html字符串转换成uNode节点的静态方法

```js
var root = UE.htmlparser('<p><b>htmlparser</b></p>', true);
```











