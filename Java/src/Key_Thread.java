import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

public class Key_Thread implements Runnable {
	Playing_Window win;
	public Key_Thread(Playing_Window win){
		this.win = win;
	}
	@Override
	public void run() {
		while(true){
			if(win.P_Mode == 1) {
		
				win.keyprocess();
				win.process_Player();
				try {
					Thread.sleep(40);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
	
	
	

}
