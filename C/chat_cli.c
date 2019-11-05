#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <fcntl.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/time.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <pthread.h>


#define MAXLINE 511
#define NAME_LEN 20
#define MAX_BUF 511

const char *EXIT_STRING = "exit\n";
const char *CHAT_STRING = "chat\n";

typedef struct User_data{
	int chat_num;
	char c_name[20];
	int is_head;
	char User_id[20];
}User_data;	

int tcp_connect(int af, char *servip, unsigned short port);
void main_interface();
int login_interface(int);
int tcp_login(int id);
int tcp_adduser(int sock);
User_data* User;

int chat_plus(int);
int chat_create(int);
int print_chat(int);
void R_interface();

const char* CHECK = "check";
	
void errquit(char *mesg)
{
	perror(mesg);
	exit(1);
}

int main(int argc, char *argv[])
{
	char bufall[MAXLINE+NAME_LEN], *bufmsg;
	char buf[MAXLINE];
	char bann_buf[MAXLINE];
	char c_num[2];
	char tbuf[2];
	char *token;
	int maxfdp1, s, namelen, num, n;
	int status;
	int vote_num = 0;
	
	fd_set read_fds; 
	User = (User_data *)malloc(sizeof(User_data));
	User-> chat_num = 0;
	User-> is_head = 0;
	memset(User-> User_id , 0, sizeof(User->User_id));
	memset(User-> c_name , 0, sizeof(User->c_name));

	if(argc != 3)
	{
		printf("사용법 : %s server_ip port  \n", argv[0]);
		exit(0);
	}

	namelen = strlen(bufall);
	bufmsg = bufall + namelen;
	s = tcp_connect(AF_INET, argv[1], atoi(argv[2]));
	if( s == -1)
		errquit("tcp_connect fail");
	
	puts("서버에 접속되었습니다.");
	
	//Login Interface
	main_interface();
	scanf("%d",&num);
	switch(num){
		case 1:
			if((n = tcp_login(s))<0){
				close(s);
				exit(0);			//return -1 접속해제 후 종료 추후 종료안하고 다시 메뉴이동으로 바꿀수도
			}
			break;
		case 2:
			//회원가입
			if((n=tcp_adduser(s))<0){
				close(s);
				exit(0);
			}
			break;
		default: 
			exit(1);
			break;
	}
		

	
	maxfdp1 = s + 1;
	FD_ZERO(&read_fds);
	
	getchar();
	printf("Chating Start\n");
	while(1) //bufmsg 만 write하도록 수정 6/8
	{
		memset(buf,0, sizeof(buf));
		strcpy(buf,CHECK);
		
		FD_SET(0, &read_fds);
		FD_SET(s, &read_fds);
		if(select(maxfdp1, &read_fds, NULL, NULL, NULL) < 0)
			errquit("select fail");
		if(FD_ISSET(s, &read_fds))
		{
			int nbyte;
			if((nbyte = recv(s,bufmsg, MAXLINE, 0)) > 0)
			{
				if(User->chat_num == 0){
					if(!strcmp(bufmsg,"vote")){
						memset(bann_buf,0,sizeof(bann_buf));
						printf("\n 퇴장 투표할 사용자를 입력하시오: \n");
						scanf("%s",bann_buf);
						write(s,bann_buf,sizeof(bann_buf));
						printf("퇴장 투표가 시작됩니다\n");
						write(s,"OK",100);
						memset(buf,0,MAXLINE);
						read(s,buf, 20);
						printf("퇴장 id : %s\n", bann_buf);
						printf("찬성시 1 입력/ 반대 시 2입력\n");
						memset(buf,0,MAXLINE);
						scanf("%d", &vote_num);
						sprintf(buf,"%d",vote_num);
						write(s, buf, 100);
						memset(buf,0,sizeof(bufmsg));
					
					//	read(s,buf, MAXLINE);
						//bok
					}	
						//여기까지는 bann을 쓴 사람만 돌아간다.
					else if(!strcmp(bufmsg,"ban")){
						printf("퇴장 투표가 시작됩니다\n");
						write(s,"OK",100);
						memset(buf,0,MAXLINE);
						read(s,buf, 20);
						printf("퇴장 id : %s\n", buf);
						printf("찬성시 1 입력/ 반대 시 2입력\n");
						memset(buf,0,MAXLINE);
						scanf("%d", &vote_num);
						sprintf(buf,"%d",vote_num);
						write(s, buf, 100);
						memset(buf,0,sizeof(bufmsg));
					}
					else{
						bufmsg[nbyte] = 0;
						printf("%s \n", bufmsg);
						memset(bufmsg,0,MAXLINE);
					}
				}
				else{
					sprintf(c_num, "%d", User->chat_num);
					token = strtok(bufmsg,"\t");
					strcpy(tbuf, token);
					strcpy(bufmsg,strtok(NULL,"\t"));
					if(!strcmp(tbuf, c_num)){
						bufmsg[nbyte] = 0;
						printf("%s \n", bufmsg);
						memset(bufmsg,0,MAXLINE);
					}
				}
			}
		}
		
		if(FD_ISSET(0, &read_fds))
		{
			
			if(num ==4){
				getchar();
			}
			num = 0;
			if(fgets(bufmsg, MAXLINE, stdin))
			{
				if(User->chat_num == 0){
					if(send(s, bufmsg, strlen(bufmsg), 0) < 0)
						puts("Error : Write error on socket.");
					if(strcmp(bufmsg, EXIT_STRING) == 0)
					{
						puts("Good bye.");
						free(User);
						close(s);
						exit(0);
					}
					else if(!strcmp(bufmsg,CHAT_STRING)){
						while(num != 4){
							R_interface();
							scanf(" %d",&num);
							switch(num){
								case 1:
									//생성
									if(chat_create(s) == -1)
										printf("Can't Create Chat_Room err: Full Chat_Room\n");
									break;
								case 2:
									//리스트
									if(print_chat(s) == -1)
										printf("NO Chat_ROOM\n");
									break;
								case 3:
									//참가
									if(chat_plus(s) == -1)
										printf("Can't Join Chat_Room\n");
									break;
								case 4:
									sprintf(buf, "%d",num);
									write(s,buf,sizeof(buf));
									if(User->chat_num){
										printf("%d번, %s 채팅방에 오신 것을 환영합니다!\n",User->chat_num,User->c_name);
										printf("-------------------------------------------\n");													}
									break;
								default: 
									break;
							}
						}
					}
					memset(bufmsg,0,MAXLINE);
				}
				else{
					strcat(buf,"\t");
					sprintf(c_num,"%d",User->chat_num);
					strcat(buf,c_num);
					strcat(buf,"\t");	
					strcat(buf,bufmsg);
					strcat(buf,"\t");	
					
					if(!strcmp(bufmsg,"quit\n")){
						User->chat_num = 0;
						memset(User->c_name,0, sizeof(User->c_name));
						printf("채팅방에서 나갑니다. 안녕히가세요!\n");
						printf("-------------------------------------------\n");
					}
					write(s, buf, sizeof(buf));

				}
			}
		}
	}
}
int print_chat(int s){
	char buf[MAX_BUF];
	char nbuf[MAX_BUF];
	char *tok = "";
	
	int i,  num;
	
	memset(buf, 0, sizeof(buf));
	strcpy(buf, "2"); 
	write(s, buf, sizeof(buf));
	memset(buf, 0, sizeof(buf));
	memset(nbuf, 0, sizeof(buf));

	read(s, buf, sizeof(buf));

	if(!strcmp(buf, "NO\n")){
		return -1;	
	}
	else
		num = atoi(buf);
	memset(buf,0,sizeof(buf));
	
	printf("--------- List --------\n\n");

	for(i= 0; i<num; i++){
		read(s, buf, sizeof(buf));
		tok = strtok(buf,"\t");
		strcpy(nbuf, tok);
		tok = strtok(NULL,"\t");
		strcpy(buf, tok);
		printf("%d_Room -- %s --", i+1, nbuf);

		printf("%dPeople\n", atoi(buf));
		memset(buf, 0, sizeof(buf));
		memset(nbuf, 0, sizeof(buf));
		
	}
	printf("-----------------------\n");
	return 0;
}

int chat_create(int s){
	char buf[MAX_BUF];
	int nbyte;

	memset(buf,0,sizeof(buf));
	strcpy(buf, "1"); 
	send(s, buf, sizeof(buf), 0);
	if((nbyte = recv(s,buf, sizeof(buf),0))> 0){
		if(strstr(buf, "Can't")){
			return -1;
		}
		printf("%s\n",buf);
		memset(buf, 0, sizeof(buf));
		printf("Chat_Room Name?: ");
		scanf("%s", buf);
		strcpy(User->c_name, buf);
		send(s, buf,sizeof(buf),0);
		memset(buf, 0, sizeof(buf));
		if((nbyte = recv(s,buf, sizeof(buf),0))> 0){
			User->chat_num = atoi(buf);
			User->is_head = 1;
			return 0;
		}
	}

}

int chat_plus(int s){
	int num;
	char buf[MAX_BUF];
	char n_buf[MAX_BUF];
	char *name_buf;
	strcpy(buf, "3"); 
	write(s, buf, sizeof(buf));
	memset(buf, 0, sizeof(buf));
	

	printf("Put Room_Num you want: ");
	scanf("%d",&num);
	
	sprintf(buf,"%d", num);
	write(s, buf, sizeof(buf));
	memset(buf, 0, sizeof(buf));
	
	
	read(s,buf, sizeof(buf));
	
	if(!strcmp(buf, "NO\n")){
		return -1;	
	}
	else{
		strcpy(n_buf,strtok(buf, "\t"));
		name_buf = strtok(NULL,"\t");
		strcpy(User->c_name, name_buf);
		
		printf("Welcome to Chat_%d, %dst Member\n", num,atoi(n_buf));
		User->chat_num = num;
		return 0;
	}
}

int tcp_connect(int af, char *servip, unsigned short port)
{
	struct sockaddr_in servaddr;
	int s;

	if((s = socket(af, SOCK_STREAM, 0)) < 0)
		return -1;
	bzero((char *)&servaddr, sizeof(servaddr));
	servaddr.sin_family = af;
	inet_pton(AF_INET, servip, &servaddr.sin_addr);
	servaddr.sin_port = htons(port);
	
	if(connect(s, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0)
		return -1;
	return s;
}

void main_interface(){
	printf("-------- Hello --------\n");
	printf(" 1. Login \n");
	printf(" 2. Join \n");
	printf(" 3. Exit \n");
	printf("-----------------------\n");
}

	
int tcp_login(int s){					//로그인 함수 노가다.
	printf("-------- Login --------\n\n");
	write(s,"1",sizeof(char));			//1번 넘기면 서버에서 1번 받아서 스위치
	char id[20];
	char passwd[20];
	char buf[MAX_BUF];
	int n, check =0;
	int result = 0;
		
	if(n =read(s,buf,sizeof(buf))> 0){
		printf("%s",buf);
		memset(buf,(int)NULL,sizeof(buf));
		scanf("%s", id);	
		strcpy(User->User_id, id);
	memset(buf, 0, sizeof(buf));
	}		

	if(write(s,id,sizeof(id))<=0){
		perror("write error: send ID");
	}
	if(n= read(s,buf,sizeof(buf))> 0){
		if((strcmp(buf,"exit"))== 0){
			printf("Can't Find your ID\n");
			memset(buf,(int)NULL,sizeof(buf));
			result = -1;
			return result;
		}
		else{
			printf("%s",buf);
			scanf("%s",passwd);
		}
	}
	do{
		memset(buf,(int)NULL,sizeof(buf));
		if(write(s,passwd,sizeof(passwd))<=0){
			perror("write error: send passwd");
		}
		read(s,buf,sizeof(buf));
		if((strcmp(buf,"exit"))== 0){
			printf("%s",buf);
			result = -1;
			break;
		}
		else if(strcmp(buf,"OK") != 0){
			printf("%s\n",buf);
			printf("passwd: ");
			scanf("%s", passwd);	
		}
	}while(strcmp(buf,"OK"));
	
	return result;
}

int tcp_adduser(int s){
	write(s,"2",sizeof(char)); //ser측에서 2번 스위치 문으로 넘어가도록 write
	char id[20];
	char passwd[20];
	char buf[MAX_BUF];
	int n, check =0;
	int result = 0;

	if(n = read(s,buf,sizeof(buf))>0){
		printf("%s",buf);
		memset(buf,0,sizeof(buf));
		scanf("%s",id);
	}
	
	if(write(s,id,sizeof(id))<=0){
		perror("write error \n");
	}

	if(n=read(s,buf,sizeof(buf))>0){
		if((strcmp(buf,"exit"))==0){
			printf("Can't Find yout ID \n");
			memset(buf,0,sizeof(buf));;
			result = -1;
			return result;
		}else{
			printf("%s",buf);
			scanf("%s",passwd);
		}
	}
	do{
		memset(buf,0,sizeof(buf));
		if(write(s,passwd,sizeof(passwd))<=0){
			perror("write error: send pw");
		}
		read(s,buf,sizeof(buf));
		if((strcmp(buf,"exit")) ==0){
			printf("%s",buf);
			result = -1;
			break;
		}
		else if(strcmp(buf,"OK") == 0){
				printf("회원 가입 완료 \n");
				break;
		}

	}while(strcmp(buf,"OK"));
	return result;
}

void R_interface(){
	printf("--------- Chat --------\n");
	printf(" 1. Create \n");
	printf(" 2. List \n");
	printf(" 3. Join \n");
	printf(" 4. Exit \n");
	printf("-----------------------\n");
}
