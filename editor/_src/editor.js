//TODO 这里需要import 配置|ueditor.config.js，然后赋值给 UEDITOR_CONFIG

//旧 baidu.editor = 新 UE
import UE from "./UE.js";
import UEDITOR_CONFIG from "../ueditor.config.js";
UE.UEDITOR_CONFIG = UEDITOR_CONFIG;

//core/
import './core.js';

//plugins/
import './plugins/defaultfilter.js';
import './plugins/inserthtml.js';
import './plugins/autotypeset.js';
import './plugins/autosubmit.js';
import './plugins/background.js';
import './plugins/image.js';
import './plugins/justify.js';
import './plugins/font.js';
import './plugins/link.js';
import './plugins/iframe.js';
import './plugins/scrawl.js';
import './plugins/removeformat.js';
import './plugins/blockquote.js';
import './plugins/convertcase.js';
import './plugins/indent.js';
import './plugins/print.js';
import './plugins/preview.js';
import './plugins/selectall.js';
import './plugins/paragraph.js';
import './plugins/directionality.js';
import './plugins/horizontal.js';
import './plugins/time.js';
import './plugins/rowspacing.js';
import './plugins/lineheight.js';
import './plugins/insertcode.js';
import './plugins/cleardoc.js';
import './plugins/anchor.js';
import './plugins/wordcount.js';
import './plugins/pagebreak.js';
import './plugins/wordimage.js';
import './plugins/autosave.js';
import './plugins/formula.js';
import './plugins/dragdrop.js';
import './plugins/undo.js';
import './plugins/copy.js';
import './plugins/paste.js';
import './plugins/puretxtpaste.js';
import './plugins/list.js';
import './plugins/source.js';
import './plugins/enterkey.js';
import './plugins/keystrokes.js';
import './plugins/fiximgclick.js';
import './plugins/autolink.js';
import './plugins/autoheight.js';
import './plugins/autofloat.js';
import './plugins/video.js';
import './plugins/audio.js';
import './plugins/table.core.js';
import './plugins/table.cmds.js';
import './plugins/table.action.js';
import './plugins/table.sort.js';
import './plugins/contextmenu.js';
import './plugins/shortcutmenu.js';
import './plugins/basestyle.js';
import './plugins/elementpath.js';
import './plugins/formatmatch.js';
import './plugins/searchreplace.js';
import './plugins/customstyle.js';
import './plugins/catchremoteimage.js';
import './plugins/insertparagraph.js';
import './plugins/template.js';
import './plugins/autoupload.js';
import './plugins/section.js';
import './plugins/simpleupload.js';
import './plugins/serverparam.js';
import './plugins/insertfile.js';
import './plugins/markdown-shortcut.js';
import './plugins/quick-operate.js';


//ui/
import './ui.js';

//adapter/
import './adapter/editorui.js';
// import './adapter/editor.js';
import './adapter/message.js';

// console.log(UE.ui);


//lang/
import '../lang/zh-cn/zh-cn.js';

//zhu:！这个 dom 可能会需要单独变成一个 esm 实现 import dom from ~
// var dom = (UE.dom = {});


export default UE;