#finding whether a person has attained the legal age or not

def main():
    age=int(input("Enter your age: "))

    if age>=18:
        print("You have attained the legal age")
    else:
        print("You have not attained the legal age")

if __name__=="__main__":
    main()