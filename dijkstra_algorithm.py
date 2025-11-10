import heapq
from collections import defaultdict

class DijkstraAlgorithm:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, source, destination, weight):
        self.graph[source].append((destination, weight))
        self.graph[destination].append((source, weight))
    
    def dijkstra(self, source, vertices):
        distance = [float('inf')] * vertices
        distance[source] = 0
        pq = [(0, source)]
        
        while pq:
            current_dist, u = heapq.heappop(pq)
            
            if current_dist > distance[u]:
                continue
            
            for v, weight in self.graph[u]:
                if distance[u] + weight < distance[v]:
                    distance[v] = distance[u] + weight
                    heapq.heappush(pq, (distance[v], v))
        
        # Print shortest distances
        for i in range(vertices):
            print(f"Distance from {source} to {i}: {distance[i]}")

if __name__ == "__main__":
    graph = DijkstraAlgorithm()
    graph.add_edge(0, 1, 4)
    graph.add_edge(0, 2, 3)
    graph.add_edge(1, 2, 1)
    graph.add_edge(1, 3, 2)
    graph.add_edge(2, 3, 4)
    graph.add_edge(3, 4, 2)
    graph.add_edge(4, 5, 6)
    
    graph.dijkstra(0, 6)