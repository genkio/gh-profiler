import { browser } from "webextension-polyfill-ts";

browser.runtime.onMessage.addListener((message) => {
  if (message.getDOM) {
    browser.runtime.sendMessage({ DOM: document.body.innerHTML });
  }
});
