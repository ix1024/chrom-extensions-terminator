(function () {
  var allListeners = new WeakMap();

  var add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (eventName, eventHandler) {
    add.call(this, eventName, eventHandler);
    if (!allListeners.has(this)) {
      allListeners.set(this, {});
    }
    var listeners = allListeners.get(this);
    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }
    listeners[eventName].push(eventHandler);
  };

  var remove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (
    eventName,
    eventHandler
  ) {
    remove.call(this, eventName, eventHandler);
    var listeners = allListeners.get(this);
    if (listeners && listeners[eventName]) {
      var index = listeners[eventName].indexOf(eventHandler);
      if (index !== -1) {
        listeners[eventName].splice(index, 1);
      }
    }
  };

  window.getEventListeners = function (obj) {
    return allListeners.get(obj);
  };
})();
console.clear();

// console.clear();
// 查看页面中所有的元素
Array.from(document.querySelectorAll("*")).forEach((item) => {
  if (typeof window.getEventListeners === "function") {
    const events = getEventListeners(item);
    if (!events) {
      return;
    }
    Object.keys(events)?.forEach((type) => {
      console.log(type, events[type]);
      events[type]?.forEach((event) => {
        item.removeEventListener(type, event.listener);
      });
      item[type] = null;
    });
  }
});

const cale = (ev) => {
  const { target } = ev;
  const { nodeName } = target;
  var closestLink = event.target.closest("a");
  const href = closestLink?.href;
  if (
    location.hostname === "blog.csdn.net" &&
    typeof href === "string" &&
    href.length
  ) {
    console.log(target, nodeName, target?.onclick);
    // 移除target 绑定的事件
    // ev.preventDefault();
    target?.removeAttribute("onclick");
    target?.removeEventListener("click", target?.onclick);
    try {
    } catch (error) {}
    ev.preventDefault();
    ev.stopPropagation();
    window.open(href);

    return;
  }
  // 处理知乎的外链
  if (
    typeof href === "string" &&
    (href?.includes("link.zhihu.com") ||
      href?.includes("link.juejin") ||
      href?.includes("link.csdn.net"))
  ) {
    ev.preventDefault();
    ev.stopPropagation();

    // 使用正则表达式提取 target 参数值
    // 使用正则表达式提取目标值
    var pattern = /target=([^&]+)/;
    var match = href.match(pattern);
    if (match) {
      var targetValue = match[1];
      var url = decodeURIComponent(targetValue);
      console.log(match, url);
      window.open(url);
    }
  }
};
window.addEventListener("click", cale, false);
document.addEventListener("click", cale, false);
document.body.addEventListener("click", cale, false);
