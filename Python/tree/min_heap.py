class MinHeap:
    def __init__(self):
        self.heap = []
    
    def _parent(self, i):
        return (i - 1) // 2
    
    def _left_child(self, i):
        return 2 * i + 1
    
    def _right_child(self, i):
        return 2 * i + 2
    
    def _swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]
    
    def insert(self, value):
        self.heap.append(value)
        self._heapify_up(len(self.heap) - 1)
    
    def _heapify_up(self, i):
        while i > 0 and self.heap[self._parent(i)] > self.heap[i]:
            self._swap(i, self._parent(i))
            i = self._parent(i)
    
    def extract_min(self):
        if not self.heap:
            raise ValueError("Heap is empty")
        
        min_val = self.heap[0]
        last_element = self.heap.pop()
        
        if self.heap:
            self.heap[0] = last_element
            self._heapify_down(0)
        
        return min_val
    
    def _heapify_down(self, i):
        min_index = i
        left = self._left_child(i)
        right = self._right_child(i)
        
        if left < len(self.heap) and self.heap[left] < self.heap[min_index]:
            min_index = left
        
        if right < len(self.heap) and self.heap[right] < self.heap[min_index]:
            min_index = right
        
        if i != min_index:
            self._swap(i, min_index)
            self._heapify_down(min_index)
    
    def peek(self):
        if not self.heap:
            raise ValueError("Heap is empty")
        return self.heap[0]
    
    def size(self):
        return len(self.heap)
    
    def is_empty(self):
        return len(self.heap) == 0

if __name__ == "__main__":
    min_heap = MinHeap()
    
    for val in [3, 1, 6, 5, 2, 4]:
        min_heap.insert(val)
    
    print("Min heap elements (extracted in order):")
    while not min_heap.is_empty():
        print(min_heap.extract_min(), end=" ")
    print()