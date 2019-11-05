
public class Item_Thread extends Thread {

	Playing_Window win;
	int n;
	
	
	
	Item_Thread(Playing_Window win){
		this.win = win;
		n = 20;
	}

	public void run() {
		while(true) {
			
			if(n<0)
			{
				ItemCreate();
				n = 20;
			}
			n--;
			
			try {
				if(win.ChongR_Mode== 0)
				{	
					sleep(5000);
					win.ChongR_Mode = 1;
				}
				
				sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	public void ItemCreate() {
		
		Item it = null;
	
		it= new Item(win,win.Item_Image[1],(int)(Math.random() * win.getWidth()),(int)(Math.random() * win.getHeight()));
		win.ItemArray.add(it);
	}
}
