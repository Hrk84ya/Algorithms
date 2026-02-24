def floyd_warshall(graph):
    vertices = len(graph)
    distance = [[float('inf')] * vertices for _ in range(vertices)]
    
    # Initialize distance matrix
    for i in range(vertices):
        for j in range(vertices):
            distance[i][j] = graph[i][j]
    
    # Floyd-Warshall algorithm
    for k in range(vertices):
        for i in range(vertices):
            for j in range(vertices):
                if distance[i][k] + distance[k][j] < distance[i][j]:
                    distance[i][j] = distance[i][k] + distance[k][j]
    
    print_solution(distance)

def print_solution(distance):
    vertices = len(distance)
    print("Shortest distances between every pair of vertices:")
    for i in range(vertices):
        for j in range(vertices):
            if distance[i][j] == float('inf'):
                print("INF", end=" ")
            else:
                print(distance[i][j], end=" ")
        print()

if __name__ == "__main__":
    INF = float('inf')
    graph = [
        [0, 5, INF, 10],
        [INF, 0, 3, INF],
        [INF, INF, 0, 1],
        [INF, INF, INF, 0]
    ]
    
    floyd_warshall(graph)