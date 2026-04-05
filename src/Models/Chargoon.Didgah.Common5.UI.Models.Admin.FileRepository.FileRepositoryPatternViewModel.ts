import { FileRepositoryDuration } from "./Chargoon.Didgah.FileSystem.Domain.Enumeration.FileRepositoryDuration";

export interface FileRepositoryPatternViewModel {
  encGuid: string;
  DataFilePath: string;
  LogFilePath: string;
  FileStreamPath: string;
  FileRepositoryDuration: FileRepositoryDuration;
}
