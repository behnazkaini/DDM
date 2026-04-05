import { FileRepositoryDuration } from "./Chargoon.Didgah.FileSystem.Domain.Enumeration.FileRepositoryDuration";

export interface FileRepositoryPatternSaveViewModel {
  encGuid: string;
  encRepositoryGuid: string;
  DataFilePath: string;
  LogFilePath: string;
  FileStreamPath: string;
  FileRepositoryDuration: FileRepositoryDuration;
}
