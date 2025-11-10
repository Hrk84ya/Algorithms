from collections import deque, defaultdict

class BreadthFirstSearch:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, source, destination):
        self.graph[source].append(destination)
    
    def bfs(self, start_vertex):
        visited = set()
        queue = deque([start_vertex])
        visited.add(start_vertex)
        
        while queue:
            vertex = queue.popleft()
            print(vertex, end=" ")
            
            for adjacent in self.graph[vertex]:
                if adjacent not in visited:
                    visited.add(adjacent)
                    queue.append(adjacent)

if __name__ == "__main__":
    graph = BreadthFirstSearch()
    graph.add_edge(0, 1)
    graph.add_edge(0, 2)
    graph.add_edge(1, 2)
    graph.add_edge(2, 0)
    graph.add_edge(2, 3)
    graph.add_edge(3, 3)
    
    print("BFS traversal starting from vertex 2:")
    graph.bfs(2)