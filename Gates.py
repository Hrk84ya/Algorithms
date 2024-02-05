# A Python program to explore basic logic gates
# By: Harsh Kumar

# Function for the NOT gate
# The NOT gate reverses the input: 0 becomes 1, and 1 becomes 0
def not_gate(val1):
    if val1 == 0:
        return 1
    else:
        return 0

# Function for the AND gate
# The AND gate produces 1 only when both inputs are 1
def and_gate(val1, val2):
    if val1 == 1 and val2 == 1:
        return 1
    else:
        return 0

# Function for the OR gate
# The OR gate produces 1 if at least one input is 1
def or_gate(val1, val2):
    if val1 == 1 or val2 == 1:
        return 1
    else:
        return 0

# Function for the XOR gate
# The XOR gate produces 1 when the inputs are different
def xor_gate(val1, val2):
    if val1 != val2:
        return 1
    else:
        return 0

# Function for the NAND gate
# The NAND gate is the opposite of the AND gate
def nand_gate(val1, val2):
    if val1 == 1 and val2 == 1:
        return 0
    else:
        return 1

# Function for the NOR gate
# The NOR gate is the opposite of the OR gate
def nor_gate(val1, val2):
    if val1 == 0 and val2 == 0:
        return 1
    else:
        return 0

# Function for the XNOR gate
# The XNOR gate is the opposite of the XOR gate
def xnor_gate(val1, val2):
    if val1 == val2:
        return 1
    else:
        return 0

# Taking inputs from the user
print("Enter values as 0 or 1.")
val1 = int(input("Enter the first value: "))
val2 = int(input("Enter the second value: "))

# Displaying the results 
print("<------------------------------->")
print("NOT: ", not_gate(val1))
print("AND: ", and_gate(val1, val2))
print("OR: ", or_gate(val1, val2))
print("XOR: ", xor_gate(val1, val2))
print("NAND: ", nand_gate(val1, val2))
print("NOR: ", nor_gate(val1, val2))
print("XNOR: ", xnor_gate(val1, val2))
print()

# Ending the program
print("End of the program")
print("Thank you for using the program!")
print("<------------------------------>")
