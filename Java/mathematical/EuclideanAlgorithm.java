//Java code to find G.C.D of two numbers using Euclidean algorithm
import java.util.Scanner;
class EuclideanAlgorithm{
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        System.out.print("Enter the first number: ");
        int m=sc.nextInt();
        System.out.print("Enter the second number: ");
        int n=sc.nextInt();

        int gcd=findGcd(m,n);
        System.out.println("GCD of "+m+" and "+n+" is "+gcd);
        sc.close();
    }
    public static int findGcd(int m, int n){
        if(n==0){
            return m;
        }
        else{
            int r=m%n;
            m=n;
            n=r;
            return findGcd(m,n);
        }
    }
}