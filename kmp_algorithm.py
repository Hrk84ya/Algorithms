def compute_lps(pattern):
    """Compute Longest Prefix Suffix array"""
    lps = [0] * len(pattern)
    length = 0
    i = 1
    
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps

def kmp_search(text, pattern):
    """KMP pattern matching algorithm"""
    lps = compute_lps(pattern)
    i = j = 0  # indices for text and pattern
    
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == len(pattern):
            print(f"Pattern found at index {i - j}")
            j = lps[j - 1]
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

if __name__ == "__main__":
    text = "ABABDABACDABABCABCABCABCABC"
    pattern = "ABABCABCABCABC"
    
    print(f"Text: {text}")
    print(f"Pattern: {pattern}")
    kmp_search(text, pattern)