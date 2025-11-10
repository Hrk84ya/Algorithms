def max_subarray(nums):
    """Kadane's Algorithm for maximum subarray sum"""
    max_so_far = max_ending_here = nums[0]
    
    for i in range(1, len(nums)):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far

def max_subarray_with_indices(nums):
    """Returns maximum sum and the subarray indices"""
    max_so_far = max_ending_here = nums[0]
    start = end = temp_start = 0
    
    for i in range(1, len(nums)):
        if max_ending_here < 0:
            max_ending_here = nums[i]
            temp_start = i
        else:
            max_ending_here += nums[i]
        
        if max_so_far < max_ending_here:
            max_so_far = max_ending_here
            start = temp_start
            end = i
    
    return max_so_far, start, end

if __name__ == "__main__":
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    
    print(f"Maximum sum: {max_subarray(nums)}")
    
    max_sum, start, end = max_subarray_with_indices(nums)
    print(f"Maximum sum: {max_sum}, from index {start} to {end}")
    print(f"Subarray: {nums[start:end+1]}")