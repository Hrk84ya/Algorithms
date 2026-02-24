import java.util.*;

public class DepthFirstSearch {
    
    // Method to perform DFS
    public static void dfs(int startVertex, Map<Integer, List<Integer>> graph) {
        // Create a set to track visited vertices
        Set<Integer> visited = new HashSet<>();
        // Call the recursive DFS helper method
        dfsHelper(startVertex, graph, visited);
    }
    
    // Helper method for DFS
    private static void dfsHelper(int vertex, Map<Integer, List<Integer>> graph, Set<Integer> visited) {
        // Mark the current vertex as visited
        visited.add(vertex);
        // Print the current vertex
        System.out.print(vertex + " ");
        
        // Recur for all adjacent vertices
        for (int neighbor : graph.get(vertex)) {
            if (!visited.contains(neighbor)) {
                dfsHelper(neighbor, graph, visited);
            }
        }
    }

    public static void main(String[] args) {
        // Create a graph using an adjacency list
        Map<Integer, List<Integer>> graph = new HashMap<>();
        
        // Adding vertices and their edges
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3, 4));
        graph.put(2, Arrays.asList(0, 5));
        graph.put(3, Arrays.asList(1));
        graph.put(4, Arrays.asList(1, 5));
        graph.put(5, Arrays.asList(2, 4));
        
        // Perform DFS starting from vertex 0
        System.out.println("DFS traversal starting from vertex 0:");
        dfs(0, graph);
    }
}
