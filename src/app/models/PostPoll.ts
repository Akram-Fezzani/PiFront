import {Post} from "./Post";
import {PollField} from "./PollField";


export class PostPoll {
    postPollId!:number;
    postPoll!:Post;
    voteCount!:number;
    votedField!:any;
    fields!:PollField[];
}
