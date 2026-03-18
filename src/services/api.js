const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, options = {}) {
  const requestConfig = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  };

  // Simulated latency keeps UI flows realistic while the backend endpoint is not wired.
  await wait(800);

  return {
    ok: true,
    status: 200,
    data: {
      id: crypto.randomUUID(),
      path: `${API_BASE_URL}${path}`,
      requestConfig,
      message: "Request accepted",
    },
  };
}

export async function submitLead(payload) {
  return request("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function trackInteraction(payload) {
  return request("/interactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
