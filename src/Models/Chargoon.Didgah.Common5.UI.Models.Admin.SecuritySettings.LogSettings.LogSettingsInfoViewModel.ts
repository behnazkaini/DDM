import { EventsToLogViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.SecuritySettings.LogSettings.EventsToLogViewModel";

export interface LogSettingsInfoViewModel {
  LogCapacity: number;
  LogCapacityWarning: number;
  LogCapacityExceededPolicy: number;
  EventsToLog: EventsToLogViewModel[];
}
