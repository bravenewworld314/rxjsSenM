const { fromEvent, from } = rxjs;
const { map, throttleTime, switchMap, retry, catchError } = rxjs.operators;

const input = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const messageDiv = document.getElementById('message');

function getJSON(query) {
    const url = `https://archive.org/services/search/v1/scrape?q=${encodeURIComponent(query)}&count=10`;
    return from(
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server error');
                }
                return response.json();
            })
    );
}

function showMessage(message, type = 'error') {
    messageDiv.textContent = message;
    messageDiv.className = type;
}

function updateSearchResults(resultSet) {
    messageDiv.textContent = '';
    messageDiv.className = '';
    
    if (!resultSet.items || resultSet.items.length === 0) {
        resultsDiv.innerHTML = '<p class="loading">No results found.</p>';
        return;
    }
    
    resultsDiv.innerHTML = resultSet.items.map(item => `
        <div class="result-item">
            <h3><a href="https://archive.org/details/${item.identifier}" target="_blank">${item.title || item.identifier}</a></h3>
            <p><strong>Type:</strong> ${item.mediatype || 'N/A'}</p>
            ${item.description ? `<p>${item.description.substring(0, 200)}${item.description.length > 200 ? '...' : ''}</p>` : ''}
            ${item.creator ? `<p><strong>Creator:</strong> ${item.creator}</p>` : ''}
        </div>
    `).join('');
}

const keyPresses = fromEvent(input, 'input');

const searchResultSets = keyPresses.pipe(
    throttleTime(250),
    map(() => input.value.trim()),
    switchMap(query => {
        if (!query) {
            resultsDiv.innerHTML = '';
            messageDiv.textContent = '';
            messageDiv.className = '';
            return from([{ items: [] }]);
        }
        
        showMessage('Searching...', 'info');
        return getJSON(query).pipe(
            retry(3),
            catchError(error => {
                showMessage('The server appears to be down.');
                return from([{ items: [] }]);
            })
        );
    })
);

searchResultSets.subscribe(
    resultSet => updateSearchResults(resultSet),
    error => showMessage('The server appears to be down.')
);
