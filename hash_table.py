class HashNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None

class HashTable:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.buckets = [None] * capacity
        self.size = 0
    
    def _hash(self, key):
        return hash(key) % self.capacity
    
    def put(self, key, value):
        index = self._hash(key)
        head = self.buckets[index]
        
        # Check if key already exists
        current = head
        while current:
            if current.key == key:
                current.value = value
                return
            current = current.next
        
        # Add new node at the beginning
        new_node = HashNode(key, value)
        new_node.next = head
        self.buckets[index] = new_node
        self.size += 1
    
    def get(self, key):
        index = self._hash(key)
        head = self.buckets[index]
        
        while head:
            if head.key == key:
                return head.value
            head = head.next
        
        return None
    
    def remove(self, key):
        index = self._hash(key)
        head = self.buckets[index]
        prev = None
        
        while head:
            if head.key == key:
                if prev:
                    prev.next = head.next
                else:
                    self.buckets[index] = head.next
                self.size -= 1
                return True
            prev = head
            head = head.next
        
        return False
    
    def __len__(self):
        return self.size
    
    def is_empty(self):
        return self.size == 0

if __name__ == "__main__":
    hash_table = HashTable()
    
    hash_table.put("apple", 5)
    hash_table.put("banana", 3)
    hash_table.put("orange", 8)
    
    print(f"apple: {hash_table.get('apple')}")
    print(f"banana: {hash_table.get('banana')}")
    print(f"grape: {hash_table.get('grape')}")
    
    hash_table.remove("banana")
    print(f"After removing banana: {hash_table.get('banana')}")
    print(f"Size: {len(hash_table)}")