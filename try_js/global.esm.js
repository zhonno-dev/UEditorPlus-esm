// global.js
var myApp = {
    name: 'myApp',
    desc: '全局功能模块',
    plugins: {
        demo: () => {
            console.log('功能插件示例');
        },
    },
};
window.myApp = myApp;

export { myApp };