// Open a persistent connection to background.js
const port = chrome.runtime.connect({name: 'reactables-panel'});

// Request initial data as soon as the panel loads
port.postMessage({command: 'getData'});
console.log('[reactables-watcher] [SENT] getData');

// Listen for data updates from background.js
port.onMessage.addListener((message) => {
    if(message.command === 'updateData') {
        console.log('[reactables-watcher] [RECEIVED] updateData');
        renderComponentList(message.payload);
    }
});

// Get the watcher panel
const $watcher = $('#reactables-watcher');

// Send refresh all message on click
$watcher.find('.actions #btn-update').on('click', function() {
    port.postMessage({command: 'refreshAll'});
    console.log('[reactables-watcher] [SENT] refreshAll');
});

// Update component list
$watcher.find('.actions #btn-refresh').on('click', function() {
    port.postMessage({command: 'getData'});
    console.log('[reactables-watcher] [SENT] getData');
});

// Render the list of components into the panel
function renderComponentList(components) {
    const $container = $watcher.find('.body');
    $container.empty();

    components.forEach((comp) => {
        // Wrapper for a single component entry
        const $wrapper = $('<div>', {class: 'wrapper'});

        // Title element
        const $title = $('<div>', {
            class: 'title',
            text: comp.name,
            title: `id: ${comp.id}`
        });

        // JSON data list
        const $listDiv = $('<div>', {class: 'list'});
        $listDiv.jsonViewer(comp.data, {
            withLinks: false,
            bigNumbers: true
        });

        // Assemble and append
        $wrapper.append($title, $listDiv);
        $container.append($wrapper);
    });
}
