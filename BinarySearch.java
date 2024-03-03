//java code for binary search
public class BinarySearch {
    public static void search(int[] array, int left, int right, int key){
        if(left>right){
            System.out.println(key+" is not present in the array");
        }
        int mid=left+(right-left)/2;
        if(array[mid]==key){
            System.out.println(key+" is present at index "+mid);
        }
        else if(array[mid]>key){
            search(array, left, mid-1, key);
        }else{
            search(array, mid+1, right, key);
        }
    } 

//Driver Code
    public static void main(String[] args){
        int[] array={1,2,3,4,5,6,7,8,9,10};
        int key=5;
        search(array, 0, array.length-1, key);
    }
}
