import {User} from './User';
import {Comment} from './Comment';
import {PostLike} from './PostLike';
import {PostPoll} from "./PostPoll";
import {PostFile} from "./PostFile";


export class Post {
    postId!:number;
    postDate!:Date;
    postTitle!:string;
    poll!:PostPoll;
    postContent!:string;
    postFiles!:PostFile[];
    postOwner!:User;
    listComments!: Comment[];
    listPostLikes!:PostLike[];
    commentsFilterType!:string;
    numberOfLikes!:number;
    likesCount!:number;
    dislikesCount!:number;
    likedByCurrentUser!:string;
    showCommentsSection!: boolean;
}
