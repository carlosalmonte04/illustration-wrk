(function trackPageInteractions() {
  function elementLabel(el) {
    if (!el || el === document || el === window) {
      return "document";
    }

    var tag = (el.tagName || "unknown").toLowerCase();
    var id = el.id ? "#" + el.id : "";
    var className =
      typeof el.className === "string" && el.className.trim()
        ? "." + el.className.trim().split(/\s+/).join(".")
        : "";

    return (tag + id + className).slice(0, 120);
  }

  function send(name, params) {
    if (typeof gtag === "function") {
      gtag("event", name, params);
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      send("page_click", {
        event_category: "interaction",
        x: event.clientX,
        y: event.clientY,
        button: event.button,
        target: elementLabel(event.target),
      });
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (event) {
      var target = event.target;
      var isSensitive =
        target &&
        ((target.tagName === "INPUT" &&
          /password|email|hidden/i.test(target.type || "")) ||
          target.autocomplete === "current-password" ||
          target.autocomplete === "new-password");

      send("page_keydown", {
        event_category: "interaction",
        key: isSensitive ? "[redacted]" : event.key,
        code: event.code,
        target: elementLabel(target),
        ctrl: event.ctrlKey,
        alt: event.altKey,
        meta: event.metaKey,
        shift: event.shiftKey,
      });
    },
    true
  );
})();
