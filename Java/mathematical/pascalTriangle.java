public class pascalTriangle {
    public static int pascal(int row, int col) {
        if (col == 0 || col == row) {
            return 1;
        }
        return pascal(row - 1, col - 1) + pascal(row - 1, col);
    }

    public static void printPascalTriangle(int rows) {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < rows - i - 1; j++) {
                System.out.print(" ");
            }
            for (int j = 0; j <= i; j++) {
                System.out.print(pascal(i, j) + " ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        int numberOfRows = 4; 
        printPascalTriangle(numberOfRows);
    }
}
