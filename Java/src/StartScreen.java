import java.awt.Container;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class StartScreen extends JFrame{
	StartScreen(){
		setTitle("Game_Open");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		Container c = getContentPane();
		c.setLayout(null);
		
		JLabel body = new JLabel();
		body.setLocation(0,0);
		body.setSize(697,487);
		c.add(body);
		body.setOpaque(true);
		body.setIcon(new ImageIcon("start_screen.png"));
		
		JButton s_btn = new JButton(new ImageIcon("play_btn.png"));
		s_btn.setLocation(309,321);
		s_btn.setSize(80,32);
		s_btn.setBorderPainted(false);
		
		s_btn.addMouseListener(new MouseAdapter(){
			@Override
			public void mouseClicked(MouseEvent e) {
				dispose();
				new GameScreen();		
			}
		});
		c.add(s_btn);
		
		setSize(697,525);
		setVisible(true); 
	}
}