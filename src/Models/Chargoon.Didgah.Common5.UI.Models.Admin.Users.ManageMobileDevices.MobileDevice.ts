export interface MobileDevice {
  Guid: string;
  DeviceId: string;
  Name: string;
  OS: string;
  DidgahVersion: string;
  OSVersion: string;
  FirstLoginDate: Date;
  LastLoginDate: Date;
  RemoteWipe: boolean;
}
