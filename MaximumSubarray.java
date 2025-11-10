public class MaximumSubarray {
    // Kadane's Algorithm
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int maxEndingHere = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
    }
    
    // Returns the actual subarray
    public static int[] maxSubArrayWithIndices(int[] nums) {
        int maxSoFar = nums[0];
        int maxEndingHere = nums[0];
        int start = 0, end = 0, tempStart = 0;
        
        for (int i = 1; i < nums.length; i++) {
            if (maxEndingHere < 0) {
                maxEndingHere = nums[i];
                tempStart = i;
            } else {
                maxEndingHere += nums[i];
            }
            
            if (maxSoFar < maxEndingHere) {
                maxSoFar = maxEndingHere;
                start = tempStart;
                end = i;
            }
        }
        
        return new int[]{maxSoFar, start, end};
    }
    
    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        
        System.out.println("Maximum sum: " + maxSubArray(nums));
        
        int[] result = maxSubArrayWithIndices(nums);
        System.out.println("Maximum sum: " + result[0] + 
                          ", from index " + result[1] + " to " + result[2]);
    }
}