import java.awt.Image;

public class Zombie extends AllObject {
	Playing_Window window;
	int status;
	
	Zombie(Playing_Window window, Image image, int x, int y){
		super(window, image,x,y);
		speed = 1;
		status = 0;  // 멀리있다
	}
	
	void move() {
	}
	
}
