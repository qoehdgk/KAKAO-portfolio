import java.awt.Image;

public class B_Zombie extends Zombie {
	B_Zombie(Playing_Window window, Image image, int x, int y){
		super(window, image,x,y);
		speed = 3;		
		HP = 2;
	}
}

