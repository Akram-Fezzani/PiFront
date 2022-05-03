import {Component, HostListener, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {PostService} from "../../services/post/post.service";
import {CommentService} from "../../services/comment/comment.service";
import {ToastrService} from "ngx-toastr";
import {PostLike} from "../../models/PostLike";
import {PostLikeService} from "../../services/postLike/post-like.service";
import {AppComponent} from "../../app.component";
import {User} from "../../models/User";
import {Comment} from "../../models/Comment";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CommentReactService} from "../../services/commentReact/comment-react.service";
import {CommentReact} from "../../models/CommentReact";
import {PostPoll} from "../../models/PostPoll";
import {PollField} from "../../models/PollField";
import {FieldVoteService} from "../../services/fieldVote/field-vote.service";
import {FieldVote} from "../../models/FieldVote";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PostFile} from "../../models/PostFile";

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
    ])
  ],
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts!: Post[];
  offset:number =1;
  showSubToolTips: boolean = false;
  currentUser!:User;
  timeout:any;
  filterType:string = "newest";
  loadingData! : boolean;
  public static instance:PostComponent;
  showAddPost: boolean = false;
  clickedTheInside: boolean = false;
  showToolTip: boolean = false;
  showSearchBar: boolean = false;
  private isFiltered: boolean = false;
  refreshing: Boolean = false;
  secondaryLoading: boolean = false;
  noMorePosts: boolean = false;
  createPoll: boolean = false;
  private numOfPostsToFetch: number = 10;
  private bySearch: boolean = false;
  postToEdit: any;
  showAddAdvertisement: boolean = false;
  constructor(private fieldVoteService: FieldVoteService ,private commentReactService: CommentReactService,private postLikeService: PostLikeService, private toastr: ToastrService,private postService: PostService, private commentService: CommentService) {
    this.currentUser = AppComponent.instance.getCurrentUser();
  }

  ngOnInit(): void {
    PostComponent.instance = this;
    this.clickedTheInside = false;
    this.showAddPost = false;
    this.posts = [];
    this.loadingData = true;
    this.refreshing = true;
    this.findAllPosts();

  }
  findAllPosts() {

    this.noMorePosts = false;
    console.log(this.filterType, this.offset, this.numOfPostsToFetch);
    this.postService.list(this.filterType, 1,this.offset, this.numOfPostsToFetch).subscribe((r: Post[]) => {
        this.reloadData(r);
    }, (error: any) => {
      this.loadingData = false;
      console.log(error);
    });
  }
  reloadData(r: Post[]) {
    if(r.length == 0) {
      this.posts = [];
      this.loadingData = false;
      this.refreshing = false;
      this.secondaryLoading = false;
    }
      for(let post of r) {
        this.posts.push(post);
        if(post.listComments == null ){
          post.listComments = [];
        }
        if(post.postFiles == null ){
          post.postFiles = [];
        }
        this.postService.getPollByPostId(post.postId).subscribe((poll: PostPoll) =>{
          post.poll = poll;
          if(post.poll != null) {

            post.poll.votedField = null;
            post.poll.voteCount = 0;
            for(let field of post.poll.fields) {
              this.fieldVoteService.findAllVoteByField(field.pollFieldId).subscribe((v: FieldVote[]) => {
                field.votes = v;
                post.poll.voteCount+=field.votes.length;
                field.votesCount = field.votes.length;
                for(let vote of field.votes) {
                  if(vote.userVote.id == this.currentUser.id) {
                    field.vote = vote;
                    field.votedByCurrentUser = true;
                    post.poll.votedField = field;
                    break;
                  }
                }
              }, error => {console.log(error)});
            }
          }
          post.commentsFilterType = "newest";
          if(post.poll == null) {
            for(let postFile of post.postFiles) {
              this.postService.loadImage(postFile).subscribe(
                img => {
                  let pf = new PostFile();
                  // @ts-ignore
                  pf.url = postFile;
                  pf.image = img;
                  post.postFiles[post.postFiles.indexOf(postFile)] = pf;
                }, error => {
                  console.log(error);
                }
              )
            }
          }
          this.postLikeService.getLikesByPostId(post.postId).subscribe(data => {
            post.listPostLikes = data;
            post.numberOfLikes = 0;
            post.likesCount = 0;
            post.dislikesCount = 0;
            post.likedByCurrentUser = "no";
            for(let like of post.listPostLikes) {
              if (like.typeLike =="UP"){
                post.likesCount++;
              } else {
                post.dislikesCount++;
              }
              post.numberOfLikes = post.likesCount-post.dislikesCount;
              if(AppComponent.instance.getCurrentUser() != null){
                if(like.likeOwner.id == AppComponent.instance.getCurrentUser().id) {
                  post.likedByCurrentUser = like.typeLike;
                }
              }
            }
          }, error => {
            this.loadingData = false;
            console.log(error);
          });

        setTimeout(() => {
          this.loadingData = false;
          this.refreshing = false;
          this.secondaryLoading = false;
        }, 500);
        }, error => console.log(error));
      }
  }
  public closeAddPostStatic(post: any) {
    if(post !=null) {
      this.toastr.success("Post added successfully", "Post");
    } else {
      this.toastr.success("Post updated successfully", "Post");
    }
  setTimeout(() => {
    if(post!=null) {
    post.listComments = [];
    post.numberOfLikes = 0;
    if(post.poll != null) {
      post.poll.voteCount = 0;
    }
    PostComponent.instance.posts.unshift(post);
    }
    this.clickedTheInside = false;
    this.closeAddPost();
    this.postToEdit = null;
  }, 500);

  }
  public closeAddPost() {
    if(!this.clickedTheInside) {
      this.showAddPost = false;
      this.postToEdit = null;
    }
    this.clickedTheInside = false;
  }


  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: Event) {
    if(window.scrollY >200) {
      this.showToolTip = true;
    } else{
      this.showToolTip = false;
      this.showSubToolTips = false;
    }
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.secondaryLoading && !this.loadingData && !this.refreshing && !this.noMorePosts && !this.bySearch) {
      this.secondaryLoading = true
      this.postService.countPosts().subscribe((count: number) => {
        console.log(this.posts.length, count);
        if (this.posts.length == count) {
          this.secondaryLoading = true
          setTimeout(() => {
            this.noMorePosts = true;
            this.secondaryLoading = false
          }, 800);
          return;
        } else if(this.posts.length+10>count) {
        this.numOfPostsToFetch = count - this.posts.length;
        }
        this.offset++;
        setTimeout(() => {
          this.findAllPosts();
        }, 500);
      }, error => console.log(error));

    }
  }

  filterPosts(filter: string){
    this.bySearch = false;

    if(document.getElementById("searchInput")!= null) {
    // @ts-ignore
    document.getElementById("searchInput").value = "";
    }
    this.showSearchBar = false;
    this.posts = [];
    this.refreshing = true;
    this.filterType = filter;
    this.offset = 1;
    this.findAllPosts();
  }

  searchPosts(event: KeyboardEvent) {
    // @ts-ignore
    if(event.key == "Enter" && document.getElementById("searchInput").value != "") {
      this.refreshing = true;
      this.isFiltered = true;

      this.noMorePosts = false;
    this.offset = 1;
      this.posts = [];
      // @ts-ignore
      this.postService.serchPosts(document.getElementById("searchInput").value).subscribe((r: Post[]) => {
        this.bySearch = true;
        this.reloadData(r);
      }, (error: any) => {
        this.loadingData = false;
        console.log(error);
      });
  }
  }

  updateSearchValue() {
    // @ts-ignore
   if(document.getElementById("searchInput").value == "") {
     this.refreshing = true;
     this.isFiltered = false;
     this.offset = 1;
     this.posts = []
     this.bySearch = false;
     this.findAllPosts();
   }
  }

  refreshPostsByCLose() {
    this.refreshing = true;
    this.showSearchBar = !this.showSearchBar;
    // @ts-ignore
    if(!this.showSearchBar && this.isFiltered) {
      // @ts-ignore
      document.getElementById("searchInput").value = "";
      this.bySearch = false;
      this.offset = 1;
      this.posts = []
      this.findAllPosts();

    }
  }
  showSearch() {
    this.showSubToolTips = false;
    this.showSearchBar = true;
    let rmv = 50;
    let inter = setInterval(() => {
      window.scrollTo(0,window.scrollY-rmv);
      rmv=rmv+rmv*0.05;
      if(window.scrollY <= 0) {
        clearInterval(inter);
      }
    }, 10)
  }
}
