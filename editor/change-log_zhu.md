# 定制化修改记录

## act:20240701155304|让代码段保留Tab作为缩进（不转为空格） 2024-07-01
//zhu:act:20240701155304|让代码段保留Tab作为缩进（不转为空格）


实现：[代码语言]框（\<pre\>）中键入Tab时保留Tab（不转成空格）
```
ueditor.all.js
  /_src/plugins/insertcode.js
\third-party\SyntaxHighlighter\shCore.js
\third-party\SyntaxHighlighter\shCoreDefault.css
```

## act:20240701194114|优化内容展示页代码高亮样式  2024-07-01
//zhu:act:20240701194114|优化内容展示页代码高亮样式

优化内容展示页代码高亮样式
```
third-party/SyntaxHighlighter/shCore.js
```

## act:20240701160138|粘贴图片/拖入（上传）图片文件 改用base64保存图片  2024-07-01
//zhu:act:20240701160138|粘贴图片/拖入（上传）图片文件 改用base64保存图片

实现：粘贴图片/拖入（上传）图片文件 改用base64保存图片
```
ueditor.all.js
  /_src/plugins/defaultfilter.js
  /_src/plugins/autoupload.js
ueditor.config.js
```

## act:20240701163533|单图片上传 改用base64保存图片		2024-07-01
//zhu:act:20240701163533|单图片上传 改用base64保存图片

实现：单图片上传 改用base64保存图片
```
ueditor.all.js
  /_src/plugins/simpleupload.js
ueditor.config.js
```

## act:20240701184423|多图上传(insertimage)适配图片base64	2024-07-01
//zhu:act:20240701184423|多图上传(insertimage)适配图片base64

实现：多图上传(insertimage)适配图片base64
```
ueditor.all.js
  /_src/plugins/image.js
\dialogs\image\image.html
\dialogs\image\image.js
```