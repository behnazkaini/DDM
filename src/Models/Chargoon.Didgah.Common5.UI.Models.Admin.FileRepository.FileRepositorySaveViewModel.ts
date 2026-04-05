import { RepositoryType } from "./Chargoon.Didgah.FileSystem.Domain.Enumeration.RepositoryType";
import { SoftwareFileRepositoryViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.FileRepository.SoftwareFileRepositoryViewModel";

export interface FileRepositorySaveViewModel {
  Guid: string;
  Title: string;
  EffectiveDate: Date;
  MinimumSize: number;
  ReadOnly: boolean;
  RepositoryType: RepositoryType;
  DirectoryName: string;
  DirectoryLogName: string;
  DirectoryFileStreamName: string;
  FileGroupName: string;
  DatabaseName: string;
  DatabaseServer: string;
  UserName: string;
  Password: string;
  ReadChunkSize: number;
  WriteChunkSize: number;
  IsLocalDatabase: boolean;
  ConnectionTimeout: number;
  QueryTimeout: number;
  ImpersonationRequired: boolean;
  IsNew: boolean;
  UpdatePassword: boolean;
  AddedSoftwareRepositories: SoftwareFileRepositoryViewModel[];
  EditedSoftwareRepositories: SoftwareFileRepositoryViewModel[];
  DeletedSoftwareRepositories: SoftwareFileRepositoryViewModel[];
}
