import { IWebApiAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.IWebApiAuthenticationViewModel";
import { AuthenticationInfoSendType } from "./Chargoon.Didgah.InteractionManager.Contracts.Common.WebApiAuthentication.AuthenticationInfoSendType";

export interface ApiKeyAuthenticationViewModel extends IWebApiAuthenticationViewModel {
  ApiKey: string;
  ApiValue: string;
  ApiKeySendType: AuthenticationInfoSendType;
}
