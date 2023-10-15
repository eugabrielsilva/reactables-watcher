if(window.top === window) {
    // Viewer
    let viewerScript = document.createElement('script');
    viewerScript.type = 'text/javascript';
    viewerScript.src = chrome.runtime.getURL('/jsonview.js');
    document.head.appendChild(viewerScript);

    // Inspector
    let inspectorScript = document.createElement('script');
    inspectorScript.type = 'text/javascript';
    inspectorScript.src = chrome.runtime.getURL('/reactables-watcher.js');
    document.head.appendChild(inspectorScript);

    if('chrome' in window) {
        chrome.runtime.onMessage.addListener(function(message, sender) {
            if(message.command && message.command === 'reactables-watcher-toggle') {
                window.postMessage(JSON.stringify(message), window.location.origin);
            }
        });
    }
}