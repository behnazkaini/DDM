import { PersonLogEvent } from "./Chargoon.Didgah.Common.Domain.Enumeration.PersonLogEvent";

export class PersonLogViewModel {
  Guid: string;
  Username: string;
  Event: PersonLogEvent;
  Time: Date;
}
