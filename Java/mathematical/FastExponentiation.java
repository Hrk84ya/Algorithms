public class FastExponentiation {
    // Fast exponentiation using recursion
    public static long power(long base, long exp) {
        if (exp == 0) return 1;
        if (exp == 1) return base;
        
        if (exp % 2 == 0) {
            long half = power(base, exp / 2);
            return half * half;
        } else {
            return base * power(base, exp - 1);
        }
    }
    
    // Fast exponentiation with modulo
    public static long powerMod(long base, long exp, long mod) {
        if (exp == 0) return 1;
        
        long result = 1;
        base = base % mod;
        
        while (exp > 0) {
            if (exp % 2 == 1) {
                result = (result * base) % mod;
            }
            exp = exp >> 1;
            base = (base * base) % mod;
        }
        
        return result;
    }
    
    // Iterative approach
    public static long powerIterative(long base, long exp) {
        long result = 1;
        
        while (exp > 0) {
            if (exp % 2 == 1) {
                result *= base;
            }
            base *= base;
            exp /= 2;
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        long base = 2;
        long exp = 10;
        long mod = 1000000007;
        
        System.out.println(base + "^" + exp + " = " + power(base, exp));
        System.out.println(base + "^" + exp + " mod " + mod + " = " + powerMod(base, exp, mod));
        System.out.println(base + "^" + exp + " (iterative) = " + powerIterative(base, exp));
    }
}