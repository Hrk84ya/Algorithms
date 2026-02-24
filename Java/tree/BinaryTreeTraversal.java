import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    
    TreeNode(int val) {
        this.val = val;
    }
}

public class BinaryTreeTraversal {
    // Inorder traversal (Left, Root, Right)
    public static void inorder(TreeNode root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.val + " ");
            inorder(root.right);
        }
    }
    
    // Preorder traversal (Root, Left, Right)
    public static void preorder(TreeNode root) {
        if (root != null) {
            System.out.print(root.val + " ");
            preorder(root.left);
            preorder(root.right);
        }
    }
    
    // Postorder traversal (Left, Right, Root)
    public static void postorder(TreeNode root) {
        if (root != null) {
            postorder(root.left);
            postorder(root.right);
            System.out.print(root.val + " ");
        }
    }
    
    // Level order traversal
    public static void levelOrder(TreeNode root) {
        if (root == null) return;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            System.out.print(node.val + " ");
            
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
    }
    
    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        
        System.out.print("Inorder: ");
        inorder(root);
        System.out.println();
        
        System.out.print("Preorder: ");
        preorder(root);
        System.out.println();
        
        System.out.print("Postorder: ");
        postorder(root);
        System.out.println();
        
        System.out.print("Level order: ");
        levelOrder(root);
        System.out.println();
    }
}