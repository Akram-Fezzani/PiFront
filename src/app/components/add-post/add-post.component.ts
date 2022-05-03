import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {ToastrService} from "ngx-toastr";
import {PostService} from "../../services/post/post.service";
import {PostComponent} from "../post/post.component";
import {AppComponent} from "../../app.component";
import {PollField} from "../../models/PollField";
import {PostPoll} from "../../models/PostPoll";
import {PostFile} from "../../models/PostFile";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];
  addPostForm!: FormGroup;
  disableSubmit!: boolean;
  uploadImageData!: FormData;
  createPoll!: boolean;
  newPost:Post = new Post();
  newPoll:PostPoll = new PostPoll();
  uploading!: boolean;
  previews: any;
  editing: boolean = false;
  addPollForm!: FormGroup;
  fieldMissing: boolean = false;
  filesToDelete: PostFile[] = [];

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private postService: PostService) { }

  ngOnInit(): void {
    this.createPoll = PostComponent.instance.createPoll;
    if (this.createPoll) {
      this.newPoll.fields = [];
    }
    if (PostComponent.instance.postToEdit != null) {
      this.editing = true;
      this.newPost = {...PostComponent.instance.postToEdit};
      if(this.createPoll) {
        this.newPoll = this.newPost.poll;
      } else {
        this.newPost.postFiles = [];
        for(let file of PostComponent.instance.postToEdit.postFiles) {
          this.newPost.postFiles.push(file);
        }
      }
    }
    this.previews = [];
    this.uploading = false;
    this.disableSubmit = false;
    if(this.createPoll) {
      if (PostComponent.instance.postToEdit == null) {
        this.addPollField();
        this.addPollField();
      }
      this.createFormGroupPoll()
    } else {
      this.createFormGroup();
    }
  }
  onFileDropped($event:any) {
    this.disableSubmit = true;
    this.prepareFilesList($event);
  }


  /**
   * handle file from browsing
   */
  fileBrowseHandler(files:any) {
    this.disableSubmit = true;
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        this.disableSubmit = false;
        return;
      } else {
        this.disableSubmit = true;
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = (_event) => {
        this.previews.push(reader.result);
      }
      // @ts-ignore
      this.fileDropEl.nativeElement.value = '';
      this.uploadFilesSimulator(0);
    }
  }
  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes:any, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  private createFormGroup() {
    this.addPostForm = this.formBuilder.group({
      postTitle: [this.newPost.postTitle, [Validators.required, Validators.minLength(3)]],
      postContent: [this.newPost.postContent, [Validators.required, Validators.minLength(20)]]
    });
  }
  private createFormGroupPoll() {
    this.addPollForm = this.formBuilder.group({
      pollTitle: [this.newPost.postTitle, [Validators.required, Validators.minLength(3)]],
    });
  }

  get pollTitle() {
    // @ts-ignore
    return this.addPollForm.get('pollTitle') as FormControl;
  }
  getErrorPollTitle() {
    return this.pollTitle.hasError('required') ?
      'Poll title required' : 'You need to specify at least 3 characters';
  }
  get postTitle() {
    // @ts-ignore
    return this.addPostForm.get('postTitle') as FormControl;
  }

  getErrorPostTitle() {
    return this.postTitle.hasError('required') ?
      'Post title required' : 'You need to specify at least 3 characters';
  }

  get postContent() {
    // @ts-ignore
    return this.addPostForm.get('postContent') as FormControl;
  }

  getErrorPostContent() {
    return this.postContent.hasError('required') ?
      'Post content required' : 'You need to specify at least 20 characters';

  }
  editPost() {
    let postToReturn = new Post();
    postToReturn.postTitle = this.newPost.postTitle;
    postToReturn.postContent = this.newPost.postContent;
    if(this.createPoll)
      postToReturn.poll = this.newPost.poll;
    this.postService.update(postToReturn, this.newPost.postId).subscribe(post => {

      if(post == null) {
        this.toastr.warning("Please watch your language !", "Edit denied");
        this.disableSubmit = false;
        this.uploading = false;
      } else {
        postToReturn = {...this.newPost};
        if(this.files.length > 0) {
          this.uploadFiles(postToReturn);
        }
          if (this.filesToDelete.length > 0) {
            for (let file of this.filesToDelete) {
              this.postService.deleteImage(file.url, post.postId)
                .subscribe((response) => {
                }, error => console.log(error));
            }
          }
        this.disableSubmit = false;
        this.uploading = false;
        console.log(postToReturn);
        PostComponent.instance.posts[PostComponent.instance.posts.indexOf(PostComponent.instance.postToEdit)] =postToReturn;
        PostComponent.instance.closeAddPostStatic(null);
        this.createFormGroup();
        this.files = [];
      }
    }, error => this.toastr.error("Some problem occurred while uploading your post ! please try again", "Error"));

  }
  addPost() {
    this.uploading = true;
    this.disableSubmit = true;
    if(this.editing) {
      this.editPost();
    } else{

    this.newPost.postOwner = AppComponent.instance.getCurrentUser();
    this.postService.add(this.newPost).subscribe(post => {
      if(post == null) {
        this.toastr.warning("Please watch your language !", "Post denied");
        this.disableSubmit = false;
        this.uploading = false;
      } else {
      if(this.files.length > 0) {
        post.postFiles = [];
        this.newPost = post;
       this.uploadFiles(this.newPost);
      }
      // @ts-ignore
      this.addPostForm.get('postContent').setValue(null);
      // @ts-ignore
      this.addPostForm.get('postTitle').setValue(null);
      this.createFormGroup();
      this.disableSubmit = false;
      this.uploading = false;
      post.showCommentsSection = true;
      PostComponent.instance.closeAddPostStatic(post);
      this.files = [];
      }
    }, error => this.toastr.error("Some problem occurred while uploading your post ! please try again", "Error"));
  }
  }
  uploadFiles(p: Post) {
    for(const file of this.files) {
      this.uploadImageData = new FormData();
      this.uploadImageData.append('file', file, file.name);
      this.postService.uploadImage(this.uploadImageData, p.postId)
        .subscribe((response) => {
          console.log(response);
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (_event) => {
            let pf = new PostFile();
            pf.url = response;
            pf.image = reader.result;
            p.postFiles.push(pf);
            reader.abort();
          }
        }, error => console.log(error));
    };
  }
  keepAddPost() {
    PostComponent.instance.clickedTheInside = true;
  }

  addPollField() {
    let f = new PollField();
    f.field = "";
    this.newPoll.fields.push(f);
  }

  addPostWithPoll() {
    for(let pollField of this.newPoll.fields) {
      if(pollField.field.length == 0) {
        this.fieldMissing = true;
        return;
      }
    }
    this.fieldMissing = false;
    this.uploading = true;
    this.disableSubmit = true;
    this.newPost.postOwner = AppComponent.instance.getCurrentUser();
    this.newPost.poll = this.newPoll;
    console.log(this.newPost);
    this.postService.add(this.newPost).subscribe(post => {
      if(post == null) {
        this.toastr.warning("Please watch your language !", "Post denied");
        this.disableSubmit = false;
        this.uploading = false;
      } else {
        // @ts-ignore
        this.addPollForm.get('pollTitle').setValue(null);
        this.createFormGroupPoll();
        this.disableSubmit = false;
        this.uploading = false;
        this.addPollField();
        this.addPollField();
        post.postFiles = [];
        this.newPoll = new PostPoll();
        this.newPoll.fields = [];
        PostComponent.instance.closeAddPostStatic(post);
      }
    }, error => this.toastr.error("Some problem occurred while uploading your post ! please try again", "Error"));
  }

  setFilesToDelete(file: PostFile, i:number) {
    this.filesToDelete.push(file);
    console.log(this.newPost.postFiles);
    this.newPost.postFiles.splice(i, 1)
    console.log(this.newPost.postFiles);
  }
}
