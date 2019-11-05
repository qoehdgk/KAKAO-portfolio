import java.awt.Image;

public class Z_ChongR extends ChongR{
	
	Z_ChongR(Playing_Window window, Image image, int x, int y, int direction){
		super(window, image,x,y,direction);	
		speed = 3;
	}

	@Override
	public void move() {
		switch(direction) {
		case 0:
			y += speed;
			break;
		case 1:
			y += (int)(Math.sqrt((int)((speed*speed)/2)));
			x -= (int)(Math.sqrt((int)((speed*speed)/2)));
			break;
		case 2:
			x -= speed;
			break;
		case 3:
			y -= (int)(Math.sqrt((int)((speed*speed)/2)));
			x -= (int)(Math.sqrt((int)((speed*speed)/2)));
			break;
		case 4:
			y -= speed;
			break;
		case 5:
			y -= (int)(Math.sqrt((int)((speed*speed)/2)));
			x += (int)(Math.sqrt((int)((speed*speed)/2)));
			break;
		case 6:
			x += speed;
			break;
		case 7:
			y += (int)(Math.sqrt((int)((speed*speed)/2)));
			x += (int)(Math.sqrt((int)((speed*speed)/2)));
			break;
		default: 
			break;
			
		}
	}
	
}
