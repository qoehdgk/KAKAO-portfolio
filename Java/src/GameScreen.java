import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class GameScreen extends JFrame{
	Toolkit tk = Toolkit.getDefaultToolkit();		

	Dimension Ws = tk.getScreenSize();
	Timer_Thread Th_t;
	Playing_Window Field = null;
	JLabel heart[] = null;
	JLabel score;
	Thread heart_T;
	
	JLabel g1_b;
	JLabel g2_b;
	GameScreen(){
		
		setTitle("BOX HEAD");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		Container c = getContentPane();
		c.setLayout(new BorderLayout());
		
		Field = new Playing_Window(this);
		heart = new JLabel[10];
		
		JPanel up_line = new JPanel();
		up_line.setBackground(Color.WHITE);
		//up_line.setBackground(Color.WHITE);
		up_line.setPreferredSize(new Dimension(Ws.width,70));
		JPanel ud_line = new JPanel();
		ud_line.setBackground(Color.WHITE);
		ud_line.setPreferredSize(new Dimension(Ws.width,100));
		

		
		
		
		c.add(up_line,BorderLayout.NORTH);
		up_line.setLayout(null);
		
		score = new JLabel("score : 100");
		score.setLocation(0,0);
		score.setSize(500,70);
		score.setFont(new Font("Comic Sans MS", Font.PLAIN, 70));
		score.setOpaque(true);
		score.setBackground(Color.WHITE);
		
		JLabel stage = new JLabel("stage 1");
		stage.setLocation(Ws.width-500,0);
		stage.setSize(300,70);
		stage.setFont(new Font("Comic Sans MS", Font.PLAIN, 70));
		stage.setOpaque(true);
		stage.setBackground(Color.YELLOW);
		stage.setVisible(false);
		
		JLabel timer = new JLabel("Timer : ");
		timer.setLocation(Ws.width-200,0);
		timer.setSize(100,70);
		timer.setFont(new Font("Comic Sans MS", Font.PLAIN, 70));
		timer.setOpaque(true);
		timer.setBackground(Color.RED);
		timer.setVisible(false);
		
		up_line.add(score);
		up_line.add(stage);
		up_line.add(timer);
		
		Th_t = new Timer_Thread(timer,Field);
		Th_t.start();

		
		
		//
		c.add(Field,BorderLayout.CENTER);
		
		//
		c.add(ud_line,BorderLayout.SOUTH);
	      
	      ud_line.setOpaque(true);
	      //ud_line.setBackground(Color.WHITE);
	      
	      ud_line.setLayout(null);
	      
	      ImageIcon g_img[] = {new ImageIcon("revolver_image.png"),
	                     new ImageIcon("Item0.jpg"),
	                     new ImageIcon("dynamite_image.png"),
	                     new ImageIcon("shotgun_image.png")};
	      
	      g1_b = new JLabel();
	      g1_b.setLocation(0,0);
	      g1_b.setSize(100,100);
	      g1_b.setOpaque(true);
	      if(Field.ChongR_Mode == 1)
	    	  g1_b.setBackground(Color.RED);
	      else if(Field.ChongR_Mode == 0)
	    	  g1_b.setBackground(Color.GRAY);
	      
	      JLabel g1 = new JLabel();
	      g1.setLocation(15,15);
	      g1.setSize(70,70);
	      g1.setOpaque(true);
	      if(Field.ChongR_Mode == 1)
	    	  g1.setBackground(Color.RED);
	      else if(Field.ChongR_Mode == 0)
	    	  g1.setBackground(Color.GRAY);
	      g1.setIcon(g_img[0]);
	      
	      g2_b = new JLabel();
	      g2_b.setLocation(110,0);
	      g2_b.setSize(100,100);
	      g2_b.setOpaque(true);
	      if(Field.ChongR_Mode == 1)
	    	  g2_b.setBackground(Color.GRAY);
	      else if(Field.ChongR_Mode == 0)
	    	  g2_b.setBackground(Color.RED);
	      
	      JLabel g2 = new JLabel();
	      g2.setLocation(125,15);
	      g2.setSize(70,70);
	      g2.setOpaque(true);
	      
	      g2.setBackground(Color.GREEN);
	      g2.setIcon(g_img[1]);
	      
	      JLabel g3_b = new JLabel();
	      g3_b.setLocation(220,0);
	      g3_b.setSize(100,100);
	      g3_b.setOpaque(true);
	      g3_b.setBackground(Color.GRAY);
	      
	      JLabel g3 = new JLabel();
	      g3.setLocation(235,15);
	      g3.setSize(70,70);
	      g3.setOpaque(true);
	      g3.setBackground(Color.GREEN);
	      g3.setIcon(g_img[2]);
	      
	      JLabel g4_b = new JLabel();
	      g4_b.setLocation(330,0);
	      g4_b.setSize(100,100);
	      g4_b.setOpaque(true);
	      g4_b.setBackground(Color.GRAY);
	      
	      JLabel g4 = new JLabel();
	      g4.setLocation(345,15);
	      g4.setSize(70,70);
	      g4.setOpaque(true);
	      g4.setBackground(Color.GREEN);
	      g4.setIcon(g_img[3]);
	      
	      JLabel item = new JLabel("Machine Gun");
	      item.setFont(new Font("Comic Sans MS", Font.PLAIN, 70));
	      item.setLocation(450,0);
	      item.setSize(450,100);
	      item.setOpaque(true);
	      item.setBackground(Color.WHITE);
	      
	      for(int i=0; i<10; i++)
	      {
	         heart[i] = new JLabel();
	         heart[i].setLocation(Ws.width-800+80*i,10);
	         heart[i].setSize(70,70);
	         ud_line.add(heart[i]);
	         heart[i].setIcon(new ImageIcon("heart_image.png"));
	         heart[i].setVisible(true);
	      }
	      
	      ud_line.add(g1);
	      ud_line.add(g1_b);
	      ud_line.add(g2);
	      ud_line.add(g2_b);
	      ud_line.add(g3);
	      ud_line.add(g3_b);
	      ud_line.add(g4);
	      ud_line.add(g4_b);
	      
	      ud_line.add(item);
		setSize(Ws.width,Ws.height);
		setVisible(true);
		setResizable(false);
		
		heart_T = new Heart_Thread(heart,Field,score,g1_b,g2_b);
		heart_T.start();
	

		}
	
	
}
