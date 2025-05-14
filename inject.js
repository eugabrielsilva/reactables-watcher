if(window.top === window) {
    // Inject the Reactables watcher into page context
    const watcherScript = document.createElement('script');
    watcherScript.src = chrome.runtime.getURL('reactables-watcher.js');
    document.head.appendChild(watcherScript);

    // Listen for data posted from reactables-watcher.js
    window.addEventListener('message', event => {
        // Only accept messages from our injected script
        if(event.source !== window || event.data?.source !== 'reactables-watcher') return;

        if(event.data.command === 'reactablesData') {
            // Forward the components data to background/devtools
            chrome.runtime.sendMessage({
                command: 'reactablesData',
                payload: event.data.payload
            });
        }
    });

    // Listen for requests from background/devtools
    chrome.runtime.onMessage.addListener((message) => {
        if(message.command === 'getReactablesData') {
            // Ask the page script to re-send its data
            window.postMessage({
                source: 'reactables-devtools',
                command: 'getReactablesData'
            }, window.location.origin);
        }

        if(message.command === 'refreshAllReactablesData') {
            // Ask the page script to refresh all components
            window.postMessage({
                source: 'reactables-devtools',
                command: 'refreshAllReactablesData'
            }, window.location.origin);
        }
    });
}
