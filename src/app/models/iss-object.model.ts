import {IssPosition} from './iss-position.model';

export class IssObject {
  constructor(public latitude: number,public longitude: number, public altitude: number, public velocity: number, public timestamp: number) {}
}
