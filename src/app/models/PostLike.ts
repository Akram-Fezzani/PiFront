import {User} from './User';
import {Post} from './Post';

export class PostLike {
    postLikeId!:number;
    likePost!:Post;
    typeLike!:string;
    likeOwner!:User;
}
