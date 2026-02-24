import java.util.Scanner;

class BinaryToDecimal{
    public static long binaryToDecimal(long binNum){
        long binCopy, d, s=0, power=0;
        binCopy=binNum;
        while(binCopy!=0){
            d=binCopy%10;
            s+=d*(long)Math.pow(2, power++);
            binCopy/=10;
        }
        return s;
    }

    //Main function
    public static void main(String[] args){
        Scanner sc=new Scanner(System.in);
        System.out.print("Enter the binary number: ");
        System.out.println("Decimal Equivalent: "+binaryToDecimal(sc.nextLong()));
        sc.close();
    }
}