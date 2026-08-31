// DodgeTracker — LCU transport layer.
//
// Inside the Riot client renderer, fetch() routes to the LCU with auth
// handled automatically (same-origin). This module wraps the common request
// patterns and — crucially — propagates errors instead of swallowing them:
// every failure throws an Error whose message carries the HTTP status code
// and the first 240 chars of Riot's response body, so a 404 from a removed
// endpoint is immediately distinguishable from empty data.
//
// Event subscriptions go through subscribe(): it wraps the callback in a
// try/catch (one subscriber throwing must not break the rest) and returns
// an unsubscribe function for cleanup on unload/hot-reload.

const TAG = "[DodgeTracker][lcu]";

async function request(method, path, body) {
    const init = { method, headers: { "accept": "application/json" } };
    if (body != null) {
        init.headers["content-type"] = "application/json";
        init.body = JSON.stringify(body);
    }

    let res;
    try {
        res = await fetch(path, init);
    } catch (e) {
        throw new Error(`${method} ${path} → network error: ${e?.message ?? e}`);
    }

    if (!res.ok && res.status !== 204) {
        // Capture LCU's error body so callers can see Riot's actual complaint
        // instead of a bare status code.
        let detail = "";
        try { detail = (await res.text()).slice(0, 240); } catch {}
        throw new Error(`${method} ${path} → ${res.status}${detail ? `: ${detail}` : ""}`);
    }

    const text = await res.text();
    if (!text) return null; // 204 / empty body — success with no data
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`${method} ${path} → invalid JSON response (${e?.message ?? e})`);
    }
}

export function get(path) {
    return request("GET", path, null);
}

export function post(path, body) {
    return request("POST", path, body ?? {});
}

export function put(path, body) {
    return request("PUT", path, body ?? {});
}

export function patch(path, body) {
    return request("PATCH", path, body ?? {});
}

export function del(path) {
    return request("DELETE", path, null);
}

/**
 * Subscribe to an LCU WAMP event via Pengu's context.socket.
 * Returns an unsubscribe function (no-op if the socket lacks unobserve).
 */
export function subscribe(socket, eventPath, callback) {
    if (!socket || typeof socket.observe !== "function") {
        console.error(`${TAG} subscribe: no usable socket for ${eventPath}`);
        return () => {};
    }
    const handler = (msg) => {
        try {
            callback(msg);
        } catch (e) {
            console.error(`${TAG} subscriber threw for ${eventPath}:`, e);
        }
    };
    socket.observe(eventPath, handler);
    return () => {
        try {
            socket.unobserve?.(eventPath, handler);
        } catch (e) {
            console.warn(`${TAG} unobserve failed for ${eventPath}:`, e);
        }
    };
}
