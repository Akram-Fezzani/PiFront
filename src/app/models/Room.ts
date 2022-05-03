import { Message } from "./Message";
import {User} from "./User";

export class Room {
  roomId!: number;
  subject!: string;
  messages!: Message[];
  users!:User[];
  ownerId!:number;
  joined:boolean = false;
}
