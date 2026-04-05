export enum LogOutboxFailureSource {
  Origin = 1,
  Channel = 2,
  Destination = 3,
  UnhandledException = 4,
  ReceiverDaily = 5,
  ReceiverHourly = 6,
  SenderDaily = 7,
  SenderHourly = 8,
}
