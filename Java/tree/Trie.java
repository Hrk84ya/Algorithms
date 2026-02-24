class TrieNode {
    TrieNode[] children;
    boolean isEndOfWord;
    
    TrieNode() {
        children = new TrieNode[26];
        isEndOfWord = false;
    }
}

public class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode current = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }
        current.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNode current = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                return false;
            }
            current = current.children[index];
        }
        return current.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode current = root;
        for (char c : prefix.toCharArray()) {
            int index = c - 'a';
            if (current.children[index] == null) {
                return false;
            }
            current = current.children[index];
        }
        return true;
    }
    
    public static void main(String[] args) {
        Trie trie = new Trie();
        
        trie.insert("apple");
        trie.insert("app");
        trie.insert("application");
        
        System.out.println("Search 'app': " + trie.search("app"));
        System.out.println("Search 'apple': " + trie.search("apple"));
        System.out.println("Search 'appl': " + trie.search("appl"));
        System.out.println("Starts with 'app': " + trie.startsWith("app"));
        System.out.println("Starts with 'bat': " + trie.startsWith("bat"));
    }
}