class BSTNode {
    int val;
    BSTNode left, right;
    
    BSTNode(int val) {
        this.val = val;
    }
}

public class BinarySearchTree {
    private BSTNode root;
    
    public void insert(int val) {
        root = insertRec(root, val);
    }
    
    private BSTNode insertRec(BSTNode root, int val) {
        if (root == null) {
            return new BSTNode(val);
        }
        
        if (val < root.val) {
            root.left = insertRec(root.left, val);
        } else if (val > root.val) {
            root.right = insertRec(root.right, val);
        }
        
        return root;
    }
    
    public boolean search(int val) {
        return searchRec(root, val);
    }
    
    private boolean searchRec(BSTNode root, int val) {
        if (root == null) return false;
        if (root.val == val) return true;
        
        return val < root.val ? searchRec(root.left, val) : searchRec(root.right, val);
    }
    
    public void delete(int val) {
        root = deleteRec(root, val);
    }
    
    private BSTNode deleteRec(BSTNode root, int val) {
        if (root == null) return root;
        
        if (val < root.val) {
            root.left = deleteRec(root.left, val);
        } else if (val > root.val) {
            root.right = deleteRec(root.right, val);
        } else {
            // Node to be deleted found
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            
            // Node with two children
            root.val = minValue(root.right);
            root.right = deleteRec(root.right, root.val);
        }
        
        return root;
    }
    
    private int minValue(BSTNode root) {
        int minVal = root.val;
        while (root.left != null) {
            minVal = root.left.val;
            root = root.left;
        }
        return minVal;
    }
    
    public void inorder() {
        inorderRec(root);
        System.out.println();
    }
    
    private void inorderRec(BSTNode root) {
        if (root != null) {
            inorderRec(root.left);
            System.out.print(root.val + " ");
            inorderRec(root.right);
        }
    }
    
    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();
        
        bst.insert(50);
        bst.insert(30);
        bst.insert(20);
        bst.insert(40);
        bst.insert(70);
        bst.insert(60);
        bst.insert(80);
        
        System.out.print("Inorder traversal: ");
        bst.inorder();
        
        System.out.println("Search 40: " + bst.search(40));
        System.out.println("Search 25: " + bst.search(25));
        
        bst.delete(20);
        System.out.print("After deleting 20: ");
        bst.inorder();
    }
}