import java.awt.Color;

import javax.swing.JLabel;

public class Heart_Thread extends Thread{
	JLabel[] jl;
	Playing_Window fd;
	JLabel scoreL, g1_b, g2_b;
	public Heart_Thread(JLabel[] jl,Playing_Window fd,JLabel scoreL,JLabel g1_b, JLabel g2_b){
		this.jl = jl;
		this.fd = fd;
		this.scoreL = scoreL;
		this.g1_b = g1_b;
		this.g2_b = g2_b;
	}
	@Override
	public void run() {
		while(true) {
			if(fd.P_Mode==1) {
				jl[fd.life-1].setVisible(false);
				scoreL.setText("Score : " +Integer.toString(fd.score));
				
				 if(fd.ChongR_Mode == 1)
			    	  g2_b.setBackground(Color.GRAY);
			      else if(fd.ChongR_Mode == 0)
			    	  g2_b.setBackground(Color.RED);
				 
				 if(fd.ChongR_Mode == 1)
			    	  g1_b.setBackground(Color.RED);
			      else if(fd.ChongR_Mode == 0)
			    	  g1_b.setBackground(Color.GRAY);
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

