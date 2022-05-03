import {Post} from './Post';
import {Comment} from './Comment';
import {Message} from './Message';
import {Room} from "./Room";
export class User {
    id!: number;
    username!: string;
    email!: string;
    password!:string;
    firstName!:string;
    lastName!:string;
    phone!:number;
    rate!:number;
    state!:boolean;
    listPosts!:Post[];
    listComments!:Comment[];
    listMessages!:Message[];
    joinedRooms!:Room[];
}
