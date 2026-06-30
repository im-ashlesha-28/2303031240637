import urllib.request
import json
import heapq
from datetime import datetime

PRIORITIES = {'Placement': 3, 'Result': 2, 'Event': 1}

class Notif:
    def __init__(self, data):
        self.data = data
        self.weight = PRIORITIES.get(data.get('type'), 0)
        try:
            d_str = data.get('createdAt', '').replace('Z', '+00:00')
            self.ts = datetime.fromisoformat(d_str).timestamp()
        except:
            self.ts = 0.0

    def __lt__(self, other):
        if self.weight == other.weight:
            return self.ts < other.ts
        return self.weight < other.weight
        
def fetch_data():
    url = "http://4.2.2.213/evaluation-service/notifications"
    req = urllib.request.Request(url, headers={'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            if res.status == 200:
                raw = json.loads(res.read().decode('utf-8'))
                return raw if isinstance(raw, list) else raw.get('data', [])
    except Exception as e:
        print(f"fetch err: {e}")
    return []

def get_top_10(items):
    heap = []
    for x in items:
        if x.get('isRead') is False:
            n = Notif(x)
            if len(heap) < 10:
                heapq.heappush(heap, n)
            elif heap[0] < n:
                heapq.heappushpop(heap, n)
                
    return [node.data for node in sorted(heap, reverse=True)]

if __name__ == "__main__":
    notifs = fetch_data()
    top = get_top_10(notifs)
    for i, n in enumerate(top, 1):
        print(f"{i}. [{n.get('type')}] {n.get('title')}")
