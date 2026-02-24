def power_recursive(base, exp):
    """Fast exponentiation using recursion"""
    if exp == 0:
        return 1
    if exp == 1:
        return base
    
    if exp % 2 == 0:
        half = power_recursive(base, exp // 2)
        return half * half
    else:
        return base * power_recursive(base, exp - 1)

def power_mod(base, exp, mod):
    """Fast exponentiation with modulo"""
    if exp == 0:
        return 1
    
    result = 1
    base = base % mod
    
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp = exp >> 1
        base = (base * base) % mod
    
    return result

def power_iterative(base, exp):
    """Iterative fast exponentiation"""
    result = 1
    
    while exp > 0:
        if exp % 2 == 1:
            result *= base
        base *= base
        exp //= 2
    
    return result

if __name__ == "__main__":
    base = 2
    exp = 10
    mod = 1000000007
    
    print(f"{base}^{exp} = {power_recursive(base, exp)}")
    print(f"{base}^{exp} mod {mod} = {power_mod(base, exp, mod)}")
    print(f"{base}^{exp} (iterative) = {power_iterative(base, exp)}")