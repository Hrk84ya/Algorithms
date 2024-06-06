#calculating the delta of the quadratic equation
#delta=b^2-4ac

def main():
    print("Follow the below given steps...")
    print()
    a=float(input("Enter the coefficient a: "))
    b=float(input("Enter the coefficient b: "))
    c=float(input("Enter the coefficient c: "))

    delta=(b**2)-4*a*c
    print(f"The delta of the quadratic equation is {delta}")


if __name__ == "__main__":
    main()
    print("Thank You!")

