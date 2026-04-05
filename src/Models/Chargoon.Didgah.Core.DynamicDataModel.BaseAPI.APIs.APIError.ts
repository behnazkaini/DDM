import { ErrorType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Services.ErrorType";

export interface APIError {
  Type: ErrorType;
  Message: string;
}
