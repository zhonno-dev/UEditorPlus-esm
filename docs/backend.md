# 后端部署说明

## 后端说明

`UEditorPlus` 提供的后端代码仅提供了 `PHP` 的 `Demo` 脚本代码，文件实际并没有真正处理文件，正式部署需要自行实现。

`UEditorPlus` 在静态服务器下，也可以正常加载到容器上，但是上传图片等后台相关的功能是不可以使用的，需要有后台语言支持才能正常使用。

## 配置说明

在编辑器初始化时，需要配置 `serverUrl` 参数，指向后台服务地址。

后端需要返回一下 `JSON` 数据，用于编辑器的初始化基本参数。

```json
{
    // 执行上传图片的action名称，默认值：uploadimage
    "imageActionName": "image",
    // 提交的图片表单名称，默认值：upfile
    "imageFieldName": "file",
    // 上传大小限制，单位B，默认值：2048000
    "imageMaxSize": 10485760,
    // 上传图片格式显示，默认值：[".png", ".jpg", ".jpeg", ".gif", ".bmp"]
    "imageAllowFiles": [
        ".jpg",
        ".png",
        ".jpeg"
    ],
    // 是否压缩图片,默认是true
    "imageCompressEnable": true,
    // 图片压缩最长边限制，默认值：1600
    "imageCompressBorder": 5000,
    // 插入的图片浮动方式，默认值：none
    "imageInsertAlign": "none",
    // 图片访问路径前缀，默认值：空
    "imageUrlPrefix": "",
    
    // 执行上传涂鸦的action名称，默认值：uploadscrawl
    "scrawlActionName": "crawl",
    // 提交的图片表单名称，默认值：upfile
    "scrawlFieldName": "file",
    // 上传大小限制，单位B，默认值：2048000
    "scrawlMaxSize": 10485760,
    // 图片访问路径前缀，默认值：空
    "scrawlUrlPrefix": "",
    // 插入的图片浮动方式，默认值：none
    "scrawlInsertAlign": "none",

    // 执行上传截图的action名称，默认值：uploadimage
    "snapscreenActionName": "snap",
    // 图片访问路径前缀
    "snapscreenUrlPrefix": "",
    // 插入的图片浮动方式，默认值：none
    "snapscreenInsertAlign": "none",
    
    // 例外的图片抓取域名
    "catcherLocalDomain": [
        "127.0.0.1",
        "localhost"
    ],
    // 执行抓取远程图片的action名称，默认值：catchimage
    "catcherActionName": "catch",
    // 提交的图片列表表单名称，默认值：source
    "catcherFieldName": "source",
    // 图片访问路径前缀，默认值：空
    "catcherUrlPrefix": "",
    // 上传保存路径,可以自定义保存路径和文件名格式，默认值：{filename}{rand:6}
    "catcherMaxSize": 10485760,
    // 抓取图片格式显示，默认值：[".png", ".jpg", ".jpeg", ".gif", ".bmp"]
    "catcherAllowFiles": [
        ".jpg",
        ".png",
        ".jpeg"
    ],
    
    // 执行上传视频的action名称，默认值：uploadvideo
    "videoActionName": "video",
    // 提交的视频表单名称，默认值：upfile
    "videoFieldName": "file",
    // 视频访问路径前缀
    "videoUrlPrefix": "",
    // 上传大小限制，单位B，默认值：102400000
    "videoMaxSize": 104857600,
    // 上传视频格式显示
    "videoAllowFiles": [
        ".mp4"
    ],

    // 执行上传文件的action名称，默认值：uploadfile
    "fileActionName": "file",
    // 提交的文件表单名称，默认值：upfile
    "fileFieldName": "file",
    // 文件访问路径前缀
    "fileUrlPrefix": "",
    // 上传保存路径,可以自定义保存路径和文件名格式，默认值：{filename}{rand:6}
    "fileMaxSize": 104857600,
    // 上传文件格式显示
    "fileAllowFiles": [
        ".zip",
        ".pdf",
        ".doc"
    ],

    // 执行图片管理的action名称，默认值：listimage
    "imageManagerActionName": "listImage",
    // 每次列出文件数量
    "imageManagerListSize": 20,
    // 图片访问路径前缀
    "imageManagerUrlPrefix": "",
    // 插入的图片浮动方式，默认值：none
    "imageManagerInsertAlign": "none",
    // 列出的文件类型
    "imageManagerAllowFiles": [
        ".jpg",
        ".png",
        ".jpeg"
    ],
    
    // 执行文件管理的action名称，默认值：listfile
    "fileManagerActionName": "listFile",
    // 指定要列出文件的目录
    "fileManagerUrlPrefix": "",
    // 每次列出文件数量
    "fileManagerListSize": 20,
    // 列出的文件类型
    "fileManagerAllowFiles": [
        ".zip",
        ".pdf",
        ".doc"
    ],
    
    // 公式配置
    "formulaConfig": {
        // 公式渲染的路径
        "imageUrlTemplate": "https://latex.codecogs.com/svg.image?{}"
    }
}
```

## 后端请求规范

### 获取配置

请求参数:

```json
GET {"action": "config"}
POST "upfile": File Data
```

返回格式:

```json
{
    "state": "SUCCESS",
    "url": "upload/demo.jpg",
    "title": "demo.jpg",
    "original": "demo.jpg"
}
```

### uploadimage

请求参数:

```json
GET {"action": "uploadimage"}
POST "upfile": File Data
```

返回格式:

```json
{
    "state": "SUCCESS",
    "url": "upload/demo.jpg",
    "title": "demo.jpg",
    "original": "demo.jpg"
}
```

### uploadscrawl
   
请求参数:

```json
GET {"action": "uploadscrawl"}
POST "content": Base64 Data
```

返回格式:

```json
{
    "state": "SUCCESS",
    "url": "upload/demo.jpg",
    "title": "demo.jpg",
    "original": "demo.jpg"
}
```


### uploadvideo
   
请求参数:

```json
GET {"action": "uploadvideo"}
POST "upfile": File Data
```

返回格式:

```json
{
    "state": "SUCCESS",
    "url": "upload/demo.mp4",
    "title": "demo.mp4",
    "original": "demo.mp4"
}
```


### uploadfile
   
请求参数:

```json
GET {"action": "uploadfile"}
POST "upfile": File Data
```

返回格式:

```json
{
    "state": "SUCCESS",
    "url": "upload/demo.zip",
    "title": "demo.zip",
    "original": "demo.zip"
}
```

### listimage

请求参数:

```json
GET {"action": "listimage", "start": 0, "size": 20}
```

返回格式:
```json
// 需要支持callback参数,返回jsonp格式
{
    "state": "SUCCESS",
    "list": [
        {
            "url": "upload/1.jpg"
        }, 
        {
            "url": "upload/2.jpg"
        }, 
    ],
    "start": 20,
    "total": 100
}
```

### catchimage

请求参数:

```json
GET {
    "action": "catchimage",
    "source": [
        "http://a.com/1.jpg",
        "http://a.com/2.jpg"
    ]
}
```

返回格式:

```json
// 需要支持callback参数,返回jsonp格式
// list项的state属性和最外面的state格式一致
{
    "state": "SUCCESS",
    "list": [
        {
            "url": "upload/1.jpg",
            "source": "http://b.com/2.jpg",
            "state": "SUCCESS"
        }, 
        {
            "url": "upload/2.jpg",
            "source": "http://b.com/2.jpg",
            "state": "SUCCESS"
        }, 
    ]
}
```
