import {User} from './User';
import {Comment} from './Comment';
import {Room} from "./Room";


export class Message {
  messageId!: number;
  room!: Room;
  messageOwner!: User;
  messageText!:string;

}
