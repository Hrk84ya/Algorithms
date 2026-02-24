import java.util.*;

public class FourElementsSum {

static class Pair {
int first, second;

public Pair(int first, int second) {
this.first = first;
this.second = second;
}
}

public static void findFourElements(int[] arr) {

HashMap<Integer, Pair> sumMap = new HashMap<>();


for (int i = 0; i < arr.length; i++) {
for (int j = i + 1; j < arr.length; j++) {
int sum = arr[i] + arr[j];


if (sumMap.containsKey(sum)) {

Pair pair = sumMap.get(sum);


if (pair.first != i && pair.first != j && pair.second != i && pair.second != j) {

System.out.println("Elements found: " +
arr[pair.first] + " + " + arr[pair.second] + " = " +
arr[i] + " + " + arr[j]);
return;
}
} else {

sumMap.put(sum, new Pair(i, j));
}
}
}

System.out.println("No such elements found.");
}

public static void main(String[] args) {
int[] arr = {3, 4, 7, 1, 2, 9, 8};
findFourElements(arr);
}
}