/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UE.plugin.register("autoupload", function () {
    function sendAndInsertFile(file, editor) {
        var me = editor;
        //模拟数据
        var fieldName,
            urlPrefix,
            maxSize,
            allowFiles,
            actionUrl,
            loadingHtml,
            errorHandler,
            successHandler,
            filetype = /image\/\w+/i.test(file.type) ? "image" : "file",
            fileExt = UE.plus.fileExt(file.name),
            loadingId = "loading_" + (+new Date()).toString(36);
	    
	    //zhu:act:20240701160138|粘贴图片/拖入（上传）图片文件 改用base64保存图片
	    //zhu:从配置中获取是否把图片存为base64
	    //zhu:搜索定位： function sendAndInsertFile(
	    var is_image_base64 = me.getOpt('is_image_base64');
	    if (!is_image_base64) { //默认允许base64
		    is_image_base64 = true;
	    }

        fieldName = me.getOpt(filetype + "FieldName");
        urlPrefix = me.getOpt(filetype + "UrlPrefix");
        maxSize = me.getOpt(filetype + "MaxSize");
        allowFiles = me.getOpt(filetype + "AllowFiles");
        actionUrl = me.getActionUrl(me.getOpt(filetype + "ActionName"));
        errorHandler = function (title) {
            var loader = me.document.getElementById(loadingId);
            loader && domUtils.remove(loader);
            me.fireEvent("showmessage", {
                id: loadingId,
                content: title,
                type: "error",
                timeout: 4000
            });
        };

        if (filetype === "image") {
            loadingHtml =
                '<img class="uep-loading" id="' +
                loadingId +
                '" src="' +
                me.options.themePath +
                me.options.theme +
                '/images/spacer.gif">';
            successHandler = function (data) {
                var link = urlPrefix + data.url,
                    loader = me.document.getElementById(loadingId);
                if (loader) {
                    domUtils.removeClasses(loader, "uep-loading");
                    loader.setAttribute("src", link);
                    loader.setAttribute("_src", link);
                    loader.setAttribute("alt", data.original || "");
                    loader.removeAttribute("id");
                    me.trigger("contentchange", loader);
                }
            };
        } else {
            loadingHtml =
                "<p>" +
                '<img class="uep-loading" id="' +
                loadingId +
                '" src="' +
                me.options.themePath +
                me.options.theme +
                '/images/spacer.gif">' +
                "</p>";
            successHandler = function (data) {
                var link = urlPrefix + data.url,
                    loader = me.document.getElementById(loadingId);

                var rng = me.selection.getRange(),
                    bk = rng.createBookmark();
                rng.selectNode(loader).select();
                me.execCommand("insertfile", {url: link});
                rng.moveToBookmark(bk).select();
            };
	}
	    
	    
	    //zhu:act:20240701160138|粘贴图片/拖入（上传）图片文件 改用base64保存图片
	    //zhu:搜索定位： me.execCommand('insertfile', {'url': link});
	    //zhu:把下方这些判断提前到此处（提前到[插入loading的占位符]之前）
	    /* 判断后端配置是否没有加载成功 */
	    if (!me.getOpt(filetype + "ActionName")) {
		//zhu: 当 粘贴 剪贴板中的图片时，filetype=image
		    	//zhu:判断是否可支持base64
		    if (filetype == 'image' && is_image_base64) {
			    //允许图片保存为base64（这里什么都不做）
		    }
		    else {
			    errorHandler(me.getLang("autoupload.errorLoadConfig"));
			    return;
		    }
	    }
	    /* 判断文件大小是否超出限制 */
	    if (file.size > maxSize) {
		    errorHandler(me.getLang("autoupload.exceedSizeError"));
		    return;
	    }
	    /* 判断文件格式是否超出允许 */
	    var fileext = file.name ? file.name.substr(file.name.lastIndexOf(".")) : "";
	    if (
		    (fileext && filetype != "image") ||
		    (allowFiles &&
			    (allowFiles.join("") + ".").indexOf(fileext.toLowerCase() + ".") == -1)
	    ) {
		    errorHandler(me.getLang("autoupload.exceedTypeError"));
		    return;
	    }

        /* 插入loading的占位符 */
        me.execCommand("inserthtml", loadingHtml);
        
	    //zhu:act:20240701160138|粘贴图片/拖入（上传）图片文件 改用base64保存图片
	    //zhu:here:粘贴图片使用base64保存@BEGIN
	    if (filetype == 'image' && is_image_base64) {
		    //zhu: 将读取到的文件内容转化为Base64编码
		    var reader = new FileReader();
		    reader.onloadend = function () {
			    //这个loader必须在这个function里这样获取，否则下方的 loader.* 无法正常生效。
			    //zhu:直接参照上方 successHandler 所定义的方法：
			    var loader = me.document.getElementById(loadingId);
			    // console.log(loader);
			    var base64Data = btoa(reader.result);
			    // console.log(base64Data);
			    // document.getElementById('img_show').src = "data:image/png;base64," + base64Data;
			    // me.execCommand('inserthtml', "<img src=\"data:image/png;base64,"+base64Data+"\" >");

			    loader.setAttribute('_src', '');
			    loader.setAttribute('src', `data:${file.type};base64,${base64Data}`);
			    loader.setAttribute('style', '');
			    loader.setAttribute('title', file.name + '(base64)');
			    loader.setAttribute('alt', '');
			    loader.removeAttribute('id');
			    domUtils.removeClasses(loader, 'uep-loading');
		    };
		    reader.readAsBinaryString(file);
		    // reader.readAsArrayBuffer(file);

		    return;
	    }
	    //zhu:here:粘贴图片使用base64保存@END


	//以下继续原本的代码
        var upload = function (file) {
            if(me.getOpt('uploadServiceEnable')){
                me.getOpt('uploadServiceUpload')('image', file, {
                    success: function( res ) {
                        successHandler( res );
                    },
                    error: function( err ) {
                        errorHandler(me.getLang("autoupload.loadError") + ' : ' + err);
                    },
                    progress: function( percent ) {

                    }
                }, {
                    from: 'paste'
                });
                return;
            }
            var formData = new FormData();
            formData.append(fieldName, file, file.name);
            UE.api.requestAction(me, me.getOpt(filetype + "ActionName"), {
                data: formData
            }).then(function (res) {
                successHandler(me.getOpt('serverResponsePrepare')( res.data ));
            }).catch(function (err) {
                errorHandler(me.getLang("autoupload.loadError") + ' : ' + err);
            });
        };

        var imageCompressEnable = me.getOpt('imageCompressEnable'),
            imageMaxSize = me.getOpt('imageMaxSize'),
            imageCompressBorder = me.getOpt('imageCompressBorder');
        if ('image' === filetype && imageCompressEnable && ['jpg', 'jpeg', 'png'].includes(fileExt)) {
            UE.image.compress(file, {
                maxSizeMB: imageMaxSize / 1024 / 1024,
                maxWidthOrHeight: imageCompressBorder
            }).then(function (compressedFile) {
                if (me.options.debug) {
                    console.log('AutoUpload.CompressImage', (compressedFile.size / file.size * 100).toFixed(2) + '%');
                }
                upload(compressedFile);
            }).catch(function (err) {
                console.error('AutoUpload.CompressImage.error', err)
                upload(file);
            });
        } else {
            upload(file);
        }

        /* 创建Ajax并提交 */
        // var xhr = new XMLHttpRequest(),
        //   fd = new FormData(),
        //   params = utils.serializeParam(me.queryCommandValue("serverparam")) || "",
        //   url = utils.formatUrl(
        //     actionUrl + (actionUrl.indexOf("?") == -1 ? "?" : "&") + params
        //   );
        //
        // fd.append(
        //   fieldName,
        //   file,
        //   file.name || "blob." + file.type.substr("image/".length)
        // );
        // fd.append("type", "ajax");
        // xhr.open("post", url, true);
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // xhr.addEventListener("load", function(e) {
        //   try {
        //     var json = new Function("return " + utils.trim(e.target.response))();
        //     if (json.state == "SUCCESS" && json.url) {
        //       successHandler(json);
        //     } else {
        //       errorHandler(json.state);
        //     }
        //   } catch (er) {
        //     errorHandler(me.getLang("autoupload.loadError"));
        //   }
        // });
        // xhr.send(fd);
    }

    function getPasteImage(e) {
        var images = []
        if (e.clipboardData && e.clipboardData.items) {
            var items = e.clipboardData.items
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    images.push(items[i])
                }
            }
        }
        return images;
    }

    function getDropImage(e) {
        return e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
    }

    return {
        outputRule: function (root) {
            utils.each(root.getNodesByTagName("img"), function (n) {
                if (/\b(uep\-loading\-error)|(bloaderrorclass)\b/.test(n.getAttr("class"))) {
                    n.parentNode.removeChild(n);
                }
            });
            utils.each(root.getNodesByTagName("p"), function (n) {
                if (/\bloadpara\b/.test(n.getAttr("class"))) {
                    n.parentNode.removeChild(n);
                }
            });
        },
        bindEvents: {
            defaultOptions: {
                //默认间隔时间
                enableDragUpload: true,
                enablePasteUpload: true
            },
            //插入粘贴板的图片，拖放插入图片
            ready: function (e) {
                var me = this;
                if (window.FormData && window.FileReader) {
                    var handler = function (e) {
                        var hasImg = false,
                            items;
                        //获取粘贴板文件列表或者拖放文件列表
                        items = e.type === "paste" ? getPasteImage(e) : getDropImage(e);
                        if (items) {
                            var len = items.length,
                                file;
                            while (len--) {
                                file = items[len];
                                if (file.getAsFile) file = file.getAsFile();
                                if (file && file.size > 0) {
                                    sendAndInsertFile(file, me);
                                    hasImg = true;
                                }
                            }
                            hasImg && e.preventDefault();
                        }
                    };

                    if (me.getOpt("enablePasteUpload") !== false) {
                        domUtils.on(me.body, "paste ", handler);
                    }
                    if (me.getOpt("enableDragUpload") !== false) {
                        domUtils.on(me.body, "drop", handler);
                        //取消拖放图片时出现的文字光标位置提示
                        domUtils.on(me.body, "dragover", function (e) {
                            if (e.dataTransfer.types[0] == "Files") {
                                e.preventDefault();
                            }
                        });
                    } else {
                        if (browser.gecko) {
                            domUtils.on(me.body, "drop", function (e) {
                                if (getDropImage(e)) {
                                    e.preventDefault();
                                }
                            });
                        }
                    }

                    //设置loading的样式
                    utils.cssRule(
                        "loading",
                        ".uep-loading{display:inline-block;cursor:default;background: url('" +
                        this.options.themePath +
                        this.options.theme +
                        "/images/loading.gif') no-repeat center center transparent;border-radius:3px;outline:1px solid #EEE;margin-left:1px;height:22px;width:22px;}\n" +
                        ".uep-loading-error{display:inline-block;cursor:default;background: url('" +
                        this.options.themePath +
                        this.options.theme +
                        "/images/loaderror.png') no-repeat center center transparent;border-radius:3px;outline:1px solid #EEE;margin-right:1px;height:22px;width:22px;" +
                        "}",
                        this.document
                    );
                }
            }
        }
    };
});
