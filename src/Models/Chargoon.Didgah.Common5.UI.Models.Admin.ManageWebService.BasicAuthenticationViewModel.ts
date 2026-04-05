import { IWebApiAuthenticationViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.IWebApiAuthenticationViewModel";

export interface BasicAuthenticationViewModel extends IWebApiAuthenticationViewModel {
  BasicUserName: string;
  BasicPassword: string;
}
