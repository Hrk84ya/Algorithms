import java.util.*;

public class KruskalAlgorithm {
    static class Edge implements Comparable<Edge> {
        int source, destination, weight;
        
        Edge(int source, int destination, int weight) {
            this.source = source;
            this.destination = destination;
            this.weight = weight;
        }
        
        public int compareTo(Edge other) {
            return Integer.compare(this.weight, other.weight);
        }
    }
    
    static class UnionFind {
        int[] parent, rank;
        
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        
        boolean union(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            
            if (rootX == rootY) return false;
            
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            return true;
        }
    }
    
    public static void kruskal(List<Edge> edges, int vertices) {
        Collections.sort(edges);
        UnionFind uf = new UnionFind(vertices);
        List<Edge> mst = new ArrayList<>();
        int totalWeight = 0;
        
        for (Edge edge : edges) {
            if (uf.union(edge.source, edge.destination)) {
                mst.add(edge);
                totalWeight += edge.weight;
                if (mst.size() == vertices - 1) break;
            }
        }
        
        System.out.println("Minimum Spanning Tree:");
        for (Edge edge : mst) {
            System.out.println(edge.source + " - " + edge.destination + ": " + edge.weight);
        }
        System.out.println("Total weight: " + totalWeight);
    }
    
    public static void main(String[] args) {
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 10),
            new Edge(0, 2, 6),
            new Edge(0, 3, 5),
            new Edge(1, 3, 15),
            new Edge(2, 3, 4)
        );
        
        kruskal(edges, 4);
    }
}