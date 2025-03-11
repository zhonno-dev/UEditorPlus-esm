// global_plugins.js
console.log(import.meta.url);

import { myApp } from './global.esm.js';

myApp.plugins['plugin1'] = () => {
    console.log('向 myApp 追加功能插件');
};