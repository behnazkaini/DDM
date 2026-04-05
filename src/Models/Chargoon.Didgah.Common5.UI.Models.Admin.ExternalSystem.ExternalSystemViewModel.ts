export interface ExternalSystemViewModel {
  Guid: string;
  Title: string;
  UserName: string;
  Password: string;
  CallbackURL: string;
  ValidIPs: string;
  SyncedToIdentityServer: boolean;
}
