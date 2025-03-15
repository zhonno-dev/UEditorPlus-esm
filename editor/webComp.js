// console.log(HTMLParagraphElement);
// 定义一个自定义元素类
//web Component
class MyCustomElement extends HTMLElement  {
	constructor() {
		super();
		// 创建一个 shadow DOM
		const shadow = this.attachShadow({ mode: 'open' });

		// let tpl = `
		// <slot></slot>
		// `;
		let tpl = `
		<div>
        <div>第一个slot</div>
	<slot name="slot1"></slot>
        <div>第二个slot</div>
	<slot name="slot2"></slot>
		</div>
        `;
		const parser = new DOMParser();
		const doc = parser.parseFromString(tpl, 'text/html');
		// // // // console.log(doc);

		shadow.appendChild(doc.body.firstChild);
		// shadow.appendChild(document.createElement('slot'));

		// 获取 slot 元素
		const slot = shadow.querySelector('slot');
		// const assignedNodes = slot.assignedNodes();
		console.log(slot);

		// // console.log(slot);
		// 监听 slotchange 事件，当 slot 内容变化时触发
		if (0) {
		slot.addEventListener('slotchange', () => {
			// 获取分配到 slot 的节点
			const assignedNodes = slot.assignedNodes();
			// 移除 slot 元素
			// slot.remove();
			console.log('分配到 slot 的节点:', assignedNodes);
			// 遍历分配到 slot 的节点
			assignedNodes.forEach(node => {
				 // 获取当前时间
				 const now = new Date();
				 const minutes = String(now.getMinutes()).padStart(2, '0');
				 const seconds = String(now.getSeconds()).padStart(2, '0');
				// 将节点追加到 shadow DOM 中
				var div = document.createElement('div');
				div.appendChild(document.createTextNode(`[${minutes}:${seconds}]`));
				div.appendChild(node.cloneNode(true));
				shadow.appendChild(div);
			});
		});
		}
		

		// console.log(this.children);
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
		// var p = document.createElement('p');
		// p.textContent = '这是一个自定义的 Web Component!';
		// // 创建一个子元素，例如一个 span 元素
		// var span = document.createElement('span');
		// span.textContent = '这是一个子元素';
		// // 使用 appendChild 方法将 span 元素添加到 p 元素中
		// p.appendChild(span);
		// // // 将段落元素添加到 shadow DOM 中
		// // shadow.appendChild(p);
		// // this.children[0].appendChild(p);
		// this.appendChild(p);
		// console.log(this.children);

	}
}

class MyAbc extends MyCustomElement {

}

// 定义自定义元素
customElements.define('my-custom-element', MyCustomElement);
// customElements.define('my-abc', MyAbc);