//java code for linear search
public class LinearSearch {
    public static void main(String[] args){
        int[] arr={1,2,3,4,5,6,7,8,9,10};
        int x=5;
        int result=search(arr,x);
        if(result==-1){
            System.out.println("Element not found");
        }
        else{
            System.out.println("Element found at index "+result);
        }
    }
    //Function to search element in array using linear search algorithm
    public static int search(int[] arr, int x){
        for(int i=0;i<arr.length;i++){
            if(arr[i]==x){
                return i;
            }
        }
        return -1;
    }
}
