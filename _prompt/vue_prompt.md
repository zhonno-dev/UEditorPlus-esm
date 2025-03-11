## Vue3 组件开发规范说明

### 文件结构
- 每个组件由两个文件组成：`.js` 和 `.html`
- 文件名必须相同，例如：`page_test.js` 和 `page_test.html`
- 文件需放在同一目录下

### 示例文件结构
```
page_test.js
page_test.html
```

### JavaScript文件示例代码及代码规范
- 统一使用Tab缩进
- 要有良好详尽的代码注释
- 使用 Vue3 的 CDN 全局变量模式，通过 `Vue` 对象访问 API
- 必须使用 Vue3 的组合式 API 模式编写代码
- `setup` 函数是Vue3组合式 API 的核心，所有逻辑应在此处编写
- Vue3`响应式变量`的声明和使用：
  - 所有`响应式变量`必须放入`sr`对象中，示例：`sr.val`
  - 可用 Vue.ref():
    - 在javascript文件中声明：`sr.age = Vue.ref(0);`
    - 在javascript文件中使用需要追加`.value`，示例:`sr.age.value = 1;`, `sr.age.value = sr.age.value + 100;`
    - 在html文件中使用时不需要`sr.`前序、不需要追加`.value`，示例：`<el-input v-model="age"></el-input>`
  - 可用 Vue.reactive():
    - 在javascript文件中声明：`sr.user = Vue.reactive({ name: 'John', age: 25 });`
    - 在javascript文件中使用不需要追加`.value`，示例：`sr.user.name = 'new Name';`, `sr.user.age++;`
    - 在html文件中使用时不需要`sr.`前序、不需要追加`.value`，示例：`<el-input v-model="user.name"></el-input>`
  - 可用 Vue.shallowReactive()
    - 与 Vue.reactive() 的用法一致。
- Vue3`函数（方法）`的声明与使用：
  - 所有`函数`必须放入`sr`对象中，示例：`sr.func_name = () => {...}`
  - 在javascript文件中声明：`sr.something = () => {...};`
  - 在javascript文件中使用：`sr.something();`
  - 在html文件中使用时不需要`sr.`前序，示例：`<el-button @click="something"></el-button>`
- 命名规范：
  - 无功能分组时用`小写字母+下划线`命名
    - 示例：`is_init`，示例代码：`sr.is_init = Vue.ref(false);`
    - 示例：`my_func`，示例代码：`sr.my_func = () => {...}`
    - 示例：`form_submit`，示例代码：`sr.form_submit = () => {...}`
  - 按功能分组时用`驼峰(首字母小写)+下划线`组合命名
    - 用`驼峰`命名`功能名称`，并作为此功能相关变量、函数的命名前序
    - 示例：`dataEdit`，一般用`Vue.reactive()` 或 `Vue.shallowReactive()`声明此功能需要用到的变量，例如：`sr.dataEdit = Vue.reactive({ name: 'John', age: 25 });`
    - 示例：`dataEdit_get`，获取待修改数据当前值，例如：`sr.dataEdit_get = () => {...}`
    - 示例：`dataEdit_submit`，提交修改的数据，例如：`sr.dataEdit_submit = () => {...}`
- `模板引用(ref)`的获取与使用规范与示例代码：
  - `模板引用`必须放入`$refs`对象中
  - `模板引用`的命名规则为`xxxRef`, 示例:`inputRef`
  - javascript文件中获取`模板引用`示例:`$refs.inputRef = Vue.useTemplateRef('inputRef');`
  - 对应html文件中的:`<el-input ref="inputRef"></el-input>`
  - 在javascript文件中使用`模板引用`需要追加`.value`，示例:`$refs.inputRef.value.dosomething()`
  - 在html文件中使用`模板引用`不需要追加`.value`，示例:`<el-button @click="$refs.inputRef.dosomething()"></el-button>`
- 组件导出默认对象，包含以下关键属性：
  - `template`: 使用加载的 HTML 模板
  - `props`: 定义组件接收的参数
  - `setup`: 组合式 API 入口，固定返回`sr`对象，`sr`对象中的元素会暴露给模板
  - `data`: 返回组件的数据对象

以下为JavaScript文件 page_test.js 完整的示例代码：
```javascript
/*
功能说明
*/
//#region 固定代码禁止修改{
let __DIR__ = import.meta.resolve('./'); //当前路径的URL（以“/”结尾）
let __BNAME__ = import.meta.url.match(/\/([^\.\/]+)\.js/g)[0].slice(1, -3); //自身的文件名（不包含后缀）
//组件模板（字符串）：AJAX获取同级目录下的 同名.html 文件内容
let __TPL__ = await (await fetch(`${__DIR__}${__BNAME__}.html`)).text();
// console.log(__DIR__);
//#region 固定代码禁止修改}

import api from './comp_vue/api.js'; //引入工具函数

export default {
	template: __TPL__, //模板（字符串）
	props: { //定义参数
		/** 参数说明 */
		prop_name: { default: 0 },
	},
	emits: [ //定义事件
		'theme_input' //事件:xxx  回调参数说明()
	],
	components: { //定义会用到的组件
		//代码规范：使用 Vue.defineAsyncComponent() 引用其它Vue3组件
		vue_comp: Vue.defineAsyncComponent(() => import('./comp.js')),
	},
	setup($props, { attrs: $attrs, slots: $slots, emit: $emit, expose }) { //组合式代码
		const sr = {}; //返回值(sr=setup return)
		const $refs = {}; //存放模板引用：$refs.xxx = Vue.useTemplateRef('domRef');

		//声明 模板引用 示例
		$refs.domRef = Vue.useTemplateRef('domRef');
		//使用 模板引用 示例
		Vue.onMounted(() => {
			//代码规范：只能在Vue3组件挂
			$refs.domRef.value.innerHTML = '123';
		});

		//声明定义响应式变量
		sr.input_val = Vue.ref('');
		sr.input_disable = Vue.ref(false);

		//定义函数
		sr.func = () => {
			//函数代码...
		};

		//数据列表示例 #T
		/** 数据列表-数据对象 */
		sr.infoList = Vue.reactive({
			ins: {
				_o: 'createtime',
				_b: 'desc',
			},
			res_info:[],
		});
		/** 获取列表数据 */
		sr.infoList_get = () => {
			api.weba_op_get('offline_css/info_list',
				sr.infoList.ins,
				(ret) => {
					if (!ret.is) {
						$g.site.msg0(ret.msg);
						return;
					}
					sr.infoList.res_info = ret.res_info;
				},
			);
		};
		Vue.onMounted(() => {
			sr.infoList_get();
		});

		//添加数据示例 #T
		/** 添加数据-数据对象 */
		sr.infoAdd = Vue.reactive({
			is_show: false,

			r_info: {
				name: '',
				desc: ''
			},
		});
		/** 添加表单提交 */
		sr.infoAdd_submit = () => {
			api.weba_op_post('offline_css/info_add',
				sr.infoAdd.r_info,
				(ret) => {
					if (!ret.is) {
						$g.site.msg0(ret.msg);
						return;
					}
					$g.site.msg1('添加成功');

					// 清空表单
					sr.infoAdd.r_info.name = '';
					sr.infoAdd.r_info.desc = '';
					// 刷新列表
					sr.infoList_get();
				}
			);
		};

		//修改数据示例 #T
		/** 修改数据-数据对象 */
		sr.infoEdit = Vue.reactive({
			is_show: false,

			p_uid: '', //待修改的数据UID
			r_info: { //当前修改的数据
				name: '',
				desc: ''
			},
		});
		/** 显示修改弹出框 */
		sr.infoEdit_show = (p_uid) => {
			sr.infoEdit.is_show = false;
			sr.infoEdit.p_uid = p_uid;

			//获取待修改记录
			api.weba_op_get('offline_css/info_get',
				{ p_uid },
				(ret) => {
					if (!ret.is) {
						$g.site.msg0(ret.msg);
						return;
					}
					sr.infoEdit.r_info = ret.r_info.info;
					sr.infoEdit.is_show = true;
				}
			);
		};
		/** 保存修改 */
		sr.infoEdit_submit = () => {
			sr.infoEdit.r_info['p_uid'] = sr.infoEdit.p_uid;

			api.weba_op_post('offline_css/info_edit',
				sr.infoEdit.r_info,
				(ret) => {
					if (!ret.is) {
						$g.site.msg0(ret.msg);
						return;
					}
					$g.site.msg1('修改成功');

					//隐藏修改弹出框
					sr.infoEdit.is_show = false;
					// 刷新列表
					sr.infoList_get();
				}
			);
		};

		// 返回值会暴露给模板和其他的选项式 API 钩子
		return sr;
	},
	data() {
		return {
			FILE: import.meta.url,
		};
	},
};
```

### HTML文件示例代码及代码规范
- 使用 Vue3 模板语法
- 统一使用Tab缩进
- 优先使用 ElementPlus 组件构建UI模板
- HTML标签必须包括完整的开始标签与闭合标签：
  - 示例：`<div></div>`
  - 示例：`<el-color-picker v-model="color1"></el-color-picker>`
- 在html文件中访问组件的数据、函数，不需要`sr.`前序，不需要追加`.value`（因为Vue3会自动解构`sr`）
  - 示例：`<el-input v-model="age"></el-input>`
  - 示例：`<el-button @click="something"></el-button>`
  - 示例：`<el-button @click="$refs.inputRef.dosomething()"></el-button>`
  - 示例：`<div>{{dataEdit}}</div>`
- 可以直接访问组件的数据和 props

以下为JavaScript文件 page_test.html 完整的示例代码：
```html
<div>
	<div>Vue3Comp Template : {{FILE}}</div>
	<div>
		<pre>{{$props}}</pre>
	</div>

	<!-- 使用项目自定义Vue组件 -->
	<vue_comp></vue_comp>

	<!-- 代码规范：定义模板引用 -->
	<div ref="domRef">模板引用</div>
	<!-- 代码规范：在HTML文件中使用 模板引用 -->
	<vue_comp :targetRef="$refs.domRef"></vue_comp>

	<!-- 代码规范：绑定响应式变量（不需要`sr.`前序，因为Vue3会自动解构`sr`） -->
	<el-input v-model="input_val" :disable="input_disable" placeholder="输入框"></el-input>

	<el-button @click="func">按钮</el-button>
	
	<hr>

	<!-- #region 添加数据 -->
	<div>
		<el-button type="primary" @click="infoAdd.is_show = true" v-show="!infoAdd.is_show">添加</el-button>
		<el-card v-show="infoAdd.is_show">
			<template #header>
				<span class="ff-yh bold fs14">新增</span>
			</template>
			<template #default>
				<el-descriptions border :column="1" label-width="150px">
					<el-descriptions-item label="名称" label-align="right">
						<el-input v-model="infoAdd.r_info.name" clearable placeholder="名称"></el-input>
					</el-descriptions-item>
					<el-descriptions-item label="描述" label-align="right">
						<el-input v-model="infoAdd.r_info.desc" type="textarea" placeholder="描述" :autosize="{ minRows: 1, maxRows: 5 }"></el-input>
					</el-descriptions-item>
				</el-descriptions>
			</template>
			<template #footer>
				<el-button type="primary" @click="infoAdd_submit">添加</el-button>
				<el-button @click="infoAdd.is_show = false">取消</el-button>
			</template>
		</el-card>
	</div>
	<!-- #endregion 添加数据 -->

	<!-- #region 修改数据弹出框 -->
	<el-dialog v-model="infoEdit.is_show" title="" width="80%" :close-on-click-modal="false" destroy-on-close>
		<template #default>
			<el-card>
				<template #header>
					<span class="ff-yh bold fs14">修改</span>
				</template>
				<template #default>
					<el-descriptions border :column="1" label-width="150px">
						<el-descriptions-item label="名称" label-align="right">
							<el-input v-model="infoEdit.r_info.name" clearable placeholder="名称"></el-input>
						</el-descriptions-item>
						<el-descriptions-item label="描述" label-align="right">
							<el-input v-model="infoEdit.r_info.desc" type="textarea" placeholder="描述" :autosize="{ minRows: 1, maxRows: 5 }"></el-input>
						</el-descriptions-item>
					</el-descriptions>
				</template>
	
				<template #footer>
					<el-button type="primary" @click="infoEdit_submit">保存</el-button>
					<el-button @click="infoEdit.is_show = false">取消</el-button>
				</template>
			</el-card>
		</template>
	</el-dialog>
	<!-- #endregion 修改数据弹出框 -->

	<!-- #region 数据列表 输出 res_info -->
	<div v-for="(r_info, k) in infoList.res_info" :key="k">
		<div class="box  hov-bgc-blue1 p10 m15-10">
			<div>
				<!-- 名称 -->
				<b>{{ r_info.info.name }}</b>
				<el-button type="default" @click="infoEdit_show(r_info.p_uid)" size="small" class="ml10">修改</el-button>
			</div>
			<div>
				<!-- 简介描述 -->
				{{ r_info.info.desc }}
			</div>
		</div>
	</div>
	<!-- #endregion 数据列表 输出 res_info -->

</div>
```

### 优先使用 ElementPlus UI 组件
- 允许使用 ElementPlus UI 组件，且 ElementPlus 组件已全局注册，直接使用即可，不需要用 `import` 或 `components` 方式导入
- 用`elp`作为`ElementPlus`的缩写。例如：`elp组件`表示`ElementPlus UI 组件`。
- 在html文件中使用 ElementPlus UI 组件 示例：`<el-button @click="something"></el-button>`

### Vue组件使用
#### 组件的注册
- 通过 components 注册异步组件
- 通过 Vue.defineAsyncComponent 动态加载组件
- 组件命名使用下划线风格，如`drag_bar`。
- 完整示例代码：
  ```javascript
  components: { //定义会用到的组件
  	drag_bar: Vue.defineAsyncComponent(() => import('./drag_bar.js'))
  },
  ```
#### 组件的使用
- 按组件注册的名称使用。
- 示例：
  ```html
  <!-- 模板中使用 -->
  <drag_bar :target-ref="$refs.target" />
  ```

### 开发注意事项
- 组件路径和文件名自动获取，无需硬编码
- 模板加载是异步的，使用 `await` 等待加载完成

### 扩展性
- 可以通过 `emits` 定义自定义事件
- 可以通过 `components` 注册子组件
- 可使用项目中以下文件中所定义的 JS 公共变量、JS 公共函数和公共 CSS 样式：
  - `../../../../lib.public/site/g.srv.js`
  - `../../../../lib.public/site/site.css` 
  - `../../../../lib.public/site/site.js`

