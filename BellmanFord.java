import java.util.*;

public class BellmanFord {
    static class Edge {
        int source, destination, weight;
        
        Edge(int source, int destination, int weight) {
            this.source = source;
            this.destination = destination;
            this.weight = weight;
        }
    }
    
    private int vertices;
    private List<Edge> edges;
    
    public BellmanFord(int vertices) {
        this.vertices = vertices;
        this.edges = new ArrayList<>();
    }
    
    public void addEdge(int source, int destination, int weight) {
        edges.add(new Edge(source, destination, weight));
    }
    
    public void bellmanFord(int source) {
        int[] distance = new int[vertices];
        Arrays.fill(distance, Integer.MAX_VALUE);
        distance[source] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < vertices - 1; i++) {
            for (Edge edge : edges) {
                if (distance[edge.source] != Integer.MAX_VALUE && 
                    distance[edge.source] + edge.weight < distance[edge.destination]) {
                    distance[edge.destination] = distance[edge.source] + edge.weight;
                }
            }
        }
        
        // Check for negative cycles
        for (Edge edge : edges) {
            if (distance[edge.source] != Integer.MAX_VALUE && 
                distance[edge.source] + edge.weight < distance[edge.destination]) {
                System.out.println("Graph contains negative cycle");
                return;
            }
        }
        
        // Print distances
        for (int i = 0; i < vertices; i++) {
            System.out.println("Distance from " + source + " to " + i + ": " + distance[i]);
        }
    }
    
    public static void main(String[] args) {
        BellmanFord graph = new BellmanFord(5);
        graph.addEdge(0, 1, -1);
        graph.addEdge(0, 2, 4);
        graph.addEdge(1, 2, 3);
        graph.addEdge(1, 3, 2);
        graph.addEdge(1, 4, 2);
        graph.addEdge(3, 2, 5);
        graph.addEdge(3, 1, 1);
        graph.addEdge(4, 3, -3);
        
        graph.bellmanFord(0);
    }
}