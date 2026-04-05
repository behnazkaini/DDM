import { FileTypeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.FileManagement.FileTypeViewModel";
import { SoftwareViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.FileManagement.SoftwareViewModel";

export interface FileArchiveInitViewModel {
  FileTypes: FileTypeViewModel[];
  Softwares: SoftwareViewModel[];
  HasDownloadFileAccess: boolean;
}
