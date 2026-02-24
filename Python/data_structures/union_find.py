class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return False  # Already in same set
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        self.components -= 1
        return True
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)
    
    def get_components(self):
        return self.components

if __name__ == "__main__":
    uf = UnionFind(10)
    
    print(f"Initial components: {uf.get_components()}")
    
    uf.union(1, 2)
    uf.union(2, 5)
    uf.union(5, 6)
    uf.union(6, 7)
    uf.union(3, 8)
    uf.union(8, 9)
    
    print(f"Components after unions: {uf.get_components()}")
    print(f"Are 1 and 5 connected? {uf.connected(1, 5)}")
    print(f"Are 5 and 7 connected? {uf.connected(5, 7)}")
    print(f"Are 4 and 9 connected? {uf.connected(4, 9)}")