import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {ChatbotService} from "../../services/chatbot/chatbot.service";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  messageForm:any = document.querySelector('#messageFormBot');
  messageInput:any = document.querySelector('#messageBot');
  userPage:any = document.querySelector('#userPageBot');
  chatPage:any = document.querySelector('#chat-pageBot');
  messageArea:any = document.querySelector('#messageAreaBot');
  colors: any[] = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];
  constructor(private chatBotService: ChatbotService) { }

  ngOnInit(): void {

    this.messageForm = document.querySelector('#messageFormBot');
    this.messageInput = document.querySelector('#messageBot');
    this.userPage = document.querySelector('#userPageBot');
    this.chatPage = document.querySelector('#chat-pageBot');
    this.messageArea = document.querySelector('#messageAreaBot');
    this.addMessage("Hello, how can i help you ?", 2);
  }

  sendMessage(event: any) {
    var messageContent = this.messageInput.value.trim();
    this.addMessage(messageContent, 1);
    this.chatBotService.search(messageContent).subscribe((r: any) =>{
        console.log(r);
        this.addMessage(r, 2);
      }, error => {
        alert("error");
    });
    this.messageInput.value = '';
    event.preventDefault();
  }
  addMessage(text:any, id:any) {

    var messageElement = document.createElement('li');
    let sender;
    if(id === 2) {
      sender = "Help Bot";
    } else {
      sender = AppComponent.instance.getCurrentUser().firstName+" "+AppComponent.instance.getCurrentUser().lastName;
    }
    messageElement.classList.add('chat-message');

    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(sender[0]);

    avatarElement.style["borderRadius"] = "200px";
    avatarElement.style["fontSize"] = "20px";
    avatarElement.style["margin"] = "10px";

    avatarElement.style["padding"] = "7px";
    avatarElement.style["paddingLeft"] = "12px";

    avatarElement.style["marginTop"] = "-10px";
    messageElement.style["marginTop"] = "20px";
    if(id === 1) {
      avatarElement.style["float"] = "right";
      avatarElement.style["width"] = "40px";
      avatarElement.style["height"] = "40px";
      avatarElement.style["position"] = "relative";
      avatarElement.style["textAlign"] = "left";
      // @ts-ignore
      messageElement.style["text-align"] = "right";
    } else {

      messageElement.style["marginLeft"] = "-40px";
      avatarElement.style["width"] = "40px";
      avatarElement.style["height"] = "40px";
      avatarElement.style["float"] = "left";
    }
    avatarElement.appendChild(avatarText);
    // @ts-ignore
    avatarElement.style['background-color'] = this.getAvatarColor(sender);

    messageElement.appendChild(avatarElement);

    var usernameElement = document.createElement('span');
    var usernameText = document.createTextNode(sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(text);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    this.messageArea.appendChild(messageElement);
    this.messageArea.scrollTop = this.messageArea.scrollHeight;
  }

  getAvatarColor(messageSender:string) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }

    let index = Math.abs(hash % this.colors.length);
    return this.colors[index];
  }

}
