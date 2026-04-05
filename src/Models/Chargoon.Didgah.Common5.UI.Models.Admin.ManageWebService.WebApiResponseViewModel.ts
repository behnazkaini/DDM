import { HttpStatusCode } from "./System.Net.HttpStatusCode";
import { WebApiResponseError } from "./Chargoon.Didgah.Common.Domain.Enumeration.WebApiResponseError";

export interface WebApiResponseViewModel {
  StatusCode: HttpStatusCode;
  Content: string;
  Error: WebApiResponseError;
}
