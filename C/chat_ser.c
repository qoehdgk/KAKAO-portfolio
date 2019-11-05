// 파일명 : mtchats.c 
// 기  능 : 멀티스레드 채팅 서버, 뮤텍스 사용
// 컴파일 : gcc -o mtchats mtchats.c -lpthread
// 작성자 : 배동하, 한상혁
//
// 구현기능 
// 1. 로그인
// 2. 회원가입
// 3. 귓속말
// 4. 채팅방 생성
//
// main 문의 p와  addUser 구조체를 포인터를 넣고 메모리 할당 시킴.
// free를 위해 resv_send 에 my_arg 포인터 매개변수 넣음.
// 로그인 passwd기능 까지 구현 완료 6/7
//
// 	
//	메모리 초기화/ 전송 값 닉네임 + 대화내용 6/8
//	회원가입 기능 구현, exit 처리 수정 6/9
//	귓속말 기능 구현, whisper 값 판단 후, whisper시 해당하는 닉네임의 유저에게 귓속말 전송/ 6월 13일
//  사용방법 : whisper [name] [message]
//  
//  문제점 1: whisper란 단어를 유저는 입력할 수없음. 입력하자마자 segfault
//  문제점 2: whisper name message라는 단어를 정확히입력 하지않으면 segfault
//  문제점 3: whisper name exit 라는 exit라는 단어를 보낼 수 없음.
//
//	교수님 요구사항 : [ip]:[port]:[username] : 메세지 내용 / recv_send함수 buf 수정 / 6월 13일
//  
//  채팅 프로그램 구현
//  현재 Join만  오류
//
//  생성, 채팅방 들어간 인원 제외한 인원 대화 가능
//  
//  
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <fcntl.h>
#include <signal.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/file.h>
#include <unistd.h>
#include <errno.h>
#include <arpa/inet.h>
#include <pthread.h>
#include <netdb.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <time.h>
#include <bits/select.h> // 최대 소켓 수(FD_SETSIZE : 1024)
#include <bits/local_lim.h> // 최대 스레드 수 : 64
#include <unistd.h> // bann에서 sleep 이용하기 위해서

#define MAX_LINE 	511
#define MAX_BUFSZ	511
#define MAX_CHAT _POSIX_THREAD_THREADS_MAX
#define MAX_SOCKET	FD_SETSIZE

typedef struct user_data{		//유저 데이타 구조체	6/7
	char id[20];
	char pw[20];
	int login; // login 확인 변수 6/9
	int s; // sockect 저장 변수 6/13
	int bann; // bann확인 변수 6/19
}user_d;

typedef struct map_table {
	pthread_t thid;
	char ip_addr[20];
	char port[5];
}map_t;

typedef struct addUser{			//유저 로그인  6/7
	int s;
	user_d user;
}addUser;

typedef struct addClient_pass {
	int s; //socket id
	addUser * User;
	struct sockaddr_in cliaddr;
	int in_chat;
}addClient_Pass_Type;

typedef struct Chat_Room{		// 채팅방 구조체
	char c_name[30];			// 채팅방 이름
	int c_num;					// 채팅방에 있는 사람 명 수
	addClient_Pass_Type *clies[5];	//채팅방에 있는 클라이언트 addClient_Pass구조체 주소 배열
}Chat_Room;

typedef struct buser{
	char bid[20]; // 강퇴 유저 이름
	int bsock; // 강퇴 소켓번호
	//전체 유저수는 전역변수로 되있으니 찬성 수 만 비교
	int startsock;//강퇴 시작하는 소켓
	int agree_num; //찬성 수
}buser;

typedef struct bthread{
	user_d * User;
	int num;
}bthread;
	

pthread_mutex_t count_lock;	// 뮤텍스 초기화
pthread_mutexattr_t mutex_attr; // 뮤텍스 속성 초기화

const char *EXIT_STRING = "exit\n";							//채팅방 나가기
const char *START_STRING = "공개 채팅방에 오신 것을 환영합니다.\n";	//첫 시작 메세지
const char *CHAT_STRING = "chat\n";							//채팅 관련 메세지
const char *CHAT_CHECK = "check\t";							//채팅 방 대화 관련 메세지
const char *BANN_STRING = "bann\n";

char buf[MAX_LINE];
int clisock_list[MAX_CHAT - 1]; //채팅에 참가한 소켓번호
map_t sock_map[MAX_CHAT - 1];
int listen_sock;
int num_chat=0; // 채팅 참여자 수
void read_userdb();				//파일에서 회원 목록 불러오기.
int chat_room_num[10];				//채팅방 수는 10개	6/14
Chat_Room* room[10];

buser ban_user;
bthread * bUser;
int bok = 0;

void do_thread(int sock);
void *addClient(void *);
addUser* login(addUser *);
void removeClient(int, addClient_Pass_Type * );//채팅에서 탈퇴
void recv_and_send(int, addClient_Pass_Type * ); // 클라이언트에서 수신 문자를 모든 클라이언트에 전송
int set_nonblock(int sockfd);//소켓을 넌블록으로 지정
int is_nonblock(int sockfd);//소켓이 넌블록모드인지 확인
void tcp_listen(int host, int port, int backlog);//소켓 생성 및 리슨
pthread_t tid[MAX_CHAT - 1];
user_d ogUser[MAX_CHAT - 1];			//기존 유저목록		6/7
void saveUser(user_d * member);
void print_time();
void removeBannClient(int);

void *print_chat(void *);
void *chat_create(void *);
void *chat_plus(void *);
void *bann_user(void *);

void errquit(char *msg){
	perror(msg);
	exit(-1);
}

void thr_errquit(char *msg, int errcode){
	printf("%s\n",msg,strerror(errcode));
	pthread_exit(NULL);
}

void s_init() {
	int i;
	for(i=0;i<MAX_CHAT-1;i++){					
		clisock_list[i] = -1;
	}
	for(i=0;i<10;i++){
		chat_room_num[i] = 0;					//채팅방 인원 초기화
	}
	
	read_userdb();								//init에서 기존 유저 받아오기 6/7
}

void print_time(){
	time_t now;
	struct tm t;
	time(&now);
	t = *localtime(&now);

	printf("현재 시간 : %4d.%d.%d %d:%d:%d \n", t.tm_year+1900, t.tm_mon+1, t.tm_mday, t.tm_hour, t.tm_min,t.tm_sec);
}

int main(int argc, char *argv[])
{
	int i,j,port,status,nbyte,count;
	int accp_sock;
	int servlen, clilen, max_socket;
	struct sockaddr_in cliaddr;
	pthread_t tid;
	addClient_Pass_Type *p;
	addUser* user;
	
	
	if(argc != 2) {
		printf("사용법: %s port\n",argv[0]);
		exit(0);
	}
	print_time();
	printf("채팅 서버를 시작합니다.\n\n");
	port = atoi(argv[1]);

	clilen =sizeof(struct sockaddr_in);
	servlen = clilen;
	//max_socket = getdtablesize();// 최대 소켓 수	
	s_init(); // 변수 초기화
	pthread_mutexattr_init(&mutex_attr); // 뮤텍스 초기화
	pthread_mutex_init(&count_lock, &mutex_attr); // 뮤텍스 속성변수
	
	// 접속 설정 소켓 생성
	tcp_listen(INADDR_ANY, port, 5);

	while(1) {
		accp_sock = accept(listen_sock,(struct sockaddr *)&cliaddr, &clilen);
		if(accp_sock == -1)
			errquit("accept fail\n");
		
		user = (addUser *) malloc(sizeof(addUser));							//유저 메모리 할당
		p = (addClient_Pass_Type *) malloc(sizeof(addClient_Pass_Type));	//p 메모리할당

		user->s = accp_sock;
		user = (addUser *)login(user);
		if((p->s = user->s) < 0){							//로그인 함수로
			printf("Login Failed \n");
			close(accp_sock);								//유저 동적메모리 free
			free(user);
			free(p);
			continue;
		}
		p->User= user;
		p->in_chat = 0;
			
		bcopy((struct sockaddr_in *) &(cliaddr),(struct sockaddr_in *)&(p->cliaddr),clilen); 
		status = pthread_create(&tid,NULL,&addClient, (void *)p);
		if(status != 0)
			thr_errquit("pthread create", status); 
		
	} // while
} // main()

addUser* login(addUser *newUser){							//로그인 기능 함수
	addUser *user;
	user = newUser;

	user_d * member;

	char buf[MAX_LINE];
	char id_buf[20];
	char passwd_buf[20];
	int i, check =0;
	int nbyte;
	int n; // login시도하는 아이디 확인할 수 있는 변수
	memset(buf,0, sizeof(buf));

	read(user->s,buf,sizeof(buf));
	switch(atoi(buf)){
		case 1:
			memset(buf,(int)NULL,sizeof(buf));						//초기화
			memset(id_buf,(int)NULL,sizeof(id_buf)); 
			memset(passwd_buf,(int)NULL,sizeof(passwd_buf)); 
			
			strcpy(buf,"put ID: ");									//id
			printf("%s\n",buf);
			if(write(user->s,buf,sizeof(buf))< 0){
				perror("write error: put id");
			}
			if(nbyte = read(user->s, id_buf, sizeof(id_buf)) > 0){			//id 확인 후 user구조체에 아이디와 패스워드 삽입.
				for(i=0;i<MAX_CHAT -1;i++){
					if(strcmp(ogUser[i].id,id_buf) == 0){
						if(ogUser[i].login !=1){
							printf("id Found!!\n");
							check = 2;
							strcpy(user->user.id,ogUser[i].id);
							strcpy(user->user.pw,ogUser[i].pw);
							sprintf(buf,"put Passwd: ");
							write(user->s,buf,sizeof(buf));
							n = i;
							break;
						}else{
							sprintf(buf,"exit");
							write(user->s, buf,sizeof(buf));
							user->s = -1;
							break;
						}
					}
				}	
				if(check == 0){											//id 못찾은 경우
					sprintf(buf,"exit");
					write(user->s, buf,sizeof(buf));
					user->s = -1;
					break;
				}
			}			

			while(check>= 0){
				if(nbyte = read(user->s, passwd_buf, sizeof(passwd_buf)) > 0){			//passwd
					if(strcmp(user->user.pw,passwd_buf) == 0){
						printf("passwd Corrected!!\n");
						sprintf(buf,"OK");
						write(user->s,buf,sizeof(buf));
						ogUser[n].login = 1;
						ogUser[n].bann=0;
						ogUser[n].s = user->s; // 귓속말 구현user랑 s묶음 
						break;
					}
					else{																//세번 까지 기회주기
						sprintf(buf,"Wrong!! %d times left",check);
						if(check == 0){
							sprintf(buf,"exit");
							write(user->s, buf,sizeof(buf));
							user->s = -1;
							break;
						}
						else{
							write(user->s,buf,sizeof(buf));
						}
						check--;
					}
				}	
			}			
			break;
		case 2:
			//회원가입
			memset(buf,0,sizeof(buf));
			memset(id_buf,0,sizeof(id_buf));
			memset(passwd_buf,0,sizeof(passwd_buf));
			
			strcpy(buf,"put ID: ");									//id buf
			printf("%s\n",buf);
			if(write(user->s,buf,sizeof(buf))< 0){
				perror("write error: put id");
			}
			
			if(nbyte = read(user->s, id_buf,sizeof(id_buf))>0){
				for(i=0;i<MAX_CHAT -1;i++){
					if(strcmp(ogUser[i].id,id_buf)!=0){ //동일한 id 있는지 확인
						printf("new user add!!\n");
						strcpy(member->id,id_buf);
						sprintf(buf, "put Passwd: ");
						write(user->s,buf,sizeof(buf));
						check = 1;
						break;
					}
					else{
						sprintf(buf,"exit"); // 동일한 id 있을 경우 exit
						write(user->s,buf,sizeof(buf));
						user->s = -1;
						break;
					}
				}
			}
			
			while(check>=0){
				if(nbyte = read(user->s, passwd_buf,sizeof(passwd_buf)) > 0){ // passwd저장
					printf("passwd save!\n");
					strcpy(member->pw,passwd_buf);
					sprintf(buf,"OK");
					write(user->s,buf,sizeof(buf));
					saveUser(member);
					user->s= -1;
					break; // 현재 회원가입 시 저장이 되고 cli종료 되도록
				}
			}
			break;
		case 3:
			printf("%d: quit\n",user->s);
			user->s = -1;
			break;
		default:
			printf("Wrong Number!!!!!\n");
			user->s = -1;
			break;
	}
	return user;
}

void tcp_listen(int host, int port, int backlog)
{
	struct sockaddr_in servaddr;
	int accp_sock;

	printf("Listen Thread : %d\n", pthread_self());
	printf("---------------------------------\n");
	// 소켓 생성
	if((listen_sock = socket(AF_INET,SOCK_STREAM,0))<0)
		errquit("socket fail");

	bzero((char *)&servaddr,sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = htonl(host);
	servaddr.sin_port = htons(port);

	if(bind(listen_sock,(struct sockaddr *)&servaddr, sizeof(servaddr))<0){
		perror("bind fail");
		exit(1);
	}

	listen(listen_sock, backlog);
} // tcp_listen

void *addClient(void* called_arg)
{
	int new_index, i,j,k,n,c, tlen;
	char tbuf[MAX_BUFSZ], buf[30];
	char cli_ip[40];
	char cli_port[10];
	addClient_Pass_Type *my_arg;

	my_arg = (addClient_Pass_Type *)called_arg;
	if(write(my_arg->s, START_STRING, strlen(START_STRING)) == -1) {
		printf("Thrd(%x):START SEND ERROR\n",pthread_self());
		pthread_exit(NULL);
	}
	pthread_mutex_lock(&count_lock);
	// 새로운 클라이언트를 위한 소켓 저장할 index
	for(i = 0; i< MAX_CHAT - 1;i++) {
		if(clisock_list[i] != -1) continue;	
		else {
			new_index = i;
			clisock_list[new_index] =my_arg->s;
			break;
		}
	} // for
	if(i == MAX_CHAT ) {
		printf("Full Nbr of Chats\n");
		pthread_exit(NULL);
	}
	sock_map[new_index].thid = pthread_self();
   		
	inet_ntop(AF_INET,&(my_arg->cliaddr.sin_addr),
		  sock_map[new_index].ip_addr,
	          sizeof(sock_map[new_index].ip_addr));
	sprintf(sock_map[new_index].port , "%d", 
		ntohs(my_arg->cliaddr.sin_port));
	printf("새로운 접속 알림: ID: %s : [%x:(sock:%d)]: [%s:%s]\n", 
		my_arg->User->user.id,sock_map[new_index].thid, my_arg->s, sock_map[new_index].ip_addr, sock_map[new_index].port);

	strncpy(tbuf,my_arg->User->user.id,strlen(my_arg->User->user.id));
	strcat(tbuf,":");
	
	strcpy(cli_ip, inet_ntoa(my_arg->cliaddr.sin_addr));
	sprintf(cli_port,"%d",ntohs(my_arg->cliaddr.sin_port));

	strcat(cli_ip,": [");
	strcat(cli_port,"] ");
	strcat(cli_ip, cli_port);
	
	strcat(tbuf,cli_ip);
	strcat(tbuf,"님이 로그인 했습니다!\n");
	
	// 새로운 클라이언트를 모든 클라이언트에게 알림
	for(i=0;i<10;i++){
		if(chat_room_num[i] ==0)
			break;
	}
	n = i;
	for(i=0;i<MAX_CHAT-1 ;i++){						//채팅 참가중인 클라이언트에게는 전체 채팅이 보내지지 않음.
		c = 0;
		if(num_chat == 0) break;
		for(j=0;j<n; j++){
			c = 0;
			for(k=0;k<room[j]->c_num; k++){
				if(clisock_list[i] == my_arg->s || clisock_list[i] == -1 || clisock_list[i] == room[j]->clies[k]->s){
						c ++;
						continue;
					}
					if(c != 0)
						continue;
				}
			}
			if(clisock_list[i] == -1)
				c ++;
			if(c == 0){

				if(write(clisock_list[i],tbuf,MAX_BUFSZ)<=0){
					perror("write error");
					pthread_exit(NULL);
				}
			}
	} // for

	num_chat++;
	pthread_mutex_unlock(&count_lock);
	recv_and_send(my_arg->s,my_arg);
} // addClient()

void recv_and_send(int sock, addClient_Pass_Type *my_arg)
{
	int i, n, alen, tlen,j,k, c,status;
	pthread_t tid;
	pthread_t tid_group[10];
	
	char buf[MAX_BUFSZ];
	char tbuf[MAX_BUFSZ];
	char whisper[10];
	char wbuf[MAX_BUFSZ];
	char abuf[MAX_BUFSZ];
	char ws[20];
	char wmsg[MAX_BUFSZ];
	char cli_ip[40];
	char cli_port[10];
	char cbuf[MAX_BUFSZ];
	char *nbuf;
	void * ret;
	int nbyte;
	char bbuf[MAX_BUFSZ];
	int pcount=0;

	bthread * bUser;
	bUser = (bthread *)malloc(sizeof(bthread));
	bUser->User = (user_d *)malloc(sizeof(user_d));
	
	strcpy(cli_ip, inet_ntoa(my_arg->cliaddr.sin_addr));
	sprintf(cli_port,"%d",ntohs(my_arg->cliaddr.sin_port));

	strcat(cli_ip,": [");
	strcat(cli_port,"] ");
	strcat(cli_ip, cli_port);
	

	memset(buf,0,MAX_BUFSZ); // buf 비움
	memset(tbuf,0,MAX_BUFSZ);
	memset(abuf,0,MAX_BUFSZ);
	memset(cbuf,0,MAX_BUFSZ);
	memset(bbuf,0,MAX_BUFSZ);

	while(n = read(sock,buf,MAX_BUFSZ) > 0){
		//종료문자처리
		strncpy(abuf,buf,MAX_BUFSZ); //strtok함수는 원래 메세지를 바꿔서 abuf에 값 복사

		if(strcmp(buf,EXIT_STRING) == 0){			//아얘 같을 때만 성립
			removeClient(sock,my_arg);
			free(my_arg->User);
			free(my_arg);
			continue;
		}
		else if(strstr(abuf,CHAT_CHECK)){		// 채팅방에 참가한 클라이언트 끼리의 대화
			nbuf = strtok(abuf,"\t");
			memset(cbuf,0,sizeof(buf));
			nbuf = strtok(NULL,"\t");

			strcpy(cbuf, nbuf);
			nbuf = strtok(NULL,"\t");
			
			memset(tbuf,0,sizeof(tbuf));
			strcpy(tbuf, nbuf);

			memset(abuf, 0, sizeof(abuf));
			strcat(abuf,cli_ip);
			strncat(abuf,my_arg->User->user.id,strlen(my_arg->User->user.id));
			strcat(abuf,": ");
			strcat(abuf,tbuf);
			strcat(cbuf,"\t");
			strcat(cbuf,abuf);
			strcat(cbuf,"\t");

			if(!strcmp(tbuf, "quit\n")){				//채팅방 나갔을 시 초기화 과정
				//for(i =0; i<room[atoi(cbuf)-1]->c_num;i++){
				for(i =0; i<5;i++){
					if(!room[atoi(cbuf)-1]->clies[i]){
						continue;	
					}
					if(room[atoi(cbuf)-1]->clies[i]->s == sock){
						printf("%d 번 채팅방에서 ID: %s, IP: %s , Port: %d의 클라이언트가 퇴장하였습니다.\n",atoi(cbuf), room[atoi(cbuf)-1]->clies[i]->User->user.id, inet_ntoa(room[atoi(cbuf)-1]->clies[i]->cliaddr.sin_addr), ntohs(room[atoi(cbuf)-1]->clies[i]->cliaddr.sin_port));
						break;
					}
				}
				room[atoi(cbuf)-1]->c_num --;
				room[atoi(cbuf)-1]->clies[i]->in_chat = 0;
				chat_room_num[atoi(cbuf) -1] --;
				room[atoi(cbuf)-1]->clies[i] = (addClient_Pass_Type *) 0;
				if(room[atoi(cbuf)-1]->c_num == 0){
					memset(room[atoi(cbuf)-1],0, sizeof(room[atoi(cbuf)-1]));
					free(room[atoi(cbuf)-1]);
				}	
			}
			for(i =0; i<5;i++){			
				if(!room[atoi(cbuf)-1]->clies[i])
					continue;
				write(room[atoi(cbuf)-1]->clies[i]->s,cbuf,sizeof(cbuf));
		
			}
					
			memset(buf,0,MAX_BUFSZ); // buf 비움
			memset(tbuf,0,MAX_BUFSZ);
			memset(abuf,0,MAX_BUFSZ);
			memset(cbuf,0,MAX_BUFSZ);
		}
		else if(strstr(abuf,"whisper")){ // abuf에 whisper 값이 있는지 문자열 검색
			
			strcpy(whisper,strtok(abuf," "));
			strcpy(ws,strtok(NULL," "));
			strcpy(wmsg,strtok(NULL,"\n")); //strtok로 각 문자열 나눔
			
			for(j=0;j<MAX_CHAT -1 ;j++){
				if(!strcmp(ogUser[j].id,ws)){ //user.id가 같은 값이 있으면 실행
					strcat(tbuf,cli_ip);
					strcat(tbuf,my_arg->User->user.id);
					strcat(tbuf," whisper : ");
					strcat(tbuf,wmsg);
					write(ogUser[j].s,tbuf,MAX_BUFSZ);
					break;
				}
				if(j==MAX_CHAT-1){
					strcat(tbuf,"해당하는 사용자가 없거나 잘못된 귓속말 입니다. \n whisper [name] [msh]\n");
					write(sock,tbuf,MAX_BUFSZ);
					break;
				}

			}
			memset(ws,0,MAX_BUFSZ);
			memset(wmsg,0,MAX_BUFSZ);
			memset(tbuf,0,MAX_BUFSZ);
			memset(wbuf,0,MAX_BUFSZ);
			memset(buf,0,MAX_BUFSZ);
			memset(abuf,0,MAX_BUFSZ);
		}
		else if(!strcmp(buf,CHAT_STRING)){
			//스레드 생성 
			while(atoi(buf) != 4){
				ret = NULL;					// 스레드 리턴 값 void * 형
				if((nbyte =read(sock,buf,sizeof(buf))) > 0){
				switch(atoi(buf)){
					case 1:					// 채팅방 생성 스레드
						if((status = pthread_create(&tid, NULL, &chat_create,(void *)my_arg)) == -1){
						}
						pthread_join(tid, (void **)&ret);	//자료형 타입캐스팅
						if(ret){
							sprintf(cbuf,"Can't create more Chat_room\n");
							write(sock, cbuf, 511);
							memset(cbuf,0, MAX_BUFSZ);

						}
						break;
					case 2:
						if((status = pthread_create(&tid, NULL, &print_chat,(void *)my_arg)) == -1){
						}
						pthread_join(tid, (void **)&ret);
						if(ret){
							sprintf(cbuf,"NO\n");
							write(sock, cbuf, 511);
							memset(cbuf,0, MAX_BUFSZ);
						}
						break;
					case 3:
						if((status = pthread_create(&tid,NULL, &chat_plus,(void *)my_arg)) == -1){
						}
						pthread_join(tid, (void **)&ret);
						if(ret){
							sprintf(cbuf,"NO\n");
							write(sock, cbuf, 511);
							memset(cbuf,0, MAX_BUFSZ);
						}
						break;
					case 4:
						break;
					deafult: 
						break;
				}
				}
			}
			
		}

		else if(strstr(buf,BANN_STRING)){
			int bok=0;
			sprintf(bbuf,"----------------현재 접속한 사용자 목록 ---------------\n");
			for(i=0;i<MAX_CHAT-1;i++){
				if(ogUser[i].login ==1){
					strcat(bbuf,ogUser[i].id);
					strcat(bbuf,"\n");
				}
			}

			
			write(sock,bbuf,sizeof(bbuf));
			memset(bbuf,0,MAX_BUFSZ);
			
			pthread_mutex_lock(&count_lock);
			ban_user.startsock = sock;
			pthread_mutex_unlock(&count_lock);

			// 쓰레드 생성 사용자만큼
			for(i=0;i<MAX_CHAT-1;i++){	
				if(ogUser[i].login == 1){ // 로그인 된 사용자 찾기
					bthread * bUser;
					bUser = (bthread *)malloc(sizeof(bthread));
					bUser->User = (user_d *)malloc(sizeof(user_d));
					bUser->num = i; // 로그인 된 사용자 소켓번호
					strcpy(bUser->User->id,ogUser[i].id);
					strcpy(bUser->User->pw,ogUser[i].pw);
					bUser->User->login = ogUser[i].login;
					bUser->User->s = ogUser[i].s;
					bUser->User->bann = ogUser[i].bann;
			//여기서 break point
					if((status = pthread_create(&tid,NULL,&bann_user,(void *)bUser))!=0){
					}
					//pthread_join(tid, NULL);
					pcount++;
				}
			}
			//for(i=0;i<pcount;i++){
			//}


			while(bok ==1){
				int count=0;
				for(i=0;i<MAX_CHAT-1;i++){//전부검사
					if(ogUser[i].bann==1)
						count++; // 만약에 0있으면 나가기 1인상태 그대로
					if(pcount == count)
						bok=0; // 만약에 모두 1이면 bok = 0
				}
				if(bok==0)	break;
				//딜레이
				sleep(2);
			}
			// 2초마다 투표가 완료가 되었는지 확인
			

			//if(퇴장 투표가 과반수인지 확인)
			if(ban_user.agree_num>=(num_chat/2)){ // 투표 배열
				//값이 있으면 강퇴
				removeBannClient(ban_user.bsock);
			}else{
				sprintf(buf,"강퇴 투표가 부결되었습니다.\n");
				for(i=0;i<MAX_CHAT;i++){
					if(ogUser[i].login == 1){
						write(ogUser[i].s,buf,sizeof(buf));
					}
				}
			
				memset(buf,0,sizeof(buf));
			}

			// 투표 배열도 초기화
			//끝내기 전에 ogUser 투표 값 다시 0으로 만들어줘야 한다.
			pthread_mutex_lock(&count_lock);
			// 투표 수 배열 초기화
			memset(ban_user.bid,0,sizeof(ban_user));
			ban_user.bsock=0;
			ban_user.agree_num =0;
			// ogUser.bann 변수 0으로 memset;
			for(i=0;i<MAX_CHAT-1;i++){
				ogUser[i].bann = 0;
			}

			pthread_mutex_unlock(&count_lock);
		}	
		else{				// 보내는 구문
			strcat(tbuf,cli_ip);
			strncat(tbuf,my_arg->User->user.id,strlen(my_arg->User->user.id));
			strcat(tbuf,":");
			strcat(tbuf,buf); // user id만 보내도록 buf 수정 6/8
			for(i=0;i<10;i++){
				if(chat_room_num[i] ==0)
					break;
			}
			n = i;
			for(i=0;i<MAX_CHAT-1;i++){
				c= 0;
				for(j=0;j<n; j++){
					c = 0;
					for(k=0;k<room[j]->c_num; k++){
						if(clisock_list[i] == -1 || clisock_list[i] == room[j]->clies[k]->s){
							c ++;
							continue;
						}
						if(c != 0)
							continue;
					}
				}
				if(clisock_list[i] == -1)
					c ++;
				if(c == 0){

					if(write(clisock_list[i],tbuf,MAX_BUFSZ)<=0){
						perror("write error");
						pthread_exit(NULL);
					}
				}
			} // for
			memset(tbuf,0,MAX_BUFSZ); // write후 버퍼 비움
			memset(buf,0,MAX_BUFSZ);
		}
	}  // while
} //recv_and_send()

void * print_chat(void * called_arg){			//값을 받아오기만 하는 쓰레드 . 뮤텍스 사용하지 않음.
	char buf[511];
	char nbuf[511];
	memset(buf,0,sizeof(buf));
	memset(nbuf,0,sizeof(buf));
	int i, num = 0;

	addClient_Pass_Type *cli;
	cli = (addClient_Pass_Type *) called_arg;
	if(chat_room_num[0] == 0)					//채팅방 없을시 스레드 종료
		pthread_exit((void *) -1);
	for(i = 0; i<10; i++){
		if(chat_room_num[i] ==0)
			break;
		else
			num ++;
	}
	sprintf(buf,"%d",num);
	
	write(cli->s, buf, sizeof(buf));
	memset(buf,0,sizeof(buf));
	
	for(i = 0; i< num; i++){					//채팅방 정보 보내주기
		
		strcpy(nbuf, room[i]->c_name);
		sprintf(buf,"%d",room[i]->c_num);
		strcat(nbuf,"\t");
		strcat(nbuf, buf);
		write(cli->s, nbuf, sizeof(buf));
		memset(buf,0,sizeof(buf));
		memset(nbuf,0,sizeof(buf));
		
	}
	pthread_exit(NULL);

}

void * chat_plus(void *called_arg){
	char buf[MAX_BUFSZ];
	int i, num = 0;

	addClient_Pass_Type *cli;
	cli = (addClient_Pass_Type *) called_arg;

	read(cli->s, buf, sizeof(buf));
	if(chat_room_num[atoi(buf) -1] == 0 || chat_room_num[atoi(buf) -1] == 5 || cli->in_chat == 1)
		pthread_exit((void *) -1);
	
	num = atoi(buf) -1;
	pthread_mutex_lock(&count_lock);
	
	chat_room_num[num]++;
	room[num]->c_num++;
	room[num]->clies[room[num]->c_num -1] = cli;
	cli ->in_chat = 1;
	
	sprintf(buf,"%d",room[num] -> c_num);
	strcat(buf, "\t");
	strcat(buf, room[num]->c_name);
	strcat(buf, "\t");
	write(cli->s, buf, sizeof(buf));
		
	
	pthread_mutex_unlock(&count_lock);
	
}

void * chat_create(void * called_arg){
	int i, num = 0;
	int check = 0;
	int nbyte;
	char buf[511];
	addClient_Pass_Type *cli;
	
	cli = (addClient_Pass_Type *) called_arg;
	
	pthread_mutex_lock(&count_lock);
	
	for(i=0;i<10;i++){								//채팅방은 최대 열개까지 가능.
		if(chat_room_num[i] == 0){
			chat_room_num[i]++;
			check ++;
			break;
		}
	}
	if(check == 0 || cli->in_chat == 1){
		pthread_mutex_unlock(&count_lock);
		pthread_exit((void*) -1);
	}
	else{
		sprintf(buf,"Chat_room %d Created", i+1);
		cli->in_chat = 1;
		send(cli->s, buf, sizeof(buf), 0);
		memset(buf,0,sizeof(buf));
		room[i] = (Chat_Room *)malloc(sizeof(Chat_Room));
		if((nbyte = recv(cli->s, buf, sizeof(buf), MSG_WAITALL))>0){	// buf만큼의 값이 넘어올때까지 기다리기
			strcpy(room[i]->c_name,buf);
			room[i]->c_num++;
			room[i]->clies[0] = cli;
			memset(buf,0,sizeof(buf));
			sprintf(buf, "%d", i+1);
			send(cli->s, buf, sizeof(buf),0);
			pthread_mutex_unlock(&count_lock);
			printf("%d 번 채팅방에 ID: %s, IP: %s , Port: %d의 클라이언트가 참가하였습니다.\n",i+1, cli->User->user.id, inet_ntoa(cli->cliaddr.sin_addr), ntohs(cli->cliaddr.sin_port));
		}
	}
	pthread_exit(NULL);

	

}

void * bann_user (void * called_arg){
	char value[100];
	char bbuf[MAX_BUFSZ];
	char bannuser[MAX_BUFSZ];
	int i;
	int nbyte = 0;
	bthread * user;
	user = (bthread *) called_arg;
	
	memset(bbuf,0,sizeof(bbuf));
	
	pthread_mutex_lock(&count_lock);
	sprintf(bbuf,"vote");
	//sprintf(bbuf,"%s 퇴장 대한 투표가 시작되었습니다.\n",ban_user.bid);
	//strcat(bbuf," 찬성시 : 1입력 / 반대 시 : 2입력\n");
	while(bok==0){
		write(ban_user.startsock,bbuf,sizeof(bbuf));
		//strcat(bbuf,"\n퇴장 투표 할 사용자를 입력하시오 : ");//처음 bann 메세지 해당 소켓에 보내주도록 buf
		nbyte=read(ban_user.startsock,bannuser,sizeof(bannuser));
			for(i=0;i<MAX_CHAT-1;i++){
				if(!strcmp(bannuser,ogUser[i].id)){ // 걸리지 않음
					bok = 1;
				//	write(ban_user.startsock,"OK",MAX_BUFSZ);
					ban_user.bsock = ogUser[i].s;
					ban_user.agree_num = 0;
					strcpy(ban_user.bid,ogUser[i].id);
				}
			}// 처음 강퇴하는 사람 처리
			/*
			if(bok==0){
				memset(bbuf,0,sizeof(bbuf));
				sprintf(bbuf,"접속 한 사용자 목록을 입력하시오 \n");
				write(ban_user.startsock,"NO",MAX_BUFSZ);
				memset(bbuf,0,sizeof(bbuf));
			}
			*/
	}
		if(bok==2){
			memset(bbuf,0,sizeof(bbuf));
			sprintf(bbuf,"ban");
			
			write(user->User->s,bbuf,sizeof(bbuf));
			read(user->User->s,value,sizeof(value)); // startsock일 때
			memset(value,0,sizeof(value));
			write(user->User->s, ban_user.bid, 20);
			read(user->User->s, value,sizeof(value));
		}

		if(bok==1){
			read(ban_user.startsock,value,sizeof(value)); // startsock일 때
			memset(value,0,sizeof(value));
			write(ban_user.startsock, ban_user.bid, 20);
			read(ban_user.startsock, value,sizeof(value));
			bok++;
		}
	//뮤텍스 이용
	if(atoi(value) == 1){
		//값 받으면 투표 구조체 찬성 수 +1
		ban_user.agree_num++;
	}
	//oguser 1값으로 바꾸기
	ogUser[user->num].bann = 1;
	//뮤텍스 끄기
	pthread_mutex_unlock(&count_lock);

	pthread_exit(NULL);
}
void removeClient(int s,addClient_Pass_Type * my)
{
	char removebuf[100];
	char s1[10];
	int j, i=0;
	strncpy(removebuf,my->User->user.id,strlen(my->User->user.id));
	strcat(removebuf,":");
	strcat(removebuf,"님이 로그아웃 하였습니다. 현재 참가자 수 =");
	sprintf(s1,"%d",num_chat-1); // mutex로 값 수정 이전에 버퍼 값 만듬 6/8
	strcat(removebuf,s1);

	printf("\n%s\n",removebuf);
	
	for(j=0;j<MAX_CHAT-1;j++){
		if(clisock_list[j] == my->s || clisock_list[j] == -1)
				continue;

		if(write(clisock_list[j],removebuf,MAX_BUFSZ)<=0){
			perror("write error");
			pthread_exit(NULL);
		}
	} // 종료되었다고 보냄
	
	
	
	pthread_mutex_lock(&count_lock);
	
	close(s);
	for(i=0;i<MAX_CHAT- 1;i++){
		if(clisock_list[i] == s)
			clisock_list[i] = -1;
			sock_map[i].thid = 0;
			bzero(sock_map[i].ip_addr, sizeof(sock_map[i].ip_addr));
			bzero(sock_map[i].port, sizeof(sock_map[i].port));
	}
	read_userdb();
	num_chat--;
	pthread_mutex_unlock(&count_lock);
}

void read_userdb(){							//기존 데이터 파일에서 받아오기 -> 구조체 생성

	FILE *fp; //fp 파일포인터.

	fp = fopen("user.txt","r");
	char buffer[20];
	int z = 0;
	
	printf("\n------ 현재 회원 정보 ------\n");
	while(fgets(buffer,sizeof(buffer),fp) ){
		strcpy(ogUser[z].id,strtok(buffer,"\t"));
		strcpy(ogUser[z].pw,strtok(NULL,"\n"));	
		printf("%d번 회원 %s\t",z+1,ogUser[z].id);
		printf("%s\n",ogUser[z].pw);
		ogUser[z].login = 0;
		z++;
	}
	printf("----------------------------\n");
	fclose(fp); 
	
}

void saveUser(user_d * member){ // 회원가입 한 user 정보 파일에 write
	FILE * fp; // fp 파일포인터.
	char savebuf[MAX_BUFSZ];
	strncpy(savebuf,member->id,sizeof(member->id));
	strcat(savebuf,"\t");
	strcat(savebuf,member->pw);
	strcat(savebuf,"\n");

	fp = fopen("user.txt","a");
	
	fputs(savebuf,fp);
	fclose(fp);
	
	read_userdb();

}

void removeBannClient(int s){
	char removebuf[100];
	char s1[10];
	int j,i=0;
	pthread_mutex_lock(&count_lock);
	memset(removebuf,0,sizeof(removebuf));
	sprintf(removebuf,"%s 님이 추방되었습니다. \n",ban_user.bid);
	sprintf(s1,"%d",num_chat-1);

	printf("\n%s\n",removebuf);

	for(j=0;j<MAX_CHAT-1;j++){
		if(ogUser[i].login==1){
			write(ogUser[i].s,removebuf,sizeof(removebuf));
		}
	}//종료 메세지 전송

	pthread_mutex_lock(&count_lock);

	close(ban_user.bsock);
	
	for(i=0;i<MAX_CHAT-1;i++){
		if(clisock_list[i]==ban_user.bsock)
			clisock_list[i]=-1;
			sock_map[i].thid=0;
			bzero(sock_map[i].ip_addr,sizeof(sock_map[i].ip_addr));
			bzero(sock_map[i].port,sizeof(sock_map[i].port));
	}
	read_userdb();
	num_chat--;
	pthread_mutex_unlock(&count_lock);
}





























