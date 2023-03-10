const ReactablesWatcher = {};

ReactablesWatcher.toggle = function() {
    let watcherPanel = document.getElementById('reactables-watcher');
    if(watcherPanel) watcherPanel.classList.toggle('show');
}

ReactablesWatcher.init = function() {
    if(window.reactables) {

        // Inject watcher panel
        let watcherPanel = document.createElement('div');
        watcherPanel.id = 'reactables-watcher';
        document.body.append(watcherPanel);

        // Panel resizable
        let width = window.localStorage.getItem('reactables-watcher-width') || 300;
        watcherPanel.style.width = width + 'px';
        let m_pos;
        let min_width = 180;
        function resize(e) {
            let dx = m_pos - e.x;
            m_pos = e.x;
            let size = (parseInt(getComputedStyle(watcherPanel, '').width) + dx);
            if(size >= min_width) {
                watcherPanel.style.width = size + 'px';
                window.localStorage.setItem('reactables-watcher-width', size);
            }
        }

        watcherPanel.addEventListener('mousedown', function(e) {
            if(e.offsetX < 2) {
                m_pos = e.x;
                document.addEventListener('mousemove', resize, false);
            }
        }, false);

        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', resize, false);
        }, false);

        // Parse components
        let componentList = [];
        window.reactables.all().forEach((component, key) => {

            componentList.push({
                name: '#' + key + ' ' + component.name,
                id: component.id,
                el: component.el,
                data: component.data
            });

            buildComponentList();

            component.el.addEventListener('reactables-update-success', function() {
                componentList[key].data = component.data;
                buildComponentList();
            });

        });

        // Get element offset
        function getOffset(el) {
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY
            };
        }

        // Update component list
        function buildComponentList() {
            watcherPanel.innerHTML = '';

            componentList.forEach((component, key) => {
                // Component title
                let titleDiv = document.createElement('div');
                titleDiv.className = 'reactables-watcher-title';
                titleDiv.innerText = component.name;
                titleDiv.title = 'id: ' + component.id;

                // Focus indicator
                let focusDiv = document.createElement('div');
                let elOffset = getOffset(component.el);
                focusDiv.className = 'reactables-watcher-focus';
                focusDiv.style.left = elOffset.left + 'px';
                focusDiv.style.top = elOffset.top + 'px';
                focusDiv.style.width = component.el.offsetWidth + 'px';
                focusDiv.style.height = component.el.offsetHeight + 'px';

                titleDiv.onmouseenter = function() {
                    document.body.appendChild(focusDiv);
                }

                titleDiv.onmouseleave = function() {
                    document.body.removeChild(focusDiv);
                }

                // List of properties
                let listDiv = document.createElement('div');
                listDiv.className = 'reactables-watcher-list';

                for(let key in component.data) {
                    let item = document.createElement('div');
                    item.innerText = JSON.stringify(component.data[key]);
                    item.innerHTML = '<strong>' + key + ':</strong> ' + item.innerText;
                    listDiv.appendChild(item);
                }

                watcherPanel.appendChild(titleDiv);
                watcherPanel.appendChild(listDiv);
            });
        }

        ReactablesWatcher.ready = true;
    }
}

ReactablesWatcher.init();

// Listen toggle command
window.addEventListener('message', event => {
    if(event.origin !== window.location.origin) return;
    let eventData = event.data;
    if(!eventData || typeof eventData !== 'string') return;

    try {
        eventData = JSON.parse(eventData);
    } catch(e) {
        // Ignore
    }

    if(eventData.command === 'reactables-watcher-toggle') {
        if(!ReactablesWatcher.ready) return alert('This page does not use Reactables!');
        ReactablesWatcher.toggle();
    }
}, false);