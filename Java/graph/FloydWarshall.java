public class FloydWarshall {
    private static final int INF = 99999;
    
    public static void floydWarshall(int[][] graph) {
        int vertices = graph.length;
        int[][] distance = new int[vertices][vertices];
        
        // Initialize distance matrix
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                distance[i][j] = graph[i][j];
            }
        }
        
        // Floyd-Warshall algorithm
        for (int k = 0; k < vertices; k++) {
            for (int i = 0; i < vertices; i++) {
                for (int j = 0; j < vertices; j++) {
                    if (distance[i][k] + distance[k][j] < distance[i][j]) {
                        distance[i][j] = distance[i][k] + distance[k][j];
                    }
                }
            }
        }
        
        printSolution(distance);
    }
    
    private static void printSolution(int[][] distance) {
        int vertices = distance.length;
        System.out.println("Shortest distances between every pair of vertices:");
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                if (distance[i][j] == INF) {
                    System.out.print("INF ");
                } else {
                    System.out.print(distance[i][j] + " ");
                }
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 5, INF, 10},
            {INF, 0, 3, INF},
            {INF, INF, 0, 1},
            {INF, INF, INF, 0}
        };
        
        floydWarshall(graph);
    }
}