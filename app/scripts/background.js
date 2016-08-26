'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  App.turnOn();
});

chrome.browserAction.onClicked.addListener(function(tab) {
  let active = JSON.parse(AppService.get('local2ip'));
  if (active) {
    App.turnOff();
  } else {
    App.turnOn();
  }
});
