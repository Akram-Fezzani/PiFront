import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {Comment} from "../../models/Comment";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PostService} from "../../services/post/post.service";
import {PostComponent} from "../post/post.component";
import {ToastrService} from "ngx-toastr";
import {PollField} from "../../models/PollField";
import {PostPoll} from "../../models/PostPoll";
import {FieldVote} from "../../models/FieldVote";
import {FieldVoteService} from "../../services/fieldVote/field-vote.service";
import {PostLike} from "../../models/PostLike";
import {PostLikeService} from "../../services/postLike/post-like.service";
import {CommentService} from "../../services/comment/comment.service";
import {CommentReact} from "../../models/CommentReact";
import {CommentReactService} from "../../services/commentReact/comment-react.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({

  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        style({ height: 0 }),
        animate('100ms', style({ opacity: 1 })),
        animate('100ms', style({ height: 50 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('interFromBottomTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        style({ height: 0 }),
        style( {marginTop: 60}),
        animate('100ms', style({ opacity: 1 })),
        animate('100ms', style({ height: 50 })),
        animate('100ms', style({ marginTop: 0 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ marginTop: 60})),
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('shrinkAndLeave', [
      transition(':enter', [
        style({ opacity: 0 }),
        style({ marginTop: 100 }),
        animate('100ms', style({ opacity: 0.8 })),
        animate('100ms', style({ marginTop: 0 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('rotatedState', [
      transition(':enter', [
        style({ opacity: 0 }),
        style({ transform: 'rotate(-90deg)' }),
        animate('100ms', style({ opacity: 1 })),
        animate('300ms', style({ transform: 'rotate(0)' }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 })),
      ])
    ]),
    trigger('enterSlow', [
      transition(':enter', [
        style({ display: 'none' }),
        animate('200ms', style({ display: 'inherit' }))
      ])
    ]),
    trigger('enterAnimation', [
      transition(':enter', [
        style({ width: 0 }),
        animate('200ms', style({ width: 200 }))
      ])
    ]), trigger('enterHeight', [
      transition(':enter', [
        style({ opacity: 0 }),
        style({ marginTop: 200 }),
        animate('100ms', style({ opacity: 1 })),
        animate('100ms', style({ marginTop: 0 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 })),
        animate('100ms', style({ marginTop: 200 }))
      ])
    ]),
  ],
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  savingComment!: boolean;
  reacting!: boolean;
  timeout:any;
  @Input() currentUser!: User;
  @Input() post!: Post;
  disabledLikebuttons!:boolean;
  voting: boolean = false;
  comments!: Comment[];
  commentsLoading!: boolean;
  constructor(private commentReactService: CommentReactService, private commentService: CommentService,private postLikeService: PostLikeService, private fieldVoteService: FieldVoteService ,private dialog: MatDialog,private postService: PostService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.post.showCommentsSection = true;
    this.post.commentsFilterType = "newest";
    this.commentsLoading = true;
    if (this.post.postFiles == null) {
      this.post.postFiles = [];
    }
    this.loadCommentsForPost(this.post.commentsFilterType);
  }

  deletePost() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '600px',
      height: '100',
      data: ['post']
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.postService.deletePost(this.post.postId).subscribe(() => {
          if(PostComponent.instance != null) {
            PostComponent.instance.posts.splice(PostComponent.instance.posts.indexOf(this.post), 1)
          }
          this.toastr.success("Post deleted successfully", "Delete");
        }, error => console.log(error));
      }
    });
  }


  updatePost() {
    PostComponent.instance.postToEdit = this.post;
    if (this.post.poll == null) {
      PostComponent.instance.createPoll = false;
    } else {
      PostComponent.instance.createPoll = true;
    }
    PostComponent.instance.showAddPost = true;
  }


  voteField(field: PollField, poll: PostPoll) {
    if (this.voting) {
      return;
    }
    this.voting = true;

    if(field.votes == null) {
      field.votes = [];
      field.votedByCurrentUser = false;
    }
    if(field.votedByCurrentUser) {
      this.removeVote(field, poll, null, null);
    } else {
      let vote = new FieldVote();
      vote.userVote = this.currentUser;
      vote.voteField = field;
      console.log(vote);
      this.fieldVoteService.updateVotePoll(vote).subscribe((v: FieldVote)=> {
        if(poll.votedField != null ){
          this.removeVote(poll.votedField, poll, v, field);
        } else{
          poll.votedField = field;
          poll.voteCount++;
          field.votes.push(v);
          field.vote = v;
          field.votedByCurrentUser = true;
          this.voting = false;
        }
      }, error => {console.log(error)});
    }
  }

  removeVote(field: PollField, poll: PostPoll, vote: any, f:any) {
    this.fieldVoteService.removeVotePoll(this.currentUser.id, field.pollFieldId).subscribe(()=> {
      field.votedByCurrentUser = false;
      poll.votedField = null;
      poll.voteCount--;
      field.votes.splice(field.votes.indexOf(field.vote), 1);
      field.vote = null;
      if(vote !=null) {
        poll.votedField = f;
        poll.voteCount++;
        f.votes.push(vote);
        f.vote = vote;
        f.votedByCurrentUser = true;
      }
      this.voting = false;
    }, error => {console.log(error)});
  }


  likePost(post: Post, type: string) {
    if(this.disabledLikebuttons) {
      this.disabledLikebuttons = true;
      return;
    } else {

      this.disabledLikebuttons = true;
      if(post.likedByCurrentUser == type) {
        this.postLikeService.removeLikeFromPost(post.postId, this.currentUser.id).subscribe(r => {
          if(type == "UP"){
            post.likesCount--;
          } else {
            post.dislikesCount--;
          }

          setTimeout(() => {
            post.numberOfLikes = post.likesCount-post.dislikesCount;
            this.disabledLikebuttons = false;
          }, 100);
          post.likedByCurrentUser = "no";
        }, error => console.log(error));
      } else {
        let postLike = new PostLike();
        let p = new Post();
        p.postId = post.postId;
        postLike.likePost = p;
        postLike.likeOwner = this.currentUser;
        postLike.typeLike = type;
        this.postLikeService.addLikeToPost(postLike).subscribe(r => {
          if(post.likedByCurrentUser == "no"){
            if(type == "UP") {
              post.likesCount++;
            } else {
              post.dislikesCount++;
            }
          } else{
            if(type == "UP") {
              post.likesCount++
              post.dislikesCount--;
            } else {
              post.likesCount--;
              post.dislikesCount++
            }
          }
          post.likedByCurrentUser = type;
          setTimeout(() => {
            console.log(post.likesCount, post.dislikesCount);
            post.numberOfLikes = post.likesCount-post.dislikesCount;
            this.disabledLikebuttons = false;
          }, 100);
        }, error => console.log(error));
      }
    }

  }


  addComment(post: Post, $event: KeyboardEvent) {
    if(this.savingComment) {
      return;
    }
    if($event.key == "Enter"){

      // @ts-ignore
      if(document.getElementById("commentInput"+post.postId).value !="") {
        this.savingComment = true;
        let com= new Comment();
        let p = new Post();
        p.postId = post.postId;
        com.commentPost = p;
        com.commentOwner = this.currentUser;
        // @ts-ignore
        com.commentText = document.getElementById("commentInput"+post.postId).value;
        this.commentService.addCommnet(com).subscribe(r => {
          if(r != null) {
            com.listCommentReacts = [];
            com.dontLeave = false;
            com.showReactions = false;
            com.firstReact = "none";
            com.secondReact = "none";
            com.thirdReact = "none";
            com.likeCount = 0;
            com.heartCount = 0;
            com.laughCount = 0;
            com.wowCount = 0;
            com.cryCount = 0;
            com.angryCount = 0;
            com.currentReact = 'null';
            com.commentId = r.commentId;
            post.listComments.unshift(com);
            // @ts-ignore
            document.getElementById("commentInput"+post.postId).value = "";
          } else {
            this.toastr.warning("Please watch your language !", "Comment denied");
          }
          this.savingComment = false;
        }, error => console.log("error"));
      }
    }
  }

  filterComments(filter: string) {
    if(this.post.commentsFilterType == filter) {
      return;
    } else {
      this.loadCommentsForPost(filter)
      this.post.commentsFilterType = filter;
    }
  }

  getReadyToLeaveReactionsOutside(comment: Comment) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if(!comment.dontLeave) {
        this.leaveReactions(comment);
      }
    }, 700);

  }
  getReadyToLeaveReactionsInside(comment: Comment) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.leaveReactions(comment);
    }, 700);

  }
  leaveReactions(comment: Comment) {
    clearTimeout(this.timeout);
    comment.showReactions = false;
    comment.dontLeave = false
  }

  dontleaveReactions(comment: Comment) {
    clearTimeout(this.timeout);
    comment.dontLeave = true;
  }

  showReactions(comment: Comment) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      comment.showReactions = true;
    }, 500);

  }

  reactToComment(reactType: string, comment: Comment) {
    if(this.reacting) {

      this.reacting = true;
      return
    }

    if(reactType == comment.currentReact) {
      this.getReadyToLeaveReactionsInside(comment);
      return;
    }
    this.reacting = true;
    comment.currentReact = "wait";
    let react = new CommentReact()
    let com = new Comment();
    com.commentId = comment.commentId;
    react.reactComment = com;
    react.reactOwner = this.currentUser;
    react.typeReact = reactType;
    this.commentReactService.updateReact(react).subscribe(() => {
      this.setReactNumber(comment,react.typeReact, +1);
      this.removeReactionFromComment(comment);
      comment.listCommentReacts.push(react);
      comment.currentReact = reactType;
      this.getReadyToLeaveReactionsInside(comment);
      this.reacting = false;
    }, error => console.log(error));
  }

  parentButtonReact(comment: Comment) {
    clearTimeout(this.timeout);
    if(comment.currentReact == "null") {
      this.reactToComment("Like", comment);
      this.leaveReactions(comment);
    } else {
      this.commentReactService.removeReaction(comment.commentId, this.currentUser.id).subscribe(()=> {
        comment.currentReact = "null";
        this.removeReactionFromComment(comment);
        this.leaveReactions(comment);
      }, error => console.log(error));
    }
  }
  removeReactionFromComment(comment:Comment) {
    for(let react of comment.listCommentReacts) {
      if(react.reactOwner.id == this.currentUser.id) {
        this.setReactNumber(comment,react.typeReact, -1);
        comment.listCommentReacts.splice(comment.listCommentReacts.indexOf(react),1);
        break;
      }
    }
    this.setReactOrder(comment);
  }

  setReactNumber(comment: Comment, typeReact: string, x:number) {
    switch (typeReact){
      case "Like":comment.likeCount = comment.likeCount+x;break;
      case "Heart":comment.heartCount = comment.heartCount+x;break;
      case "Laugh":comment.laughCount = comment.laughCount+x;break;
      case "Wow":comment.wowCount = comment.wowCount+x;break;
      case "Cry":comment.cryCount = comment.cryCount+x;break;
      case "Angry":comment.angryCount = comment.angryCount+x;break;
    }
  }

  setReactOrder(com: Comment) {
    com.firstReact = "none";
    com.secondReact = "none";
    com.thirdReact = "none";
    let map = new Map<string,number>();
    if(com.likeCount >0) {
      map.set('Like', com.likeCount);
    }
    if(com.heartCount >0) {
      map.set('Heart', com.heartCount);
    }
    if(com.laughCount >0) {
      map.set('Laugh', com.laughCount);
    }
    if(com.wowCount >0) {
      map.set('Wow', com.wowCount);
    }
    if(com.cryCount >0) {
      map.set('Cry', com.cryCount);
    }
    if(com.angryCount >0) {
      map.set('Angry', com.angryCount);
    }
    // @ts-ignore
    map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    const [firstKey] = map.keys();
    com.firstReact = firstKey;
    map.delete(firstKey);
    const [secondKey] = map.keys();
    if(secondKey!=null) {
      com.secondReact = secondKey;
      map.delete(secondKey);
      const [thirdKey] = map.keys();
      if(thirdKey!=null) {
        com.thirdReact = thirdKey
      }
    }
  }

  loadCommentsForPost(filter:string) {
    this.commentsLoading = true;
    this.post.listComments = [];
    this.commentService.getAllByPostId(filter, this.post.postId).subscribe((data: Comment[]) => {
      this.comments = data;
      for(const com of this.comments) {
        com.showReactions = false;
        com.dontLeave = false;
        com.currentReact = "null";
        this.commentReactService.findReactByCommentId(com.commentId).subscribe((data: CommentReact[]) => {
          com.listCommentReacts = data;

          com.likeCount = 0;
          com.heartCount = 0;
          com.laughCount = 0;
          com.wowCount = 0;
          com.cryCount = 0;
          com.angryCount = 0;
          if (com.listCommentReacts.length != 0) {
            for(let react of com.listCommentReacts) {
              this.setReactNumber(com, react.typeReact, 1);
              if(react.reactOwner.id == this.currentUser.id) {
                com.currentReact = react.typeReact;
              }
            }
            this.setReactOrder(com);
          }
        },(error: any) => {
          console.log(error);
        });
      }
      // @ts-ignore
      this.post.listComments = this.comments;
      setTimeout(() => {
        this.commentsLoading = false;
      }, 1000);
    }, (error: any) => {
      console.log(error);
    });
  }
}
