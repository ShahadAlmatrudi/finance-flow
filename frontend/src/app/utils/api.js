const BASE_URL = "https://finance-flow-7fk1.onrender.com";

function getToken() {
  const data = localStorage.getItem("financeFlowData");
  if (!data) return null;
  const parsed = JSON.parse(data);
  return parsed?.user?.token || null;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}