export enum TransportableItemOutboxStatus {
  InSendingList = 1,
  SentButNotConfirmed = 2,
  SentAndConfirmed = 3,
  Failed = 4,
  Terminated = 5,
  InProcess = 6,
  ExpireDateExceeded = 7,
  Canceled = 8,
}
