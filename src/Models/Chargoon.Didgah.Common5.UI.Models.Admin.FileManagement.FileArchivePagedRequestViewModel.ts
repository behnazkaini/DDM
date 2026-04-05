import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { FileArchiveRequestMetadataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.FileManagement.FileArchiveRequestMetadataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface FileArchivePagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: FileArchiveRequestMetadataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}
