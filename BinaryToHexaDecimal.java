import java.util.*;

public class BinaryToHexaDecimal {
    static String binToHex(int binary) {
        HashMap<Integer, String> map = new HashMap<>();
        String hex = "";
        int i;
        for (i = 0; i < 10; i++) {
            map.put(i, String.valueOf(i));
        }
        for (i = 10; i < 16; i++) {
            map.put(i, String.valueOf((char) ('A' + i - 10)));
        }
        int currentbit;
        while (binary != 0) {
            int code4 = 0; 
            for (i = 0; i < 4; i++) {
                currentbit = binary % 10;
                binary = binary / 10;
                code4 += currentbit * (int) Math.pow(2, i);
            }
            hex = map.get(code4) + hex;
        }
        return hex;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter binary number: ");
        int binary = sc.nextInt();
        String hex = binToHex(binary);
        System.out.println("Hexadecimal Code: " + hex);
        sc.close();
    }
}