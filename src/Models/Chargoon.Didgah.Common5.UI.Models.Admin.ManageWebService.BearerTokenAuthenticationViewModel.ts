import { IWebApiAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.IWebApiAuthenticationViewModel";

export interface BearerTokenAuthenticationViewModel extends IWebApiAuthenticationViewModel {
  Token: string;
}
