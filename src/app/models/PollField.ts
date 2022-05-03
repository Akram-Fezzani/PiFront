import {Post} from "./Post";
import {PostPoll} from "./PostPoll";
import {FieldVote} from "./FieldVote";


export class PollField {
  pollFieldId!:number;
  postPoll!:PostPoll;
  field!:string;
  votes!:FieldVote[];
  votesCount!:number;
  vote!:any;
  votedByCurrentUser!: boolean;
}
