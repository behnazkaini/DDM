import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { FileArchiveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.FileManagement.FileArchiveViewModel";

export interface FileArchivePagedResponseViewModel {
  Data: FileArchiveViewModel[];
  Total: number;
}
