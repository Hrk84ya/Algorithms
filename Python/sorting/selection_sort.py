def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap minimum element with first element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    selection_sort(arr)
    print(arr)