import java.util.Random;

import javax.swing.JLabel;

public class Timer_Thread extends Thread{
	JLabel la;
	Playing_Window win;
	public Timer_Thread(JLabel la, Playing_Window win){
		this.la = la;
		this.win = win;
	}
	
	@Override
	public void run() {
		int n = 2;
		while(true){
			if(win.P_Mode == 1) {
				la.setText(Integer.toString(n));
				System.out.println("타이머ㅓ도는중");
				try{
					sleep(1000);
				}
				catch(InterruptedException e){return;}
				n--;
				if(n <0)
				{
					process_ENEMY_create();
					n = 2;
				}
				
			}
		}
			
		}
	
	
	public void process_ENEMY_create() {
		Zombie z = null;
		int Kind_Zombie = (int)(Math.random() * 3);
		
		switch(Kind_Zombie){
		case 0:
			z = new B_Zombie(win,win.BZ_Image[0],(int)(Math.random() * win.getWidth()),(int)((Math.random() * 2))*800);
			break;
		case 1:
			z = new G_Zombie(win,win.BZ_Image[0],(int)(Math.random() * win.getWidth()),(int)((Math.random() * 2))*800);
			break;
		
		case 2:
			z = new R_Zombie(win,win.BZ_Image[0],(int)(Math.random() * win.getWidth()),(int)((Math.random() * 2))*800);
			break;

		
		}
		win.ZomArray.add(z);
		
	}
}	

