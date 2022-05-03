import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Advertisement} from "../../models/Advertisement";

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.scss']
})
export class CreateAdComponent implements OnInit {
  addAdForm!: FormGroup;
  newAd: Advertisement = new Advertisement();
  uploading: boolean = false;
  words: string [] = [];
  disableSubmit: boolean = true;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createFormGroup();
  }
  private createFormGroup() {
    this.addAdForm = this.formBuilder.group({
      tags: ['', [Validators.minLength(3)]]
    });
  }
  get tags() {
    return this.addAdForm.get('tags') as FormControl;
  }
  addAd() {

  }

  addTag(event: KeyboardEvent) {
    // @ts-ignore
    if((event.key == "Enter" ||event.key == " ") && document.getElementById("tags").value != "") {
      if(event.key == " ") {
        // @ts-ignore
        document.getElementById("tags").value= document.getElementById("tags").value.slice(0, -1);
        // @ts-ignore
        if(document.getElementById("tags").value == "") {
          return;
        }
      }
      if(this.words.length < 10) {
        // @ts-ignore
        if(this.words.indexOf(document.getElementById("tags").value.toLowerCase()) < 0) {

      // @ts-ignore
      this.words.push(document.getElementById("tags").value.toLowerCase());
      // @ts-ignore
      document.getElementById("tags").value = "";
      this.disableSubmit = false;

        } else {
          // @ts-ignore
          this.flashBadge(document.getElementById("tags").value.toLowerCase()+""+this.words.indexOf(document.getElementById("tags").value.toLowerCase()))
        }
      } else{
          for(let word of this.words) {
           this.flashBadge(word+""+this.words.indexOf(word));
          }
      }
    }
  }
  flashBadge(id:string) {
    // @ts-ignore
    document.getElementById(id).classList.remove("badge-info");
    // @ts-ignore
    document.getElementById(id).classList.add("badge-danger");

    setTimeout(() => {
      // @ts-ignore
      document.getElementById(id).classList.remove("badge-danger");
      // @ts-ignore
      document.getElementById(id).classList.add("badge-info");

    },100)
  }
  removeWord(word: string) {
    this.words.splice(this.words.indexOf(word),1);
    if(this.words.length == 0) {
      this.disableSubmit = true;
    }
  }
}
