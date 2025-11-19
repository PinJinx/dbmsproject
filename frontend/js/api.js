const BASE_URL = "http://192.168.7.138:5000";



async function apiPost(path, data) {
  try {
    const res = await fetch(BASE_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { error: String(err) };
  }
}

async function apiGet(path) {
  try {
    const res = await fetch(BASE_URL + path);
    return await res.json();
  } catch (err) {
    return { error: String(err) };
  }
}

