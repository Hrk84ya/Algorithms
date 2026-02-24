#finding kinetic energy of an object

# Input: mass and velocity
# Output: kinetic energy

def main():
    print("Enter the required details: ")
    mass = float(input("Enter the mass of the object: "))
    velocity = float(input("Enter the velocity of the object: "))

    kinetic=0.5*mass*(velocity**2)
    print(f"The kinetic energy of the object is {kinetic} J")

if __name__ == "__main__":
    main()