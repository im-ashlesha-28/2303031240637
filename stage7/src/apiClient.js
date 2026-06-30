import { logEvent } from './utils/logger';

const API_URL = 'http://4.2.2.136/evaluation-service/notifications';

export const getNotifications = async (page = 1, type = 'All') => {
  const params = new URLSearchParams({ page, limit: 10 });
  if (type !== 'All') params.append('notification_type', type);

  try {
    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (err) {
    logEvent('NETWORK_ERR', 'fetch failed', err.message);
    return [];
  }
};
