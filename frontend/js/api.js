const BASE_URL = "http://127.0.0.1:5000";

async function apiPost(url, data) {
    const res = await fetch(BASE_URL + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return res.json();
}

async function apiGet(url) {
    const res = await fetch(BASE_URL + url);
    return res.json();
}
