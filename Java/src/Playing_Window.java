import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.Vector;

import javax.swing.ImageIcon;
import javax.swing.JPanel;

public class Playing_Window extends JPanel implements KeyListener, Runnable{

	GameScreen gs;
	boolean KeyUp = false;
	boolean KeyDown = false;
	boolean KeyLeft = false;
	boolean KeyRight = false;
	
	public final static int UP_PRESSED		=0x001;
	public final static int DOWN_PRESSED	=0x002;
	public final static int LEFT_PRESSED	=0x004;
	public final static int RIGHT_PRESSED	=0x008;
	public final static int FIRE_PRESSED	=0x010;
	public final static int CONTROL_PRESSED	=0x020;
	   
	ImageIcon[] P_ImageIcon = new ImageIcon[8];
	Image[] P_Image = new Image[8];
	
	ImageIcon[] BZ_ImageIcon = new ImageIcon[4];
	Image[] BZ_Image = new Image[4];
	
	
	ImageIcon[] GZ_ImageIcon = new ImageIcon[4];
	Image[] GZ_Image = new Image[4];
	
	ImageIcon[] RZ_ImageIcon = new ImageIcon[4];
	Image[] RZ_Image = new Image[4];
	
	
	ImageIcon RIcon = new ImageIcon("ChongR.png");
	Image R_Image = RIcon.getImage();
	
	ImageIcon Z_CIcon = new ImageIcon("Z_Fire.jpg");
	Image Z_CImage = Z_CIcon.getImage();
	
	ImageIcon[] Item_ImageIcon = new ImageIcon[2];
	Image[] Item_Image = new Image[2];
	
	

	Toolkit tk = Toolkit.getDefaultToolkit();		
	Dimension Ws = tk.getScreenSize();
	
	
	//JFrame jf;
	
	Thread GameStart;			//그려주는 역할
	Thread Key_P;				//플레이어 움직이는 역할
	Thread Bullet_Thread;		//총알 나간다
	Thread ZombieFire_Thread;	//좀비 총알
	Thread Item_T;				//아이템
	Zombie_Thread Zombie_T;		//좀비 움직이기
	
	
	int keytemp;
	boolean roof = true;	
	
	int G_Status;				//일시정지
	
	int Z_Status;				//


	int P_Image_width;
	int P_Image_height;
	
	boolean shooting;			//트루면 총알이나가
	boolean dining;
	int keybuff;
	int life;					//체력
	
	int P_speed;				//스피드		
	int P_degree;				//각도
	int P_Mode;					//0은 사망 1은 생존
	int P_Image_set;			//플레이어 이미지
	int P_x, P_y;				//플레이어좦 
	
	int ChongR_Mode;			//0이면 사과 
	
	
	
	Rectangle P_Rect;			//Player사각형
	
	int B_x, B_y;				
	int sum = 0;
	
	int Dina;
	int score;					//점수
	Rectangle Rc = new Rectangle();			
	Rectangle Rz = new Rectangle();
	
	
	
	
	
	Vector<ChongR> Weapon = new Vector<ChongR>();			//무기 벡터
	Vector<Zombie> ZomArray = new Vector<Zombie>();			//좀비 벡터
	Vector<Z_ChongR> ZomFire = new Vector<Z_ChongR>();		//좀비총알 벡터
	Vector<Item> ItemArray = new Vector<Item>();			//아이템벡터
	
	
	Playing_Window(GameScreen gs){
		this.gs = gs;
	
		for(int i = 0; i<P_Image.length;i++) {
			P_ImageIcon[i] = new ImageIcon("P"+i+".jpg");
			P_Image[i] = P_ImageIcon[i].getImage();
		}
	    for(int i = 0; i<BZ_Image.length;i++) {
	          BZ_ImageIcon[i] = new ImageIcon("BZ"+i+".png");
	          BZ_Image[i] = BZ_ImageIcon[i].getImage();
	    }
	    for(int i = 0; i<GZ_Image.length;i++) {
	          GZ_ImageIcon[i] = new ImageIcon("GZ"+i+".png");
	          GZ_Image[i] = GZ_ImageIcon[i].getImage();
	    }
	    for(int i = 0; i<RZ_Image.length;i++) {
	          RZ_ImageIcon[i] = new ImageIcon("RZ"+i+".png");
	          RZ_Image[i] = RZ_ImageIcon[i].getImage();
	    }
		for(int i = 0; i<Item_Image.length;i++) {
			Item_ImageIcon[i] = new ImageIcon("Item"+i+".jpg");
			Item_Image[i] = Item_ImageIcon[i].getImage();
		
		}
		setBackground(Color.white);
		this.setFocusable(true);			//키보드 입력 받게해주는 거
		this.requestFocus();				// ""
		
		addKeyListener(this);				// ""
		
	
		System_init();						//초기화
	

	}
	

	@Override
	protected void paintComponent(Graphics g) {
		
		super.paintComponent(g);
		g.clearRect(0, 0, Ws.width, Ws.height);
		g.drawImage(P_Image[P_Image_set],P_x,P_y,this);
		for(int i=0; i<Weapon.size();i++) {
			ChongR a = Weapon.get(i);
			a.draw(g);
			a.move();
		}
		for(int i=0; i<ItemArray.size();i++) {
			Item it = ItemArray.get(i);
			it.draw(g);
		}
		for(int i=0; i<ZomFire.size();i++) {
			Z_ChongR fire = ZomFire.get(i);
			fire.draw(g);
			fire.move();
		}
		for(int i=0; i<ZomArray.size();i++) {
			Zombie z = ZomArray.get(i);
			z.draw(g);
		}
		for(int i =0; i<Weapon.size();i++) { //좀비가  총알 맞았을때
			ChongR a = Weapon.get(i);
			
            Rc.setBounds(a.x, a.y, a.getWidth(),a.getWidth());
			if(a.x<20 || a.x>Ws.width || a.y <30 || a.y >Ws.height)
				remove_BULLET(a);
			 for(int j=0; j<ZomArray.size();j++) {
		            Zombie z = ZomArray.get(j);
		            
		            Rz.setBounds(z.x, z.y, z.getWidth(),z.getWidth());
		            
		            if(checkCollision(Rc,Rz)) {
		            	z.HP --;
		            	if(ChongR_Mode == 0) 
		            		z.HP --;
		                remove_BULLET(a);
		                if(z.HP < 0)
		                	remove_Zombie(z);
		            }
		         }
		}
		for(int i =0; i<ZomFire.size();i++) {	//좀비가 총알 쏠때
			Z_ChongR a = ZomFire.get(i);
			
            Rc.setBounds(a.x, a.y, a.getWidth(),a.getWidth());
			if(a.x<20 || a.x>Ws.width || a.y <30 || a.y >Ws.height)
				remove_Fire(a);

		            
		            
		    if(checkCollision(Rc,P_Rect)) {
		         life--;
		         remove_Fire(a);
		         if(life == 0)
		        	 P_Mode = 0;
		    }
		         
		}
	     for(int i=0;i<ItemArray.size();i++) {//
	            Item it = ItemArray.get(i);
	            
	            
	            
	            Rc.setBounds(it.x,it.y,it.getWidth(),it.getHeight());
	         
	            if(checkCollision(Rc,P_Rect)) {
	            	ChongR_Mode = 0;
	               remove_Item(it);
	         
	         }
	      }
		
		
		
	}
	public static boolean checkCollision(Rectangle me,Rectangle other) {
		
		return me.intersects(other);//
	}
	public void remove_Zombie(Zombie z) {
		      
		if(z instanceof B_Zombie) 
			score += 2;
		if(z instanceof G_Zombie)
			score += 4;
		if(z instanceof R_Zombie)
			score += 6;
		sum = score;
		      ZomArray.remove(z);
	}
	public int GetDistance(int x1,int y1,int x2,int y2){
		return (int)Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
	}
	
	
	public void System_init(){//

		//G_Status=0;
		P_x = 800;
		P_y = 500;
		P_degree = -1;
		P_Image_set = 0;
		P_Mode = 1;
	    P_Image_width = 65;
	    P_Image_height = 65;
		P_speed = 3;
		G_Status =2;		// 
		
		
		life = 10;
		keybuff=0;			//키를 받을때 쓴다
		Weapon.clear();		//맨처음에 벡터비워주기
		
		
		P_Rect = new Rectangle();
		ChongR_Mode =1;		//딱총 시작
		
		Dina = 2;
		
		
		
		score = 0;			
		GameStart=new Thread(this);
		Key_P = new Thread(new Key_Thread(this));
		Zombie_T = new Zombie_Thread(this);
		Bullet_Thread = new Bullet_Thread(this);
		ZombieFire_Thread = new ZombieFire_Thread(this);
		Item_T = new Item_Thread(this);

		GameStart.start();
		Key_P.start();
		Zombie_T.start();
		Bullet_Thread.start();
		ZombieFire_Thread.start();
		Item_T.start();
	}

	
	
	@Override
	public void run() {
		try {
			
		
			while(true){
				if(P_Mode == 1) {
	
					repaint();
			
					Thread.sleep(20);
					
				}
				else
				{
					new EndScreen(gs);
					break;
				}
					
			}
			
		}
		catch(Exception e) {
			e.getStackTrace();
		}
			
	}

	public void process_ENEMY() { //좀비 상태 결정
		Zombie z;
		
		for(int i =0; i<ZomArray.size();i++)
		{
			z = ZomArray.get(i);
			if(GetDistance(P_x, P_y,z.x, z.y) >= 300) 	
				z.status = 0;
			else
				z.status = 1;
			
			if(z.status == 0)
			{
				if(z instanceof B_Zombie)
				{
					if(z.x > P_x) {
						z.x -= z.speed;
						z.image = BZ_Image[0];
					}
					if(z.x < P_x) {
						z.x += z.speed;
						z.image = BZ_Image[1];
					}
					if(z.y > P_y) {
						z.y -= z.speed;
						z.image = BZ_Image[3];
					}
					if(z.y < P_y) {
						z.y += z.speed;
						z.image = BZ_Image[2];
					}						
				}
				else if(z instanceof G_Zombie)
				{
					if(z.x > P_x) {
						z.x -= z.speed;
						z.image = GZ_Image[0];
					}
					if(z.x < P_x) {
						z.x += z.speed;
						z.image = GZ_Image[1];
					}
					if(z.y > P_y) {
						z.y -= z.speed;
						z.image = GZ_Image[3];
					}
					if(z.y < P_y) {
						z.y += z.speed;
						z.image = GZ_Image[2];
					}						
				}
				else if(z instanceof R_Zombie)
				{
					if(z.x > P_x) {
						z.x -= z.speed;
						z.image = RZ_Image[0];
					}
					if(z.x < P_x) {
						z.x += z.speed;
						z.image = RZ_Image[1];
					}
					if(z.y > P_y) {
						z.y -= z.speed;
						z.image = RZ_Image[3];
					}
					if(z.y < P_y) {
						z.y += z.speed;
						z.image = RZ_Image[2];
					}						
				}
			}
		
			else {
				z.status =1;
			}
		}
		
	}
	public void Zombie_Fire() {
		Zombie z = null;
		Z_ChongR Z_c = null;
		
		for (int i = 0;i<ZomArray.size();i ++)
		{
			z = ZomArray.get(i);
			if(z.status == 1) {
				if(z.x<P_x && z.y<P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x + z.getWidth(), z.y + z.getHeight(),7);
				}
				else if(z.x<P_x && z.y>P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x + z.getWidth() , z.y,5);
				}
				else if(z.x>P_x && z.y<P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x,z.y + z.getHeight(),1);
				}
				else if(z.x>P_x && z.y>P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x,z.y,3);
				}
				else if(z.x==P_x && z.y<P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x,z.y + z.getHeight(),0);
				}
				
				else if(z.x==P_x && z.y>P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x + z.getWidth()/2,z.y,4);
				}
				else if(z.x<P_x && z.y==P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x + z.getWidth(), z.y + z.getHeight()/2,6);
				}
				else if(z.x>P_x && z.y==P_y) {
					Z_c = new Z_ChongR(this,Z_CImage,z.x,z.y + z.getHeight()/2,2);
				}
				ZomFire.add(Z_c);
			}
			
		}
	}
	public void process_Player() {
		if(P_x<20) P_x=20;
		if(P_x>Ws.width - 80) P_x=Ws.width - 80;
		if(P_y<30) P_y=30;
		if(P_y>Ws.height -100) P_y=Ws.height -100;
		
		P_Rect.setBounds(P_x,P_y,P_ImageIcon[P_Image_set].getIconWidth(), P_ImageIcon[P_Image_set].getIconHeight());
		
	}
	public void remove_Item(Item it) {
		ItemArray.remove(it);
	}
		
	public void process_BULLET() {
		   ChongR a = null;
		   Image B_Image = null;
		   if(ChongR_Mode == 1)
			   B_Image = R_Image;
		   else if(ChongR_Mode == 0)
			   B_Image = Item_Image[1];
		      if(G_Status == 2){
		         if(shooting == true && P_Mode == 1){
		           switch(P_Image_set) {
		           case 0:
		               a = new ChongR(this,B_Image,P_x + P_Image_width/2,P_y,P_Image_set);
		               break;
		           case 1:
		               a = new ChongR(this,B_Image,P_x + P_Image_width,P_y,P_Image_set);
		               break;
		           case 2:
		               a = new ChongR(this,B_Image,P_x + P_Image_width,P_y + P_Image_height/2,P_Image_set);
		               break;
		           case 3:
		               a = new ChongR(this,B_Image,P_x + P_Image_width,P_y + P_Image_height,P_Image_set);
		               break;
		           case 4:
		               a = new ChongR(this,B_Image,P_x + P_Image_width/2,P_y + P_Image_height,P_Image_set);
		               break;
		           case 5:
		               a = new ChongR(this,B_Image,P_x , P_y + P_Image_height,P_Image_set);
		               break;
		           case 6:
		               a = new ChongR(this,B_Image,P_x, P_y + P_Image_height/2,P_Image_set);
		               break;
		           case 7:
		               a = new ChongR(this,B_Image,P_x, P_y,P_Image_set);
		               break;
		               
		           }
		           Weapon.add(a);
		         }
		      }


	}
	public void remove_BULLET(ChongR a) {
		
			Weapon.remove(a);
	}
	public void remove_Fire(Z_ChongR a) {
		
		ZomFire.remove(a);
	}

	

	@Override
	public void keyPressed(KeyEvent e) {
		if(G_Status==2){
		      switch(e.getKeyCode()) {
		      case KeyEvent.VK_SPACE:
					keybuff|=FIRE_PRESSED;
					shooting=true;

					break;
				case KeyEvent.VK_LEFT:
					keybuff|=LEFT_PRESSED;
					break;
				case KeyEvent.VK_UP:
					keybuff|=UP_PRESSED;
					break;
				case KeyEvent.VK_RIGHT:
					keybuff|=RIGHT_PRESSED;
					break;
				case KeyEvent.VK_DOWN:
					keybuff|=DOWN_PRESSED;
					break;
				case KeyEvent.VK_CONTROL:
					keybuff&=CONTROL_PRESSED;
					break;
		      
	
			default:
				break;
			}
		} else if(G_Status!=2) keybuff=e.getKeyCode();
	}

	@Override
	public void keyReleased(KeyEvent e) {
		if(G_Status==2){
		      switch(e.getKeyCode()) {
				case KeyEvent.VK_SPACE:
					keybuff&=~FIRE_PRESSED;
					shooting=false;

					break;
				case KeyEvent.VK_LEFT:
					keybuff&=~LEFT_PRESSED;
					break;
				case KeyEvent.VK_UP:
					keybuff&=~UP_PRESSED;
					break;
				case KeyEvent.VK_RIGHT:
					keybuff&=~RIGHT_PRESSED;
					break;
				case KeyEvent.VK_DOWN:
					keybuff&=~DOWN_PRESSED;
					break;
				case KeyEvent.VK_CONTROL:
					keybuff&=~CONTROL_PRESSED;
					dining = true;
					break;
				default:
					break;
		      }
	}
		
	}

	@Override
	public void keyTyped(KeyEvent arg0) {
		// TODO Auto-generated method stub
		
	} 
	public void keyprocess(){
		switch(G_Status){
	
			case 2:
				if(P_Mode==1){
					switch(keybuff){

						case FIRE_PRESSED:
						
							break;
						case UP_PRESSED:
							P_degree=0;
							P_Image_set=0;
							P_y -= P_speed;
							break;
						case UP_PRESSED|FIRE_PRESSED:
							P_degree=0;
							P_Image_set=0;
							P_y -= P_speed;
							break;
						case LEFT_PRESSED:
							P_degree=90;
							P_Image_set=6;
							P_x -= P_speed;
							break;
						case LEFT_PRESSED|FIRE_PRESSED:
							P_degree=90;
							P_Image_set=6;
							P_x -= P_speed;
							break;
						case RIGHT_PRESSED:
							P_degree=270;
							P_Image_set=2;
							P_x += P_speed;
							break;
						case RIGHT_PRESSED|FIRE_PRESSED:
							P_degree=270;
							P_Image_set=2;
							P_x += P_speed;
							break;
						case UP_PRESSED|LEFT_PRESSED:
							P_degree=45;
							P_Image_set=7;
							P_x -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case UP_PRESSED|LEFT_PRESSED|FIRE_PRESSED:
							P_degree=45;
							P_Image_set=7;
							P_x -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case UP_PRESSED|RIGHT_PRESSED:
							P_degree=315;
							P_Image_set=1;
							P_x += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case UP_PRESSED|RIGHT_PRESSED|FIRE_PRESSED:
							P_degree=315;
							P_Image_set=1;
							P_x += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case DOWN_PRESSED:
							P_degree=180;
							P_Image_set=4;
							P_y += P_speed;
							break;
						case DOWN_PRESSED|FIRE_PRESSED:
							P_degree=180;
							P_Image_set=4;
							P_y += P_speed;
							break;
						case DOWN_PRESSED|LEFT_PRESSED:
							P_degree=135;
							P_Image_set=5;
							P_x -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case DOWN_PRESSED|LEFT_PRESSED|FIRE_PRESSED:
							P_degree=135;
							P_Image_set=5;
							P_x -= Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case DOWN_PRESSED|RIGHT_PRESSED:
							P_degree=225;
							P_Image_set=3;
							P_x += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						case DOWN_PRESSED|RIGHT_PRESSED|FIRE_PRESSED:
							P_degree=225;
							P_Image_set=3;
							P_x += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							P_y += Math.sqrt(Math.pow(P_speed, P_speed)/2);
							break;
						default:
							
							keybuff=0;

							break;
				}
				break;
			}

		default:
			break;
		}
	}
}

