import { RepositoryType } from "./Chargoon.Didgah.FileSystem.Domain.Enumeration.RepositoryType";
import { SoftwareFileRepositoryViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.FileRepository.SoftwareFileRepositoryViewModel";

export interface FileRepositoryEditViewModel {
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
  ConnectionTimeout: number;
  QueryTimeout: number;
  ImpersonationRequired: boolean;
  IsLocalDatabase: boolean;
  IsDefaultRepository: boolean;
  IsDatabseInfoEditable: boolean;
  SoftwareRepositories: SoftwareFileRepositoryViewModel[];
}
