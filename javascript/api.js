const BASE_URL = "http://localhost:3000";

async function api(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : null
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
