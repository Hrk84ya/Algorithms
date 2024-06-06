#Calculating the BMI of a person

def main():
    print("Enter the required details: ")
    weight = float(input("Enter your weight in kg: "))
    height = float(input("Enter your height in meters: "))

    bmi = weight/(height**2)
    
    if bmi<18.5:
        print(f"Your BMI is {bmi} and you are underweight")
    elif 18.5<=bmi<=24.9:
        print(f"Your BMI is {bmi} and you are normal weight")
    elif 25<=bmi<=29.9:
        print(f"Your BMI is {bmi} and you are overweight")
    else:
        print(f"Your BMI is {bmi} and you are obese")

if __name__ == "__main__":
    main()