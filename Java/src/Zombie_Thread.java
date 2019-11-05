class Zombie_Thread extends Thread {

	Playing_Window win;
	
	Zombie_Thread(Playing_Window win){
		this.win = win;
		
		
	}
	public void run() {
		while(true) {
			if(win.P_Mode == 1) {
				win.process_ENEMY();
				
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
