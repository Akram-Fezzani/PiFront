import {User} from './User';
import {Post} from './Post';
import {CommentReact} from './CommentReact';

export class Comment {
    showReactions!:boolean
    commentId!:number;
    commentDate!:Date;
    commentText!:string;
    commentOwner!:User;
    currentReact!: string;
    likeCount!:number;
    heartCount!:number;
    laughCount!:number;
    wowCount!:number;
    firstReact!:string;
    secondReact!:string;
    thirdReact!:string;
    cryCount!:number;
    angryCount!:number;
    commentPost!:Post;
    dontLeave!: boolean;
    listCommentReacts!:CommentReact[];
}
