#A python program to implement basic logic gates
#By: Harsh Kumar

#function for not gate
#not gate reverses the input i.e 0->1 or 1->0
def not_gate(val1):
    if val1 == 0:
        return 1
    else:
        return 0

#function for and gate
#for output to be 1(true), both the inputs should be 1
def and_gate(val1, val2):
    if val1 == 1 and val2 == 1:
        return 1
    else:
        return 0

#function for or gate
#for output to be 1(true), any of the input needs to be 1
def or_gate(val1, val2):
    if val1 == 1 or val2 == 1:
        return 1
    else:
        return 0

#function for xor gate
    #for output to be 1(true), the inputs should be different
def xor_gate(val1, val2):
    if val1 != val2:
        return 1
    else:
        return 0

#function for nand gate
#opposite of and gate
def nand_gate(val1, val2):
    if val1 == 1 and val2 == 1:
        return 0
    else:
        return 1
    

#function for nor gate
#opposite of or gate
def nor_gate(val1, val2):
    if val1 == 0 and val2 == 0:
        return 1
    else:
        return 0
    
#unction for xnor gate
#opposite of xor gate
def xnor_gate(val1, val2):
    if val1 == val2:
        return 1
    else:
        return 0

#taking inputs from the user
print("Input values should be either 0 or 1")
val1=int(input("Enter the first value: "))
val2=int(input("Enter the second value: "))
print()
#displaying the result 
print("----------------------------------------------------")
print("NOT: ", not_gate(val1))
print("AND: ", and_gate(val1, val2))
print("OR: ", or_gate(val1, val2))
print("XOR: ", xor_gate(val1, val2))
print("NAND: ", nand_gate(val1, val2))
print("NOR: ", nor_gate(val1, val2))
print("XNOR: ", xnor_gate(val1, val2))

#Ending the program
print("End of the program")
print("Thank you for using the program!")
print("----------------------------------------------------")
