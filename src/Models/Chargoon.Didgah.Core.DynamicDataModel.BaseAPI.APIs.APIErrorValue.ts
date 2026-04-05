import { APIError } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.APIs.APIError";

export interface APIErrorValue<TValue> extends APIError {
  Value: TValue;
}
