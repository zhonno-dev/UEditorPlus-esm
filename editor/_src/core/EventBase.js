
import utils from "./utils.js";


/**
 * 编辑器准备就绪后会触发该事件
 * @module UE
 * @class Editor
 * @event ready
 * @remind render方法执行完成之后,会触发该事件
 * @remind
 * @example
 * ```javascript
 * editor.addListener( 'ready', function( editor ) {
 *     editor.execCommand( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
 * } );
 * ```
 */
/**
 * 执行destroy方法,会触发该事件
 * @module UE
 * @class Editor
 * @event destroy
 * @see UE.Editor:destroy()
 */
/**
 * 执行reset方法,会触发该事件
 * @module UE
 * @class Editor
 * @event reset
 * @see UE.Editor:reset()
 */
/**
 * 执行focus方法,会触发该事件
 * @module UE
 * @class Editor
 * @event focus
 * @see UE.Editor:focus(Boolean)
 */
/**
 * 语言加载完成会触发该事件
 * @module UE
 * @class Editor
 * @event langReady
 */
/**
 * 运行命令之后会触发该命令
 * @module UE
 * @class Editor
 * @event beforeExecCommand
 */
/**
 * 运行命令之后会触发该命令
 * @module UE
 * @class Editor
 * @event afterExecCommand
 */
/**
 * 运行命令之前会触发该命令
 * @module UE
 * @class Editor
 * @event firstBeforeExecCommand
 */
/**
 * 在getContent方法执行之前会触发该事件
 * @module UE
 * @class Editor
 * @event beforeGetContent
 * @see UE.Editor:getContent()
 */
/**
 * 在getContent方法执行之后会触发该事件
 * @module UE
 * @class Editor
 * @event afterGetContent
 * @see UE.Editor:getContent()
 */
/**
 * 在getAllHtml方法执行时会触发该事件
 * @module UE
 * @class Editor
 * @event getAllHtml
 * @see UE.Editor:getAllHtml()
 */
/**
 * 在setContent方法执行之前会触发该事件
 * @module UE
 * @class Editor
 * @event beforeSetContent
 * @see UE.Editor:setContent(String)
 */
/**
 * 在setContent方法执行之后会触发该事件
 * @module UE
 * @class Editor
 * @event afterSetContent
 * @see UE.Editor:setContent(String)
 */
/**
 * 每当编辑器内部选区发生改变时，将触发该事件
 * @event selectionchange
 * @warning 该事件的触发非常频繁，不建议在该事件的处理过程中做重量级的处理
 * @example
 * ```javascript
 * editor.addListener( 'selectionchange', function( editor ) {
 *     console.log('选区发生改变');
 * }
 */
/**
 * 在所有selectionchange的监听函数执行之前，会触发该事件
 * @module UE
 * @class Editor
 * @event beforeSelectionChange
 * @see UE.Editor:selectionchange
 */
/**
 * 在所有selectionchange的监听函数执行完之后，会触发该事件
 * @module UE
 * @class Editor
 * @event afterSelectionChange
 * @see UE.Editor:selectionchange
 */
/**
 * 编辑器内容发生改变时会触发该事件
 * @module UE
 * @class Editor
 * @event contentChange
 */

/**
 * 获得对象所拥有监听类型的所有监听器
 * @unfile
 * @module UE
 * @since 1.2.6.1
 * @method getListener
 * @public
 * @param { Object } obj  查询监听器的对象
 * @param { String } type 事件类型
 * @param { Boolean } force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
 * @return { Array } 监听器数组
 */
function getListener(obj, type, force) {
	var allListeners;
	type = type.toLowerCase();
	return (
		(allListeners =
			obj.__allListeners || (force && (obj.__allListeners = {}))) &&
		(allListeners[type] || (force && (allListeners[type] = [])))
	);
}

/**
 * UE采用的事件基类\
 * UEditor公用空间，UEditor所有的功能都挂载在该空间下\
 * UE采用的事件基类，继承此类的对应类将获取addListener,removeListener,fireEvent方法。\
 * 在UE中，Editor以及所有ui实例都继承了该类，故可以在对应的ui对象以及editor对象上使用上述方法。\
 * 通过此构造器，子类可以继承EventBase获取事件监听的方法 //zhu:！其实是不行的！
 * @module UE
 * @class EventBase
 * @constructor
 * @example
* ```javascript
 * UE.EventBase.call(editor); //zhu:！其实是不行的！
 * ```
 * @since 1.2.6.1
 */
class EventBase {
	/** 保存的有注册的事件回调 */
	__allListeners = {};

	/**
	 * 注册事件监听器
	 * @method addListener
	 * @param { String } types 监听的事件名称，同时监听多个事件使用空格分隔
	 * @param { Function } fn 监听的事件被触发时，会执行该回调函数
	 * @waining 事件被触发时，监听的函数假如返回的值恒等于true，回调函数的队列中后面的函数将不执行
	 * @example
	 * ```javascript
	 * editor.addListener('selectionchange',function(){
	 *      console.log("选区已经变化！");
	 * })
	 * editor.addListener('beforegetcontent aftergetcontent',function(type){
	 *         if(type == 'beforegetcontent'){
	 *             //do something
	 *         }else{
	 *             //do something
	 *         }
	 *         console.log(this.getContent) // this是注册的事件的编辑器实例
	 * })
	 * ```
	 * @see fireEvent(String)
	 */
	addListener(types, listener) {
		types = utils.trim(types).split(/\s+/);
		for (var i = 0, ti; (ti = types[i++]);) {
			getListener(this, ti, true).push(listener);
		}
	}

	on(types, listener) {
		return this.addListener(types, listener);
	}
	off(types, listener) {
		return this.removeListener(types, listener);
	}
	trigger() {
		return this.fireEvent.apply(this, arguments);
	}
	/**
	 * 移除事件监听器
	 * @method removeListener
	 * @param { String } types 移除的事件名称，同时移除多个事件使用空格分隔
	 * @param { Function } fn 移除监听事件的函数引用
	 * @example
	 * ```javascript
	 * //changeCallback为方法体
	 * editor.removeListener("selectionchange",changeCallback);
	 * ```
	 */
	removeListener(types, listener) {
		types = utils.trim(types).split(/\s+/);
		for (var i = 0, ti; (ti = types[i++]);) {
			utils.removeItem(getListener(this, ti) || [], listener);
		}
	}

	/**
	 * 触发事件
	 * @method fireEvent
	 * @param { String } types 触发的事件名称，同时触发多个事件使用空格分隔
	 * @remind 该方法会触发addListener
	 * @return { * } 返回触发事件的队列中，最后执行的回调函数的返回值
	 * @example
	 * ```javascript
	 * editor.fireEvent("selectionchange");
	 * ```
	 */

	/**
	 * 触发事件
	 * @method fireEvent
	 * @param { String } types 触发的事件名称，同时触发多个事件使用空格分隔
	 * @param { *... } options 可选参数，可以传入一个或多个参数，会传给事件触发的回调函数
	 * @return { * } 返回触发事件的队列中，最后执行的回调函数的返回值
	 * @example
	 * ```javascript
	 *
	 * editor.addListener( "selectionchange", function ( type, arg1, arg2 ) {
	 *
	 *     console.log( arg1 + " " + arg2 );
	 *
	 * } );
	 *
	 * //触发selectionchange事件， 会执行上面的事件监听器
	 * //output: Hello World
	 * editor.fireEvent("selectionchange", "Hello", "World");
	 * ```
	 */
	fireEvent() {
		var types = arguments[0];
		types = utils.trim(types).split(" ");
		for (var i = 0, ti; (ti = types[i++]);) {
			var listeners = getListener(this, ti),
				r,
				t,
				k;
			if (listeners) {
				k = listeners.length;
				while (k--) {
					if (!listeners[k]) continue;
					t = listeners[k].apply(this, arguments);
					if (t === true) {
						return t;
					}
					if (t !== undefined) {
						r = t;
					}
				}
			}
			if ((t = this["on" + ti.toLowerCase()])) {
				r = t.apply(this, arguments);
			}
		}
		return r;
	}
}

// 导出 EventBase 类
export default EventBase;