#chrome extension 「Stop Javascript」

本 Chrome extension 在 Chrome 工具栏添加一个按钮, 点击这个按钮后会停止当前 tab 页所有 Javascript 脚本的执行.

这个 extension 的初衷是用来对付某些顽固的禁止复制内容的网站, 试过其它几个专门用来「解除禁止复制限制」的 Chrome extension 都无效.

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/stop-javascript/djecijdiikggekgohjffnccifchfdmim)

## 原理

当点击工具栏的 extension 图标时, 会在当前 tab 页的所有 frames 里执行下面代码:

```javascript
// modified from https://stackoverflow.com/questions/550574/how-to-terminate-the-script-in-javascript
function exit() {
    'use strict';
    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    let handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'selectstart',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'input',
        'abort', 'close', 'drop', 'dragstart', 'drag', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function eventHandler(e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for(let i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], eventHandler, true);
    }

    if(window.stop) {
        window.stop();
    }
    
    Array.prototype.forEach.call(document.querySelectorAll("*"), el => {
        if( document.defaultView.getComputedStyle(el)["-webkit-user-select"] == "none" ) {
            //el.style.webkitUserSelect = "auto";
            el.style.setProperty("-webkit-user-select", "auto", "important");
        }
    });

    throw '';
}
exit();
```

## 局限性

* 对使用 setTimeout / setInterval 注册的 javascript 脚本无效.

