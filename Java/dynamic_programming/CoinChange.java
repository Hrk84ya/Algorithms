public class CoinChange {
    // Minimum coins needed to make amount
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        java.util.Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
    
    // Number of ways to make amount
    public static int coinChangeWays(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }
        
        return dp[amount];
    }
    
    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        int amount = 11;
        
        System.out.println("Minimum coins: " + coinChange(coins, amount));
        System.out.println("Number of ways: " + coinChangeWays(coins, amount));
    }
}