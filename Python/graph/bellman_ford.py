class BellmanFord:
    def __init__(self, vertices):
        self.vertices = vertices
        self.edges = []
    
    def add_edge(self, source, destination, weight):
        self.edges.append((source, destination, weight))
    
    def bellman_ford(self, source):
        distance = [float('inf')] * self.vertices
        distance[source] = 0
        
        # Relax all edges V-1 times
        for _ in range(self.vertices - 1):
            for source_v, dest_v, weight in self.edges:
                if distance[source_v] != float('inf') and distance[source_v] + weight < distance[dest_v]:
                    distance[dest_v] = distance[source_v] + weight
        
        # Check for negative cycles
        for source_v, dest_v, weight in self.edges:
            if distance[source_v] != float('inf') and distance[source_v] + weight < distance[dest_v]:
                print("Graph contains negative cycle")
                return
        
        # Print distances
        for i in range(self.vertices):
            print(f"Distance from {source} to {i}: {distance[i]}")

if __name__ == "__main__":
    graph = BellmanFord(5)
    graph.add_edge(0, 1, -1)
    graph.add_edge(0, 2, 4)
    graph.add_edge(1, 2, 3)
    graph.add_edge(1, 3, 2)
    graph.add_edge(1, 4, 2)
    graph.add_edge(3, 2, 5)
    graph.add_edge(3, 1, 1)
    graph.add_edge(4, 3, -3)
    
    graph.bellman_ford(0)