
public class Bullet_Thread extends Thread{
	Playing_Window win;
	
	
	Bullet_Thread(Playing_Window win){
		this.win = win;
	}

	@Override
	public void run() {
		while(true) {
			if(win.P_Mode == 1) {
				
					win.process_BULLET();
				
				
 				try {
					Thread.sleep(150);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
}
