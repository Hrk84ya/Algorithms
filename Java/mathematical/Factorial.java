//Java code for finding factorial of a number using recursion
import java. util.Scanner;
public class Factorial {
    public static int findFact(int n){
        if(n==0){
            return 1;
        }
        return n*findFact(n-1);
    }
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n=sc.nextInt();
        int fact=findFact(n);
        System.out.println("Factorial of "+n+" is "+fact);
        sc.close();
    }
}
