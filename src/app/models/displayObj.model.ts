import {Tweet} from './tweet.model';


export class DisplayObj {
  constructor(public place: string, public tweets: Tweet[]) {}
}