import { RepositoryType } from "./Chargoon.Didgah.FileSystem.Domain.Enumeration.RepositoryType";

export interface FileRepositoryViewModel {
  Guid: string;
  Order: number;
  Title: string;
  RepositoryType: RepositoryType;
  EffectiveDate: Date;
  MinimumSize: number;
  DatabaseName: string;
  DatabaseServer: string;
  IsDefaultRepository: boolean;
  IsPatternScheduled: boolean;
}
