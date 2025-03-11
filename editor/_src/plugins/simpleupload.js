/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
UE.plugin.register("simpleupload", function () {
    var me = this,
        isLoaded = false,
        containerBtn;

	//zhu:act:20240701163533|单图片上传 改用base64保存图片
	//zhu:here:
	//zhu:搜索定位： UE.plugin.register('simpleupload'
	//zhu:增加一个变量标识图片是否存为base64
	var is_image_base64 = me.getOpt('is_image_base64');
	if (!is_image_base64) { //默认允许base64
		is_image_base64 = true;
	}

	//zhu:下方函数原名为 initUploadBtn() ，是 百度编辑器 原来的函数，通过后端服务器实现图片文件的上传。
	//	为了支持图片base64，把它重命名为现在的 initUploadBtn_upload()，
	//	以便于我再写一个 initUploadBtn_base64() 出来支持图片base64，
	//	根据 is_image_base64 参数值来决定运行哪一个。
    function initUploadBtn_upload() {
        var input = document.createElement("input");
        input.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;font-size:0;opacity:0;';
        input.type = 'file';
        input.accept = me.getOpt('imageAllowFiles').join(',');
        containerBtn.appendChild(input);
        domUtils.on(input, 'click', function (e) {
            var toolbarCallback = me.getOpt("toolbarCallback");
            if (toolbarCallback) {
                if (true === toolbarCallback('simpleupload', me)) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        });
        domUtils.on(input, 'change', function (e) {
            var state = me.queryCommandState("simpleupload");
            if (state === -1) {
                return;
            }
            if (!input.value) {
                return;
            }

            var loadingId = UE.dialog.loadingPlaceholder(me);

            if (!me.getOpt("imageActionName")) {
                UE.dialog.removeLoadingPlaceholder(me, loadingId);
                UE.dialog.tipError(me, me.getLang("autoupload.errorLoadConfig"));
                return;
            }

            var allowFiles = me.getOpt("imageAllowFiles");
            var filename = input.value, fileext = filename ? filename.substr(filename.lastIndexOf(".")) : "";
            if (
                !fileext ||
                (allowFiles &&
                    (allowFiles.join("") + ".").indexOf(fileext.toLowerCase() + ".") === -1)
            ) {
                UE.dialog.removeLoadingPlaceholder(me, loadingId);
                UE.dialog.tipError(me, me.getLang("autoupload.exceedTypeError"));
                return;
            }

            var successHandler = function (res) {
                const loader = me.document.getElementById(loadingId);
                domUtils.removeClasses(loader, "uep-loading");
                const link = me.options.imageUrlPrefix + res.url;
                loader.setAttribute("src", link);
                loader.setAttribute("_src", link);
                loader.setAttribute("alt", res.original || "");
                loader.removeAttribute("id");
                me.fireEvent("contentchange");
                // 触发上传图片事件
                me.fireEvent("uploadsuccess", {
                    res: res,
                    type: 'image'
                });
            };

            var errorHandler = function (err) {
                UE.dialog.removeLoadingPlaceholder(me, loadingId);
                UE.dialog.tipError(me, err);
            };

            var upload = function (file) {
                if(me.getOpt('uploadServiceEnable')){
                    me.getOpt('uploadServiceUpload')('image', file, {
                        success: function( res ) {
                            successHandler( res );
                        },
                        error: function( err ) {
                            errorHandler(me.getLang("simpleupload.loadError") + ' : ' + err);
                        },
                        progress: function( percent ) {

                        }
                    }, {
                        from: 'upload'
                    });
                    return;
                }
                const formData = new FormData();
                formData.append(me.getOpt('imageFieldName'), file, file.name);
                UE.api.requestAction(me, me.getOpt("imageActionName"), {
                    data: formData
                }).then(function (res) {
                    res = me.getOpt('serverResponsePrepare')( res.data )
                    if ('SUCCESS' === res.state && res.url) {
                        successHandler(res)
                    } else {
                        errorHandler(res.state);
                    }
                    input.value = '';
                }).catch(function (err) {
                    errorHandler(err)
                    input.value = '';
                });
            };
            var file = input.files[0];
            var fileExt = UE.plus.fileExt(file.name);
            // console.log('file',file);
            var imageCompressEnable = me.getOpt('imageCompressEnable'),
                imageMaxSize = me.getOpt('imageMaxSize'),
                imageCompressBorder = me.getOpt('imageCompressBorder');
            if (imageCompressEnable && ['jpg', 'jpeg', 'png'].includes(fileExt)) {
                UE.image.compress(file, {
                    maxSizeMB: imageMaxSize / 1024 / 1024,
                    maxWidthOrHeight: imageCompressBorder
                }).then(function (compressedFile) {
                    if (me.options.debug) {
                        console.log('UEditorPlus.SimpleUpload.CompressImage', (compressedFile.size / file.size * 100).toFixed(2) + '%');
                    }
                    upload(compressedFile);
                }).catch(function (err) {
                    console.error('UEditorPlus.SimpleUpload.CompressImage.error', err);
                    upload(file);
                });
            } else {
                upload(file);
            }
        });

        var stateTimer;
        me.addListener("selectionchange", function () {
            clearTimeout(stateTimer);
            stateTimer = setTimeout(function () {
                var state = me.queryCommandState("simpleupload");
                if (state === -1) {
                    input.disabled = "disabled";
                } else {
                    input.disabled = false;
                }
            }, 400);
        });
        isLoaded = true;
    }
	
	//zhu:act:单图片上传 改用base64保存图片
	//zhu:搜索定位： containerBtn.appendChild(btnIframe);
	//zhu:这是以base64保存图片（用原本的 initUploadBtn() 为模板改的）
	function initUploadBtn_base64() {
		// alert('initUploadBtn_base64()');
		var w = containerBtn.offsetWidth || 20,
            	h = containerBtn.offsetHeight || 20,
		btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;';
		
		//这里直接创建DIV
		btnIframe = document.createElement('div');
		var timestrap = (+new Date()).toString(36);
		
		btnIframe.style.cssText = btnStyle;
		containerBtn.appendChild(btnIframe);
		//直接插入一个file标签
		btnIframe.innerHTML = '<input id="edui_input_' + timestrap + '" type="file" multiple="multiple" accept="image/*" name="' + me.options.imageFieldName + '" ' + 'style="' + btnStyle + '">';
		var input = document.getElementById('edui_input_' + timestrap);

		domUtils.on(input, 'change', function () {
			if(!input.value) return;
			var loadingId = 'loading_' + (+new Date()).toString(36);
			var allowFiles = me.getOpt('imageAllowFiles');
			var allowSize = me.getOpt('imageMaxSize');

			me.focus();

			function showErrorLoader(title){ //用于报错的函数
				if(loadingId) {
					var loader = me.document.getElementById(loadingId);
					loader && domUtils.remove(loader);
					me.fireEvent('showmessage', {
					'id': loadingId,
					'content': title,
					'type': 'error',
					'timeout': 4000
					});
				}
			}
			
			//开始把图片保存为base64
			utils.each(input.files, function (_f) {
				// console.log(_f);

				// 判断文件格式是否错误
				var filename = _f.name,
				fileext = _f.name ? filename.substr(filename.lastIndexOf('.')):'';
				// console.log(fileext);
				if (!fileext || (allowFiles && (allowFiles.join('') + '.').indexOf(fileext.toLowerCase() + '.') == -1)) {
					showErrorLoader('['+_f.name + ']'+me.getLang('simpleupload.exceedTypeError'));
					return;
				}
				//检查图片文件大小
				if (_f.size > allowSize) {
					showErrorLoader('['+_f.name + ']'+me.getLang('simpleupload.exceedSizeError') + '(<'+(allowSize/1024)+'KB)');
					return;
				}

				var reader = new FileReader();
				reader.onloadend = function () {
					// console.log(_f);
					var base64Data = btoa(reader.result);
				
					// console.log(base64Data);
					// document.getElementById('img_show').src = "data:image/png;base64," + base64Data;
					// document.getElementById("top_div").innerHTML = document.getElementById("top_div").innerHTML + "<img src=\"data:image/png;base64," + base64Data + "\" style='width:20px;height:20px;'>";
					me.execCommand('inserthtml', `<p><img src="data:${_f.type};base64,${base64Data}" title="${filename}(base64)" ></p>`);
				}
				reader.readAsBinaryString(_f);
			});

			return;
		});

		isLoaded = true;
		return;
	}

    return {
        bindEvents: {
            ready: function () {
                //设置loading的样式
                utils.cssRule(
                    "loading",
                    ".uep-loading{display:inline-block;cursor:default;background: url('" +
                    this.options.themePath +
                    this.options.theme +
                    "/images/loading.gif') no-repeat center center transparent;border-radius:3px;outline:1px solid #EEE;margin-right:1px;height:22px;width:22px;}\n" +
                    ".uep-loading-error{display:inline-block;cursor:default;background: url('" +
                    this.options.themePath +
                    this.options.theme +
                    "/images/loaderror.png') no-repeat center center transparent;border-radius:3px;outline:1px solid #EEE;margin-right:1px;height:22px;width:22px;" +
                    "}",
                    this.document
                );
            },
            /* 初始化简单上传按钮 */
            simpleuploadbtnready: function (type, container) {
		    containerBtn = container;
		    //zhu:act:20240701163533|单图片上传 改用base64保存图片
		    //zhu:act:单图片上传 改用base64保存图片
		    //zhu:搜索定位： 'simpleuploadbtnready':
		    //zhu: 这里改成根据 is_image_base64 判断使用哪个初始化函数
		    if (is_image_base64) {
			//图片存为base64
			initUploadBtn_base64();
		}
		else
		{
		    //非base64模式，按原本的代码执行（上传到后端服务器）
		    //zhu:把 initUploadBtn 这个初始化函数放到 afterConfigReady（加载后端配置后）才运行。
			//	但这样的话当后端配置项加载失败时则这个 initUploadBtn 初始化函数就不会运行了，
			    // me.afterConfigReady(initUploadBtn);
			    me.afterConfigReady(initUploadBtn_upload);
			}
            }
        },
        outputRule: function (root) {
            utils.each(root.getNodesByTagName("img"), function (n) {
                if (/\b(uep\-loading\-error)|(bloaderrorclass)\b/.test(n.getAttr("class"))) {
                    n.parentNode.removeChild(n);
                }
            });
        },
        commands: {
            simpleupload: {
                queryCommandState: function () {
                    return isLoaded ? 0 : -1;
                }
            }
        }
    };
});
