(function() {
    // Helper: collect all components and their current props
    function gatherComponents() {
        if(!window.reactables) return [];
        return window.reactables.all().map((component, index) => ({
            name: `#${index} ${component.name}`,
            id: component.id,
            data: component.data
        }));
    }

    // Post the gathered data to the content script
    function postData() {
        const payload = gatherComponents();
        window.postMessage({
            source: 'reactables-watcher',
            command: 'reactablesData',
            payload
        }, window.location.origin);
    }

    // 1) On initial page load: send snapshot + set up update listeners
    window.addEventListener('load', () => {
        if(!window.reactables) return;

        // Send initial data
        postData();

        // Whenever a component fires its update-success event, re-send
        window.reactables.all().forEach(component => {
            component.el.addEventListener('reactables-update-success', postData);
        });
    });

    // 2) Listen for on-demand data requests (from DevTools → background → content → page)
    window.addEventListener('message', event => {
        // Only accept requests from our content script relay
        if(event.source !== window || event.data?.source !== 'reactables-devtools') return;

        if(event.data.command === 'getReactablesData') {
            postData();
        }

        if(event.data.command === 'refreshAllReactablesData') {
            if(!window.reactables) return;
            window.reactables.refreshAll();
        }
    });
})();
