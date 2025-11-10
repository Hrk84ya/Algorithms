import heapq

def prim(graph):
    vertices = len(graph)
    in_mst = [False] * vertices
    min_heap = []
    total_weight = 0
    
    # Start from vertex 0
    in_mst[0] = True
    for i in range(1, vertices):
        if graph[0][i] != 0:
            heapq.heappush(min_heap, (graph[0][i], 0, i))
    
    print("Minimum Spanning Tree:")
    while min_heap:
        weight, u, v = heapq.heappop(min_heap)
        
        if in_mst[v]:
            continue
        
        in_mst[v] = True
        total_weight += weight
        print(f"{u} - {v}: {weight}")
        
        # Add all edges from v to heap
        for i in range(vertices):
            if not in_mst[i] and graph[v][i] != 0:
                heapq.heappush(min_heap, (graph[v][i], v, i))
    
    print(f"Total weight: {total_weight}")

if __name__ == "__main__":
    graph = [
        [0, 2, 0, 6, 0],
        [2, 0, 3, 8, 5],
        [0, 3, 0, 0, 7],
        [6, 8, 0, 0, 9],
        [0, 5, 7, 9, 0]
    ]
    
    prim(graph)