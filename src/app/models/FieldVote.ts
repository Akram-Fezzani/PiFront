import {Post} from "./Post";
import {PostPoll} from "./PostPoll";
import {PollField} from "./PollField";
import {User} from "./User";


export class FieldVote {
    pollFieldId!:number;
    voteField!:PollField;
    userVote!:User;
}
