
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
        let cs = document.defaultView.getComputedStyle(el);
        if( cs["-webkit-user-select"] == "none" ) {
            //el.style.webkitUserSelect = "auto";
            el.style.setProperty("-webkit-user-select", "auto", "important");
        }
        // 某些傻逼脑残图片网站在图片上加一层透明div来阻止用户右键保存图片
        if( (el.tagName == "DIV" || el.tagName == "SPAN")
            && cs.position == "absolute"
            && (el.children.length == 0 || el.textContent.trim() == "")
            ) {
            return el.style.setProperty("display", "none", "important");
        }
        // 某些更傻逼的歌词网站在文字上覆盖一个拉大的gif透明像素图片来阻止复制文字
        if( el.tagName == 'IMG' && (el.naturalHeight < 10 && el.naturalWidth < 10) ) {
            return el.style.setProperty("display", "none", "important");
        }
    });

    throw '';
}

chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.tabs.executeScript(null,{code: exit.toString() + "\nexit();", allFrames: true});
});
