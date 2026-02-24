import java.util.*;

public class PrimAlgorithm {
    static class Edge implements Comparable<Edge> {
        int vertex, weight;
        
        Edge(int vertex, int weight) {
            this.vertex = vertex;
            this.weight = weight;
        }
        
        public int compareTo(Edge other) {
            return Integer.compare(this.weight, other.weight);
        }
    }
    
    public static void prim(int[][] graph) {
        int vertices = graph.length;
        boolean[] inMST = new boolean[vertices];
        PriorityQueue<Edge> pq = new PriorityQueue<>();
        int totalWeight = 0;
        
        // Start from vertex 0
        inMST[0] = true;
        for (int i = 1; i < vertices; i++) {
            if (graph[0][i] != 0) {
                pq.add(new Edge(i, graph[0][i]));
            }
        }
        
        System.out.println("Minimum Spanning Tree:");
        while (!pq.isEmpty() && Arrays.stream(inMST).allMatch(x -> x) == false) {
            Edge minEdge = pq.poll();
            int v = minEdge.vertex;
            
            if (inMST[v]) continue;
            
            inMST[v] = true;
            totalWeight += minEdge.weight;
            
            // Find which vertex connects to v with minimum weight
            for (int u = 0; u < vertices; u++) {
                if (inMST[u] && graph[u][v] == minEdge.weight) {
                    System.out.println(u + " - " + v + ": " + minEdge.weight);
                    break;
                }
            }
            
            // Add all edges from v to priority queue
            for (int i = 0; i < vertices; i++) {
                if (!inMST[i] && graph[v][i] != 0) {
                    pq.add(new Edge(i, graph[v][i]));
                }
            }
        }
        
        System.out.println("Total weight: " + totalWeight);
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 2, 0, 6, 0},
            {2, 0, 3, 8, 5},
            {0, 3, 0, 0, 7},
            {6, 8, 0, 0, 9},
            {0, 5, 7, 9, 0}
        };
        
        prim(graph);
    }
}