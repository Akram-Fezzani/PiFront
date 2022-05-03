import {Post} from './Post';
import {Comment} from './Comment';
import {Message} from './Message';
import {Room} from "./Room";
export class Contributor {
  contributorId!:number;
  name!:string;
  domain!: string;
  adress!:string;
  legalStatus!:string;
  email!:string;
  phone!:number;
  typeContributor!: string;
}
