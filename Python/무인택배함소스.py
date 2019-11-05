# GPIO가 들어간 소스 주석처리하면 프로그램 돌아감.

from tkinter import*
#import RPi.GPIO as GPIO

import random
import time

#GPIO 핀
listG = [4,17,18,27,22,23,24,25,8,7]


#GPIO.setmode(GPIO.BCM)
#GPIO.setwarnings(False)

#객체
class Stock:
    
    def __init__(self):
        self.dong = 0
        self.ho = 0
        self.passwd = 0
        self.Ham = 0

        self.TakBae = ""

    def isEmpty(self):
        if(self.dong == 0):
            return True
        else:
            return False

listA = []
for i in range(10):
    listA.append(Stock())

listB = []
for i in range(10):
    listB.append("BOX "+ str(i+1))


    
def setBoxInfo(SBox,box):
    box = str(SBox.dong) + str(SBox.ho)


class RecieveApp:
    def __init__(self,Parent,obj):

        print(obj.dong)
        self.Ham = obj.Ham
        self.myParent =Parent
        box_x = 20
        box_y = 10
        
        self.Tops = Frame(Parent,height = 50,bg="powder blue",relief=SUNKEN)
        self.Tops.pack(side=TOP)
        
        self.f1 = Frame(Parent, width = 200,height = 700,bg="powder blue",relief=SUNKEN)
        self.f1.pack(side=LEFT)

        self.DongPrint = Label(self.Tops,font=('arial',30,'bold'),text=str(listA[obj.Ham-1].dong) +"동",fg="steel Blue", anchor='center').grid(row=0,column=0)
        self.HoPrint = Label(self.Tops, font=('arial',30,'bold'),text=str(listA[obj.Ham-1].ho) + "호",fg="steel Blue", bd=7, anchor='center').grid(row=0,column=1)
        

        self.f2 = Frame(Parent, width = 300,height = 700,bg="powder blue",relief=SUNKEN)
        self.f2.pack(side=RIGHT)

        
        self.PswdPrint = Label(self.f1, font=('arial',30,'bold'),text="Passwd: ",fg="steel Blue", bd=7, anchor='center').grid(row=0,column=0)
        self.PswdEntry = Entry(self.f2, font=('arial',30,'bold'))
        self.PswdEntry.pack(side=RIGHT)


        self.f3 = Frame(Parent, width = 100,height = 100,bg="powder blue",relief=SUNKEN)
        self.f3.pack(side=BOTTOM)
        
        self.Open = Button(self.f3,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text="열기",bg="powder blue",command=lambda: self.OpenDoor(obj)).grid(row=0,column=0)
        

    def OpenDoor(self,obj):
        print(obj.passwd)
        print(self.PswdEntry.get())

        if(int(obj.passwd) == int(self.PswdEntry.get())):
            
#            GPIO.setup(listG[obj.Ham-1],GPIO.OUT)
#            GPIO.output(listG[obj.Ham-1],False)
            
            listB[obj.Ham-1]  ="BOX " + str(obj.Ham)
            obj.__init__()
            
                
        self.myParent.destroy()
        root = Tk()
        root.geometry("1200x800+0+0")
        root.title("무인택배시스템")
        MainApp(root)
        
        
        
        
class BaedalApp:
    def __init__(self,Parent,obj):
        self.Ham = obj.Ham
        self.myParent = Parent
        box_x = 20
        box_y = 10

        self.Tops = Frame(Parent,height = 50,bg="powder blue",relief=SUNKEN)
        self.Tops.pack(side=TOP)

        self.f1 = Frame(Parent, width = 200,height = 700,bg="powder blue",relief=SUNKEN)
        self.f1.pack(side=LEFT)

        self.f2 = Frame(Parent, width = 300,height = 700,bg="powder blue",relief=SUNKEN)
        self.f2.pack(side=RIGHT)

        self.f3 = Frame(Parent, width = 100,height = 100,bg="powder blue",relief=SUNKEN)
        self.f3.pack(side=BOTTOM)
        
        self.lblInfo = Label(self.Tops, font=('arial',50,'bold'),text="정보 입력",fg="steel Blue", bd=10, anchor='w')
        self.lblInfo.grid(row=0,column=0)

        self.DongPrint = Label(self.f1, font=('arial',30,'bold'),text="동 입력: ",fg="steel Blue", anchor='center').grid(row=0,column=0)
        self.HoPrint = Label(self.f1, font=('arial',30,'bold'),text="호 입력: ",fg="steel Blue", bd=7, anchor='center').grid(row=1,column=0)
        self.PswdPrint = Label(self.f1, font=('arial',30,'bold'),text="비밀 번호: ",fg="steel Blue", bd=7, anchor='center').grid(row=2,column=0)
        self.HamPrint = Label(self.Tops, font=('arial',30,'bold'),text="택배함 : " + str(obj.Ham),fg="steel Blue", bd=7, anchor='center').grid(row=1,column=0)

        self.DongEntry = Entry(self.f2, font=('arial',30,'bold'))
        self.DongEntry.pack(side=TOP)
        self.HoEntry = Entry(self.f2, font=('arial',30,'bold'))
        self.HoEntry.pack(side=TOP)
        self.PswdEntry = Entry(self.f2, font=('arial',30,'bold'))
        self.PswdEntry.pack(side=TOP)
        #self.HamEntry = Entry(self.f2, font=('arial',30,'bold'))
        #self.HamEntry.pack(side=TOP)


        self.SaveButton =Button(self.f3,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text="저장",bg="powder blue")
        self.SaveButton.pack(side = BOTTOM)
        self.SaveButton.bind("<Button-1>",self.SaveButtonClick)

        self.BalSongButton =Button(self.f3,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text="발송",bg="powder blue")
        self.BalSongButton.pack(side = BOTTOM)
        self.BalSongButton.bind("<Button-1>",self.BalSongButtonClick)
        
        self.Cancel=Button(self.f3,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text="취소",bg="powder blue")

        self.Cancel.pack(side=BOTTOM)
        self.Cancel.bind("<Button-1>",self.CancelClick)

    def BalSongButtonClick(self, event):
        listA[self.Ham-1].dong = self.DongEntry.get()
        listA[self.Ham-1].ho = self.HoEntry.get()
        listA[self.Ham-1].passwd = self.PswdEntry.get()
        
        listB[self.Ham-1] = listA[self.Ham-1].dong + "동 \n" + listA[self.Ham-1].ho + "호"
        


        
        self.myParent.destroy()
        root = Tk()
        root.geometry("1200x800+0+0")
        root.title("택배회사선택")

        Pser(root,self.Ham)
    
    def CancelClick(self,event):
        self.myParent.destroy()
        root = Tk()
        root.geometry("1200x800+0+0")
        root.title("무인택배 시스템")
        MainApp(root)

    def SaveButtonClick(self,event):

        
        listA[self.Ham-1].dong = self.DongEntry.get()
        listA[self.Ham-1].ho = self.HoEntry.get()
        listA[self.Ham-1].passwd = self.PswdEntry.get()
        
        listB[self.Ham-1] = listA[self.Ham-1].dong + "동 \n" + listA[self.Ham-1].ho + "호"
        

#        GPIO.setup(listG[self.Ham-1],GPIO.OUT)
#       GPIO.output(listG[self.Ham-1],True)


        self.myParent.destroy()
        
        root = Tk()
        root.geometry("1200x800+0+0")
        root.title("무인택배 시스템")
        
        MainApp(root)

    
class MainApp:
    def __init__(self,Parent):

        box_x = 40
        box_y = 20

        self.myParent = Parent


        self.Tops = Frame(Parent, width = 1200,height = 50,bg="powder blue",relief=SUNKEN)
        self.Tops.pack(side=TOP)

        self.f1 = Frame(Parent, width = 800,height = 700,bg="powder blue",relief=SUNKEN)
        self.f1.pack(side=LEFT)

        
        self.f2 = Frame(Parent, width = 300,height = 700,bg="powder blue",relief=SUNKEN)
        self.f2.pack(side=BOTTOM)


        #Info

        self.lblInfo = Label(self.Tops, font=('arial',50,'bold'),text="무인택배시스템",fg="steel Blue", bd=10, anchor='w')
        self.lblInfo.grid(row=0,column=0)

             

        self.box1=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[0]),bg="powder blue",command=lambda: self.RecieveClick(listA[0])).grid(row=0,column=0)
        self.box2=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[1]),bg="powder blue",command=lambda: self.RecieveClick(listA[1])).grid(row=0,column=1)
        self.box3=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[2]),bg="powder blue",command=lambda: self.RecieveClick(listA[2])).grid(row=0,column=2)
        self.box4=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[3]),bg="powder blue",command=lambda: self.RecieveClick(listA[3])).grid(row=0,column=3)
        self.box5=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[4]),bg="powder blue",command=lambda: self.RecieveClick(listA[4])).grid(row=0,column=4)
        

        self.box6=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[5]),bg="powder blue",command=lambda: self.RecieveClick(listA[5])).grid(row=1,column=0)
        self.box7=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[6]),bg="powder blue",command=lambda: self.RecieveClick(listA[6])).grid(row=1,column=1)
        self.box8=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[7]),bg="powder blue",command=lambda: self.RecieveClick(listA[7])).grid(row=1,column=2)
        self.box9=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[8]),bg="powder blue",command=lambda: self.RecieveClick(listA[8])).grid(row=1,column=3)
        self.box10=Button(self.f1,width = 5,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text=str(listB[9]),bg="powder blue",command=lambda: self.RecieveClick(listA[9])).grid(row=1,column=4)

 
#        self.Baedal=Button(self.f2,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text="BaeDal",bg="powder blue")
#        self.Baedal.pack(side=BOTTOM)
#        self.Baedal.bind("<Button-1>",self.BaedalClick)
        
        self.Cancel=Button(self.f2,padx=box_x,pady=box_y,bd=8,fg="black",font=('arial',20,'bold'),text="Cancel",bg="powder blue")

        self.Cancel.pack(side=BOTTOM)
        self.Cancel.bind("<Button-1>",self.CancelClick)
    
#    def BaedalClick(self,event):

#        root = Tk()
#        root.geometry("1200x800+0+0")
#        root.title("Takbae")

#        self.myParent.destroy()
#        BaedalApp(root)

    def CancelClick(self,event):
    
#        for i in range(10):
#            GPIO.setup(listG[i],GPIO.OUT)
#            GPIO.output(listG[i],False)
#        GPIO.cleanup()
    
        self.myParent.destroy()

    def RecieveClick(self,obj):
        if obj in listA:
            obj.Ham = listA.index(obj) +1

        if obj.isEmpty() == True:
            root = Tk()
            root.geometry("1200x800+0+0")
            root.title("무인택배 시스템")

            self.myParent.destroy()
            BaedalApp(root,obj)
        else:
            root = Tk()
            root.geometry("1200x800+0+0")
            root.title("무인택배 시스템")
            self.myParent.destroy()
            RecieveApp(root,obj)

            
        
#=------===========================
def PserClick():
    
    root = Tk()
    root.geometry("1200x800+0+0")
    root.title("택배회사선택")

    Pser(root)



class Pser:
    def __init__(self,root,Ham):
        self.Ham = Ham
        x1 = 20
        y1 = 4
        
        self.myRoot = root
        self.tops = Frame(root,width=600,height = 50,bg="powder blue",relief=SUNKEN)
        self.tops.pack(side=TOP)

        self.bottom = Frame(root,width=600,height = 240,bg="powder blue",relief=SUNKEN)
        self.bottom.pack(side=BOTTOM)

        str1 = StringVar()
#===============setName=======================
        def PName_A():
            str1.set("A")
            P_name= "A"
            
        def PName_B():
            str1.set("B")
            P_name= ""

        def PName_C():
            str1.set("C")
            P_name= "C"

        def PName_D():
            str1.set("D")
            P_name= "D"

        def PName_E():
            str1.set("E")
            P_name= "E"

        def PName_F():
            str1.set("F")
            P_name= "F"

        def PName_G():
            str1.set("G")
            P_name= "G"            

        def PName_H():
            str1.set("H")
            P_name= "H"

        def PName_I():
            str1.set("I")
            P_name= "I"

        def PName_J():
            str1.set("J")
            P_name= "J"

        def PName_K():
            str1.set("K")
            P_name= "K"

#=================
        str1.set("택배사를 고르시오")

        self.txtDisplay = Entry(self.tops, textvariable = str1, font=('arial',24,'bold'),bg="powder blue",bd =10, width= 32, justify = CENTER)
        self.txtDisplay.grid(row=1,column=0)
        self.lblInfo = Label(self.tops, font=('arial',50,'bold'),text=listB[self.Ham-1]+"\n"+str(self.Ham)+"번 택배함 ",fg="steel Blue", bd=10, anchor='w')
        self.lblInfo.grid(row=0,column=0)

        self.Pser1=Button(self.bottom,width=x1, height =y1, text="A",bg="CornSilk",command=PName_A).grid(row=0,column=0)
        self.Pser2=Button(self.bottom,width=x1, height =y1, text="B",bg="CornSilk",command=PName_B).grid(row=0,column=1)
        self.Pser3=Button(self.bottom,width=x1, height =y1, text="C",bg="CornSilk",command=PName_C).grid(row=0,column=2)
        self.Pser4=Button(self.bottom,width=x1, height =y1, text="D",bg="CornSilk",command=PName_D).grid(row=0,column=3)
        self.Pser5=Button(self.bottom,width=x1, height =y1, text="E",bg="CornSilk",command=PName_E).grid(row=1,column=0)
        self.Pser6=Button(self.bottom,width=x1, height =y1, text="F",bg="CornSilk",command=PName_F).grid(row=1,column=1)
        self.Pser7=Button(self.bottom,width=x1, height =y1, text="G",bg="CornSilk",command=PName_G).grid(row=1,column=2)
        self.Pser8=Button(self.bottom,width=x1, height =y1, text="H",bg="CornSilk",command=PName_H).grid(row=1,column=3)
        self.Pser9=Button(self.bottom,width=x1, height =y1, text="I",bg="CornSilk",command=PName_I).grid(row=2,column=0)
        self.Pser10=Button(self.bottom,width=x1, height =y1, text="J",bg="CornSilk",command=PName_J).grid(row=2,column=1)
        self.Pser11=Button(self.bottom,width=x1, height =y1, text="K",bg="CornSilk",command=PName_K).grid(row=2,column=2)
        self.Pser12=Button(self.bottom,width=x1, height =y1, text="선택",bg="CornSilk", command=lambda: self.S_end(str1)).grid(row=2,column=3)

    def S_end(self,str1):
        listA[self.Ham-1].Takbae = str1.get()
        listB[self.Ham-1] = listA[self.Ham-1].Takbae + "사 "
        #GPIO.setup(listG[self.Ham-1],GPIO.OUT)
        #GPIO.output(listG[self.Ham-1],True)'''
        self.myRoot.destroy()
        root = Tk()
        root.geometry("1200x800+0+0")
        root.title("무인 택배 시스템")
        
        MainApp(root)        




#==============================
        
    
        
    


root = Tk()
root.geometry("1200x800+0+0")
root.title("무인택배 시스템")
mainApp = MainApp(root)

root.mainloop()





