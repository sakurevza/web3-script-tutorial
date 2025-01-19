//爬取最新token对
let list = document.getElementsByClassName('d-flex align-items-center gap-1 link-dark');
let base_info = {};
for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let text = item.getElementsByClassName('text-muted')[0]?.innerText?.slice(1,-1);
    let href = item.href.toString();
    let token = href.slice(27,href.length);
    base_info[text] = token;
    // console.log(text,token,base_info)
}
console.log(base_info)

const util = require('util');
const colors = require('colors');
console.log(colors.red('This is red text ') + colors.green.bold('and this is green bold text ') + 'this is normal text');

