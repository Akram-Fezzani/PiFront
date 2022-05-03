import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/User";
import {AppComponent} from "../../app.component";
import {RoomService} from "../../services/room/room.service";
import {Room} from "../../models/Room";
import {error} from "protractor";
import {WebsocketService} from "../../services/websocket/websocket.service";
import {ChatMessage} from "../../models/ChatMessage";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {Howl} from 'howler';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  notifSound = new Howl({
    src: ['assets\\sounds\\notifSound.mp3']
  });
  colors: any[] = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  @ViewChild("messageArea", { static: false }) messageArea!: ElementRef;

  currentUser: User = AppComponent.instance.getCurrentUser();
  roomList: Room[] = [];
  loadingRooms: boolean = true;
  ownedRooms: Room[] = [];
  addNewRoom: boolean = false;
  private creatingRoom: boolean = false;
  currentChatRoom!: Room;
  messages: ChatMessage[] = [];
  private sendMsgWithClick: boolean = false;
  searchText: any;
  playNotif: boolean= true;
  constructor(private toastr: ToastrService, private dialog: MatDialog,private chatRoomService: RoomService, private websocketService: WebsocketService) {
    this.websocketService.sideBarComp.subscribe((message:ChatMessage) => {
      this.reloadFromWebSocket(message);
    });
  }
  getAvatarColor(messageSender:string):string {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    let index = Math.abs(hash % this.colors.length);
    return this.colors[index];
  }
  removeRoom(room:Room, list:Room[]) {
    list.splice(list.indexOf(room),1);

  }
  reloadFromWebSocket(message:ChatMessage) {
    console.log(message.type, message.requestedBy);
    if(message.type == "REFRESH" && message.requestedBy != this.currentUser.id) {
      return;
    } else {
      if(message.senderId != this.currentUser.id) {
        if(this.playNotif && message.type == "CHAT") {
        this.notifSound.play();
        }
      }
      this.messages.push(message);

    }
    if(this.messageArea != null)
    setTimeout(() => {
      this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
    },10)
    if(message.type == "DESTROYED") {
      setTimeout(() => {
        this.removeRoom(this.currentChatRoom, this.roomList);
        this.removeRoom(this.currentChatRoom, this.ownedRooms);
        this.removeRoom(this.currentChatRoom, this.currentUser.joinedRooms);
        // @ts-ignore
        this.currentChatRoom = null;
        this.messages = [];

        this.toastr.info("Chatroom destroyed by owner", "Chatroom destroyed");
      },500)
    }
  }
  ngOnInit(): void {
    console.log(this.currentUser.joinedRooms);
    this.chatRoomService.getChatrooms().subscribe((r: Room[]) => {
        if(this.currentUser.joinedRooms.length >0) {
          let ids = [];
          for( let room of this.currentUser.joinedRooms){
            ids.push(room.roomId);
            if(room.ownerId == this.currentUser.id) {
              this.currentUser.joinedRooms.splice(this.currentUser.joinedRooms.indexOf(room),1);
              this.ownedRooms.push(room);
            }
          }
      for(let room of r) {
        if(ids.indexOf(room.roomId) <0) {
          this.roomList.push(room);
        }
      }
      } else{
        this.roomList = r;
      }
      setTimeout(()=>{
        this.loadingRooms = false;
      },2000);
    }, error => console.log(error));
  }
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: Event) {
    if(window.scrollY >100) {
      if(document.getElementById("sidebarContainer") != null)
        // @ts-ignore
      document.getElementById("sidebarContainer").classList.add("toggled");
      if(document.getElementById("chat-page") != null)
      // @ts-ignore
      document.getElementById("chat-page").style.left = "18%";
    } else{

      if(document.getElementById("sidebarContainer") != null)
      // @ts-ignore
      document.getElementById("sidebarContainer").classList.remove("toggled");

      if(document.getElementById("chat-page") != null)
        // @ts-ignore
      document.getElementById("chat-page").style.left = "5%";
    }
  }

  clearAddInput() {
    this.addNewRoom = false;
    // @ts-ignore
    document.getElementById("addRoomInput").value = "";
    this.creatingRoom = false;
  }

  addChatRoom(event: KeyboardEvent) {
    if(this.creatingRoom) {
      return
    }
    if(event.key == "Enter") {
    this.creatingRoom = true;
      // @ts-ignore
      if(document.getElementById("addRoomInput").value.length > 0) {
        // @ts-ignore
        this.chatRoomService.add(document.getElementById("addRoomInput").value, this.currentUser.id).subscribe((room: Room) => {

          this.ownedRooms.unshift(room);
          this.clearAddInput()
        }, error => console.log(error));
      }
    }
  }

  destroyRoom(room: Room) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '600px',
      height: '100',
      data: ['chatroom']
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        let msg = new ChatMessage();
        msg.senderId = this.currentUser.id;
        msg.roomId = room.roomId;
        msg.type = "DESTROYED";
        this.websocketService._destroyRoom(msg,room.roomId);
          this.removeRoom(room, this.ownedRooms);
          if(this.currentChatRoom == room) {
            // @ts-ignore
            this.currentChatRoom = null;
            this.messages = [];
          }

      }
    });

  }

  leave(room: Room) {

    let msg = new ChatMessage();
    msg.sender = this.currentUser.firstName+" "+this.currentUser.lastName;
    msg.senderId = this.currentUser.id;
    msg.roomId = room.roomId;
    msg.type = "LEAVE";
    this.websocketService._leave(msg,room.roomId);
    this.currentUser.joinedRooms.splice(this.currentUser.joinedRooms.indexOf(room), 1);
    if(room == this.currentChatRoom) {
      this.messages = [];
      // @ts-ignore
      this.currentChatRoom = null;
    }
    if(room.ownerId != this.currentUser.id) {
      this.roomList.push(room);
    } else {
      this.ownedRooms.push(room);
    }
  }

  joinRoom(room: Room, sender: number) {
    if(this.currentChatRoom != room) {
      this.messages = [];
      this.websocketService._disconnect();
      let msg = new ChatMessage();
      msg.sender = this.currentUser.firstName+" "+this.currentUser.lastName;
      msg.senderId = this.currentUser.id;
      msg.roomId = room.roomId;
      msg.requestedBy = this.currentUser.id;
      msg.type = "JOIN";
    this.websocketService._connect(room.roomId, msg, 1);
    if(sender == 1) {
      this.roomList.splice(this.roomList.indexOf(room), 1);
      this.currentUser.joinedRooms.unshift(room);
    }
    this.currentChatRoom = room;
    } else{
      if(this.currentChatRoom != null ){
        this.closeRoom();
      }
    }
  }

  sendMessageWithClick($event:Event) {
    this.sendMsgWithClick = true;
    // @ts-ignore
    this.sendMessage($event);
  }
  sendMessage($event:Event) {
    // @ts-ignore
    if($event.key == "Enter" || this.sendMsgWithClick) {
      this.sendMsgWithClick = false;
      // @ts-ignore
      if(document.getElementById("messageInput").value.length > 0) {
        let ch = new ChatMessage();
        ch.senderId = this.currentUser.id;
        ch.sender = this.currentUser.firstName+" "+this.currentUser.lastName;
        ch.roomId = this.currentChatRoom.roomId;
        ch.roomId = this.currentChatRoom.roomId;
        ch.type = "CHAT";
        // @ts-ignore
        ch.content = document.getElementById("messageInput").value;
        this.websocketService._send(ch,this.currentChatRoom.roomId);
        // @ts-ignore
        document.getElementById("messageInput").value = "";
      }
    }
  }

  closeRoom() {
    this.messages = [];
    this.websocketService._disconnect();
    // @ts-ignore
    this.currentChatRoom = null;
  }
}
