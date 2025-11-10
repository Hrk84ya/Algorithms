import java.util.*;

public class BreadthFirstSearch {
    private int vertices;
    private LinkedList<Integer>[] adjacencyList;
    
    public BreadthFirstSearch(int vertices) {
        this.vertices = vertices;
        adjacencyList = new LinkedList[vertices];
        for (int i = 0; i < vertices; i++) {
            adjacencyList[i] = new LinkedList<>();
        }
    }
    
    public void addEdge(int source, int destination) {
        adjacencyList[source].add(destination);
    }
    
    public void bfs(int startVertex) {
        boolean[] visited = new boolean[vertices];
        Queue<Integer> queue = new LinkedList<>();
        
        visited[startVertex] = true;
        queue.add(startVertex);
        
        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            System.out.print(vertex + " ");
            
            for (int adjacent : adjacencyList[vertex]) {
                if (!visited[adjacent]) {
                    visited[adjacent] = true;
                    queue.add(adjacent);
                }
            }
        }
    }
    
    public static void main(String[] args) {
        BreadthFirstSearch graph = new BreadthFirstSearch(4);
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);
        graph.addEdge(1, 2);
        graph.addEdge(2, 0);
        graph.addEdge(2, 3);
        graph.addEdge(3, 3);
        
        System.out.println("BFS traversal starting from vertex 2:");
        graph.bfs(2);
    }
}