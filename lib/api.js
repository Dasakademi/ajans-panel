const API = process.env.NEXT_PUBLIC_API_URL || 'https://dasakademi-bot-production.up.railway.app';

export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('API hatası:', e);
    return null;
  }
}

export const api = {
  health: () => apiFetch('/health'),
  dashboard: () => apiFetch('/dashboard'),
  clients: () => apiFetch('/clients'),
  client: (id) => apiFetch(`/clients/${id}`),
  clientMetrics: (id, days = 7) => apiFetch(`/clients/${id}/metrics?days=${days}`),
  analyzeClient: (id) => apiFetch(`/clients/${id}/analyze`, { method: 'POST' }),
  tasks: () => apiFetch('/tasks'),
  completeTask: (id) => apiFetch(`/tasks/${id}/complete`, { method: 'POST' }),
  triggerReport: () => apiFetch('/reports/daily', { method: 'POST' }),
};
