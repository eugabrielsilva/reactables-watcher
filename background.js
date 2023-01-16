chrome.browserAction.onClicked.addListener(function(tab) {
    var message = {
        command: 'reactables-watcher-toggle'
    };
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
});