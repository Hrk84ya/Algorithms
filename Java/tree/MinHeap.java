import java.util.*;

public class MinHeap {
    private List<Integer> heap;
    
    public MinHeap() {
        heap = new ArrayList<>();
    }
    
    private int parent(int i) { return (i - 1) / 2; }
    private int leftChild(int i) { return 2 * i + 1; }
    private int rightChild(int i) { return 2 * i + 2; }
    
    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
    
    public void insert(int value) {
        heap.add(value);
        heapifyUp(heap.size() - 1);
    }
    
    private void heapifyUp(int i) {
        while (i > 0 && heap.get(parent(i)) > heap.get(i)) {
            swap(i, parent(i));
            i = parent(i);
        }
    }
    
    public int extractMin() {
        if (heap.isEmpty()) {
            throw new RuntimeException("Heap is empty");
        }
        
        int min = heap.get(0);
        int lastElement = heap.remove(heap.size() - 1);
        
        if (!heap.isEmpty()) {
            heap.set(0, lastElement);
            heapifyDown(0);
        }
        
        return min;
    }
    
    private void heapifyDown(int i) {
        int minIndex = i;
        int left = leftChild(i);
        int right = rightChild(i);
        
        if (left < heap.size() && heap.get(left) < heap.get(minIndex)) {
            minIndex = left;
        }
        
        if (right < heap.size() && heap.get(right) < heap.get(minIndex)) {
            minIndex = right;
        }
        
        if (i != minIndex) {
            swap(i, minIndex);
            heapifyDown(minIndex);
        }
    }
    
    public int peek() {
        if (heap.isEmpty()) {
            throw new RuntimeException("Heap is empty");
        }
        return heap.get(0);
    }
    
    public int size() {
        return heap.size();
    }
    
    public boolean isEmpty() {
        return heap.isEmpty();
    }
    
    public static void main(String[] args) {
        MinHeap minHeap = new MinHeap();
        
        minHeap.insert(3);
        minHeap.insert(1);
        minHeap.insert(6);
        minHeap.insert(5);
        minHeap.insert(2);
        minHeap.insert(4);
        
        System.out.println("Min heap elements (extracted in order):");
        while (!minHeap.isEmpty()) {
            System.out.print(minHeap.extractMin() + " ");
        }
    }
}