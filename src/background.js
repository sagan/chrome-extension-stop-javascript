function exit() {
  "use strict";
  window.addEventListener(
    "error",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );

  let handlers = [
    "copy",
    "cut",
    "paste",
    "beforeunload",
    "blur",
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "focus",
    "keydown",
    "keypress",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "resize",
    "scroll",
    "selectstart",
    "DOMNodeInserted",
    "DOMNodeRemoved",
    "DOMNodeRemovedFromDocument",
    "DOMNodeInsertedIntoDocument",
    "DOMAttrModified",
    "DOMCharacterDataModified",
    "DOMElementNameChanged",
    "DOMAttributeNameChanged",
    "DOMActivate",
    "DOMFocusIn",
    "DOMFocusOut",
    "online",
    "offline",
    "input",
    "abort",
    "close",
    "drop",
    "dragstart",
    "drag",
    "load",
    "paint",
    "reset",
    "select",
    "submit",
    "unload",
  ];

  function eventHandler(e) {
    e.stopPropagation();
    // e.preventDefault(); // Stop for the form controls, etc., too?
  }
  for (let i = 0; i < handlers.length; i++) {
    window.addEventListener(handlers[i], eventHandler, true);
  }

  if (window.stop) {
    window.stop();
  }

  Array.from(document.querySelectorAll("*")).forEach((el) => {
    let cs = getComputedStyle(el);
    if (cs["user-select"] == "none") {
      el.style.setProperty("user-select", "auto", "important");
    }
    if (el.tagName == "IMG" && !el.draggable) {
      el.setAttribute("draggable", "true");
    }
    // 某些傻逼脑残图片网站在图片上加一层透明div来阻止用户右键保存图片
    if (
      (el.tagName == "DIV" || el.tagName == "SPAN") &&
      cs.position == "absolute" &&
      (el.children.length == 0 || el.textContent.trim() == "")
    ) {
      el.style.setProperty("display", "none", "important");
    }
    // 某些更傻逼的歌词网站在文字上覆盖一个拉大的gif透明像素图片来阻止复制文字
    if (el.tagName == "IMG" && el.naturalHeight < 10 && el.naturalWidth < 10) {
      el.style.setProperty("display", "none", "important");
    }

    // 某些更更傻逼的网站在图片上用css :before 搞个浮层遮住以阻止右键保存
    cs = getComputedStyle(el, ":before");
    if (cs.position == "absolute" && cs.content.match(/^"\s*"$/)) {
      el.setAttribute("__fuckyou__before", 1);
    }
    cs = getComputedStyle(el, ":after");
    if (cs.position == "absolute" && cs.content.match(/^"\s*"$/)) {
      el.setAttribute("__fuckyou__after", 1);
    }
  });

  let styleEl = document.createElement("style"),
    styleSheet;
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;
  styleSheet.insertRule(
    "*[__fuckyou__before]:before { display: none !important; }",
    0
  );
  styleSheet.insertRule(
    "*[__fuckyou__after]:after { display: none !important; }",
    0
  );

  throw "";
}

chrome.action.onClicked.addListener(async function () {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: exit,
  });
});
