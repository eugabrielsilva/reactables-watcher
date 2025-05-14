let panelPort = null;

// Listen for a connection from the DevTools panel
chrome.runtime.onConnect.addListener((port) => {
    if(port.name === 'reactables-panel') {
        panelPort = port;

        // When the panel requests data, ask the content script in the active tab
        port.onMessage.addListener((msg) => {
            if(msg.command === 'getData') {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    const tabId = tabs[0]?.id;
                    if(tabId != null) chrome.tabs.sendMessage(tabId, {command: 'getReactablesData'});
                });
            }

            // When the panel sends a refresh command, ask the content script in the active tab
            if(msg.command === 'refreshAll') {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    const tabId = tabs[0]?.id;
                    if(tabId != null) chrome.tabs.sendMessage(tabId, {command: 'refreshAllReactablesData'});
                });
            }
        });

        // Clean up when the panel is closed or reloaded
        port.onDisconnect.addListener(() => {
            panelPort = null;
        });
    }
});

// Relay component data from the content script to the DevTools panel
chrome.runtime.onMessage.addListener((message) => {
    if(message.command === 'reactablesData' && panelPort) {
        panelPort.postMessage({
            command: 'updateData',
            payload: message.payload
        });
    }
});
