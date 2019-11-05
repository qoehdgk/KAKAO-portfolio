import java.awt.Image;

public class R_Zombie extends Zombie{
	R_Zombie(Playing_Window window, Image image, int x, int y){
		super(window, image,x,y);
		speed = 1;		
		HP = 6;
	}
}
