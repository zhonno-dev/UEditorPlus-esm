// console.log(HTMLParagraphElement);
// 定义一个自定义元素类
class MyCustomElement extends HTMLElement  {
	constructor() {
		super();
		// 创建一个 shadow DOM
		// const shadow = this.attachShadow({ mode: 'open' });

		// let tpl = `
		// <div>[<slot>OK</slot>]</div>
		// `;
		// const parser = new DOMParser();
		// const doc = parser.parseFromString(tpl, 'text/html');
		// // // console.log(doc);

		// shadow.appendChild(doc.body.firstChild);
		// // 创建一个段落元素
		// let p;
		// p = document.createElement('p');
		// p.contentEditable = true;
		// p.textContent = '[这是一个自定义的 Web Component!]';
		// // 将段落元素添加到 shadow DOM 中
		// shadow.appendChild(p);
		// // 创建一个段落元素
		// p = document.createElement('p');
		// p.textContent = '这是一个自定义的 Web Component!';
		// // 将段落元素添加到 shadow DOM 中
		// shadow.appendChild(p);
		// // 创建一个段落元素
		// p = document.createElement('p');
		// p.textContent = '这是一个自定义的 Web Component!';
		// // 将段落元素添加到 shadow DOM 中
		// shadow.appendChild(p);
		// // 创建一个段落元素
		// p = document.createElement('p');
		// p.textContent = '这是一个自定义的 Web Component!';
		// // 将段落元素添加到 shadow DOM 中
		// shadow.appendChild(p);
	}
}

class MyAbc extends MyCustomElement {

}

// 定义自定义元素
customElements.define('my-custom-element', MyCustomElement);
customElements.define('my-abc', MyAbc);