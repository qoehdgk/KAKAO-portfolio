import java.awt.Color;
import java.awt.Container;
import java.awt.Font;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class EndScreen extends JFrame{
	GameScreen gs;
	EndScreen(GameScreen gs){
		this.gs = gs;
		setTitle("Game_Result");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		Container c = getContentPane();
		c.setLayout(null);
		
		JLabel body = new JLabel();
		body.setLocation(0,0);
		body.setSize(389,268);
		c.add(body);
		body.setOpaque(true);
		body.setIcon(new ImageIcon("exit.png"));
		//Alien Encounters Solid Bold
		
		JLabel score_R = new JLabel();
		score_R.setFont(new Font("Arial Black", Font.PLAIN, 25));
		score_R.setLocation(119,145);
		score_R.setSize(150,33);
		score_R.setOpaque(true);
		score_R.setBackground(Color.BLACK);
		score_R.setForeground(Color.WHITE);
		score_R.setText(gs.score.getText());
		body.add(score_R);
		
		JButton e_btn = new JButton("EXIT");
		e_btn.setFont(new Font("Arial Black", Font.PLAIN, 20));
		e_btn.setForeground(Color.WHITE);
		e_btn.setLocation(129,180);
		e_btn.setSize(130,40);
		
		e_btn.setBorderPainted(false); //��ư �׵θ� ����
		e_btn.setContentAreaFilled(false); //��ư ���� ��� ǥ�� ����	
		e_btn.setFocusPainted(false); //��Ŀ�� ǥ�� ����
		
		e_btn.addMouseListener(new MouseAdapter(){
			@Override
			public void mouseClicked(MouseEvent e) {
				System.exit(0);	
			}
		});
		
		body.add(e_btn);
		
		setSize(389,268);
		setVisible(true);
	}
	
	
	
}
