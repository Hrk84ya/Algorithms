class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

def kruskal(edges, vertices):
    edges.sort(key=lambda x: x[2])  # Sort by weight
    uf = UnionFind(vertices)
    mst = []
    total_weight = 0
    
    for source, destination, weight in edges:
        if uf.union(source, destination):
            mst.append((source, destination, weight))
            total_weight += weight
            if len(mst) == vertices - 1:
                break
    
    print("Minimum Spanning Tree:")
    for source, destination, weight in mst:
        print(f"{source} - {destination}: {weight}")
    print(f"Total weight: {total_weight}")

if __name__ == "__main__":
    edges = [
        (0, 1, 10),
        (0, 2, 6),
        (0, 3, 5),
        (1, 3, 15),
        (2, 3, 4)
    ]
    
    kruskal(edges, 4)