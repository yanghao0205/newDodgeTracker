const API_HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
};


export async function create(method, endpoint, action) {
    const initialize = {
        method: method.toUpperCase(),
        headers: API_HEADERS,
        ...action ? { body: JSON.stringify(action) } : undefined  
    };

    try {
        const request = await fetch(endpoint, initialize);
        if (!request.ok) {
            throw new Error(`HTTP error! status: ${request.status}`);
        }
        const text = await request.text();
        if (!text) return true; // Empty response (e.g. 204), but request succeeded
        return JSON.parse(text);
    } catch (error) {
        console.error(`[DodgeTracker] Error in create(${method} ${endpoint}): ${error}`);
        return null;
    }
}

export async function observeQueue(callback) {
    const uri = document.querySelector('link[rel="riot:plugins:websocket"]').href
	const ws = new WebSocket(uri, 'wamp')

    const endpoint = "/lol-gameflow/v1/gameflow-phase".replaceAll("/", "_")

	ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + endpoint]))
	ws.onmessage = callback
}