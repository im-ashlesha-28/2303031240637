const WEIGHTS = { 'Placement': 3, 'Result': 2, 'Event': 1 };

export const extractTopPriority = (items, limit = 5) => {
  const sorted = [...items].sort((a, b) => {
    const wA = WEIGHTS[a.type] || 0;
    const wB = WEIGHTS[b.type] || 0;
    if (wA !== wB) return wB - wA;
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  });
  return sorted.slice(0, limit);
};
