import java.util.*;

public class DijkstraAlgorithm {
    private int vertices;
    private List<List<Node>> adjacencyList;
    
    static class Node implements Comparable<Node> {
        int vertex, weight;
        
        Node(int vertex, int weight) {
            this.vertex = vertex;
            this.weight = weight;
        }
        
        public int compareTo(Node other) {
            return Integer.compare(this.weight, other.weight);
        }
    }
    
    public DijkstraAlgorithm(int vertices) {
        this.vertices = vertices;
        adjacencyList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            adjacencyList.add(new ArrayList<>());
        }
    }
    
    public void addEdge(int source, int destination, int weight) {
        adjacencyList.get(source).add(new Node(destination, weight));
        adjacencyList.get(destination).add(new Node(source, weight));
    }
    
    public void dijkstra(int source) {
        int[] distance = new int[vertices];
        Arrays.fill(distance, Integer.MAX_VALUE);
        distance[source] = 0;
        
        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(source, 0));
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;
            
            for (Node neighbor : adjacencyList.get(u)) {
                int v = neighbor.vertex;
                int weight = neighbor.weight;
                
                if (distance[u] + weight < distance[v]) {
                    distance[v] = distance[u] + weight;
                    pq.add(new Node(v, distance[v]));
                }
            }
        }
        
        // Print shortest distances
        for (int i = 0; i < vertices; i++) {
            System.out.println("Distance from " + source + " to " + i + ": " + distance[i]);
        }
    }
    
    public static void main(String[] args) {
        DijkstraAlgorithm graph = new DijkstraAlgorithm(6);
        graph.addEdge(0, 1, 4);
        graph.addEdge(0, 2, 3);
        graph.addEdge(1, 2, 1);
        graph.addEdge(1, 3, 2);
        graph.addEdge(2, 3, 4);
        graph.addEdge(3, 4, 2);
        graph.addEdge(4, 5, 6);
        
        graph.dijkstra(0);
    }
}