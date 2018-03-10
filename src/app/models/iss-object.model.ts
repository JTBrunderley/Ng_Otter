import {IssPosition} from './iss-position.model';

export class IssObject {
  constructor(public iss_position: IssPosition, public message: string, public timestamp: number) {}
}
