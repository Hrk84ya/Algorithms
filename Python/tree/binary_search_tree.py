class BSTNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        self.root = self._insert_rec(self.root, val)
    
    def _insert_rec(self, root, val):
        if not root:
            return BSTNode(val)
        
        if val < root.val:
            root.left = self._insert_rec(root.left, val)
        elif val > root.val:
            root.right = self._insert_rec(root.right, val)
        
        return root
    
    def search(self, val):
        return self._search_rec(self.root, val)
    
    def _search_rec(self, root, val):
        if not root or root.val == val:
            return root is not None
        
        return self._search_rec(root.left, val) if val < root.val else self._search_rec(root.right, val)
    
    def delete(self, val):
        self.root = self._delete_rec(self.root, val)
    
    def _delete_rec(self, root, val):
        if not root:
            return root
        
        if val < root.val:
            root.left = self._delete_rec(root.left, val)
        elif val > root.val:
            root.right = self._delete_rec(root.right, val)
        else:
            # Node to be deleted found
            if not root.left:
                return root.right
            if not root.right:
                return root.left
            
            # Node with two children
            root.val = self._min_value(root.right)
            root.right = self._delete_rec(root.right, root.val)
        
        return root
    
    def _min_value(self, root):
        while root.left:
            root = root.left
        return root.val
    
    def inorder(self):
        result = []
        self._inorder_rec(self.root, result)
        return result
    
    def _inorder_rec(self, root, result):
        if root:
            self._inorder_rec(root.left, result)
            result.append(root.val)
            self._inorder_rec(root.right, result)

if __name__ == "__main__":
    bst = BinarySearchTree()
    
    for val in [50, 30, 20, 40, 70, 60, 80]:
        bst.insert(val)
    
    print(f"Inorder traversal: {bst.inorder()}")
    
    print(f"Search 40: {bst.search(40)}")
    print(f"Search 25: {bst.search(25)}")
    
    bst.delete(20)
    print(f"After deleting 20: {bst.inorder()}")