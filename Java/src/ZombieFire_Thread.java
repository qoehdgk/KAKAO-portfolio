
public class ZombieFire_Thread extends Thread{

	Playing_Window win;
	
	ZombieFire_Thread(Playing_Window win){
		this.win = win;
		
		
	}
	public void run() {
		while(true) {
			if(win.P_Mode == 1) {
				win.Zombie_Fire();
				
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
		}
	}
}
