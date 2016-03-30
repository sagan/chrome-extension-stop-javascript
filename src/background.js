
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

chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.tabs.executeScript(null,{code: exit.toString() + "\nexit();", allFrames: true});
});
