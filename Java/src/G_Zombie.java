import java.awt.Image;

public class G_Zombie extends Zombie{
	G_Zombie(Playing_Window window, Image image, int x, int y){
		super(window, image,x,y);
		speed = 2;
		HP = 4;
	}
}
