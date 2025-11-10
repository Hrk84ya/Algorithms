from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    """Inorder traversal (Left, Root, Right)"""
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)

def preorder(root):
    """Preorder traversal (Root, Left, Right)"""
    if root:
        print(root.val, end=" ")
        preorder(root.left)
        preorder(root.right)

def postorder(root):
    """Postorder traversal (Left, Right, Root)"""
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val, end=" ")

def level_order(root):
    """Level order traversal"""
    if not root:
        return
    
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        print(node.val, end=" ")
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

if __name__ == "__main__":
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    
    print("Inorder: ", end="")
    inorder(root)
    print()
    
    print("Preorder: ", end="")
    preorder(root)
    print()
    
    print("Postorder: ", end="")
    postorder(root)
    print()
    
    print("Level order: ", end="")
    level_order(root)
    print()