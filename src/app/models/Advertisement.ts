import {Contributor} from "./Contributor";


export class Advertisement {
    tags!:number;
    startDate!:Date;
    endDate!:Date;
    wantedViewsNbr!:number;
    viewsNbr!:number;
    coast!:number;
    canal!:string;
    active!:boolean
    advertisementOwner!:Contributor
}
