import java.util.*;

class HashNode {
    String key;
    int value;
    HashNode next;
    
    HashNode(String key, int value) {
        this.key = key;
        this.value = value;
    }
}

public class HashTable {
    private HashNode[] buckets;
    private int capacity;
    private int size;
    
    public HashTable(int capacity) {
        this.capacity = capacity;
        this.buckets = new HashNode[capacity];
        this.size = 0;
    }
    
    private int hash(String key) {
        return Math.abs(key.hashCode()) % capacity;
    }
    
    public void put(String key, int value) {
        int index = hash(key);
        HashNode head = buckets[index];
        
        // Check if key already exists
        while (head != null) {
            if (head.key.equals(key)) {
                head.value = value;
                return;
            }
            head = head.next;
        }
        
        // Add new node at the beginning
        HashNode newNode = new HashNode(key, value);
        newNode.next = buckets[index];
        buckets[index] = newNode;
        size++;
    }
    
    public Integer get(String key) {
        int index = hash(key);
        HashNode head = buckets[index];
        
        while (head != null) {
            if (head.key.equals(key)) {
                return head.value;
            }
            head = head.next;
        }
        
        return null;
    }
    
    public boolean remove(String key) {
        int index = hash(key);
        HashNode head = buckets[index];
        HashNode prev = null;
        
        while (head != null) {
            if (head.key.equals(key)) {
                if (prev != null) {
                    prev.next = head.next;
                } else {
                    buckets[index] = head.next;
                }
                size--;
                return true;
            }
            prev = head;
            head = head.next;
        }
        
        return false;
    }
    
    public int size() {
        return size;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public static void main(String[] args) {
        HashTable hashTable = new HashTable(10);
        
        hashTable.put("apple", 5);
        hashTable.put("banana", 3);
        hashTable.put("orange", 8);
        
        System.out.println("apple: " + hashTable.get("apple"));
        System.out.println("banana: " + hashTable.get("banana"));
        System.out.println("grape: " + hashTable.get("grape"));
        
        hashTable.remove("banana");
        System.out.println("After removing banana: " + hashTable.get("banana"));
        System.out.println("Size: " + hashTable.size());
    }
}