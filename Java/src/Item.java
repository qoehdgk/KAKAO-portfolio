import java.awt.Image;

public class Item extends AllObject{
	int get;
	Item(Playing_Window window,Image image, int x, int y){
		super(window,image,x,y);
		get = 0;
	}
}
