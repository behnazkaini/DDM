export interface SendMessageRequestViewModel {
  EventGuid: string;
  PersonGuid: string[];
  KeyValues: { [key: string]: string; };
}
