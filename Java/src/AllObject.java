import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.Toolkit;

public class AllObject {
	Toolkit tk = Toolkit.getDefaultToolkit();		//해상도 만큼 사이즈를 얻고싶다.
	Dimension Ws = tk.getScreenSize();
	Playing_Window window;
	int direction;
	int x,y;
	int HP;
	
	Image image;
	int speed;
	
	AllObject(Playing_Window window,Image image, int x, int y){
		this.window =window;
		this.image = image;
		this.x = x;
		this.y = y;
	}
	int getWidth()
	{
		return image.getWidth(null);
		
	}
	int getHeight()
	{
		return image.getHeight(null);
	}
	void setX(int x) {
		this.x = x;
	}
	int getX() {
		return x;
	}
	void setY(int y) {
		this.y = y;
	}
	int getY() {
		return y;
	}
	void draw(Graphics g) {
		g.drawImage(image, x, y, window);
	}
	
}
