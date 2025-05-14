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

// Send refresh all message on click
document.querySelector('#reactables-watcher .actions #btn-update').addEventListener('click', () => {
    port.postMessage({command: 'refreshAll'});
    console.log('[reactables-watcher] [SENT] refreshAll');
});

// Update component list
document.querySelector('#reactables-watcher .actions #btn-refresh').addEventListener('click', () => {
    port.postMessage({command: 'getData'});
    console.log('[reactables-watcher] [SENT] getData');
});

// Render the list of components into the panel
function renderComponentList(components) {
    const container = document.querySelector('#reactables-watcher .body');
    container.innerHTML = '';

    components.forEach((comp) => {
        // Wrapper for a single component entry
        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';

        // Title element
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = comp.name;
        title.title = `id: ${comp.id}`;

        // JSON data list
        const listDiv = document.createElement('div');
        listDiv.className = 'list';
        const tree = jsonview.create(comp.data);
        jsonview.render(tree, listDiv);
        jsonview.toggleNode(tree);

        // Assemble and append
        wrapper.appendChild(title);
        wrapper.appendChild(listDiv);
        container.appendChild(wrapper);
    });
}
