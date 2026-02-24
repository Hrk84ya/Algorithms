#Checking if whether the given three numbers can form a triangle

#Rule: Sum of two sides should be greater than the third side

def main():
    a=float(input("Enter the length of the first side: "))
    b=float(input("Enter the length of the second side: "))
    c=float(input("Enter the length of the third side: "))

    if a+b>c and b+c>a and a+c>b:
        print("The given sides can form a triangle")
    else:
        print("The given sides cannot form a triangle")

if __name__=="__main__":
    main()
