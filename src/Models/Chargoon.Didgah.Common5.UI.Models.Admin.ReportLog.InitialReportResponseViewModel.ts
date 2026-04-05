import { RenderState } from "./Chargoon.Reporting.Domain.Enumeration.RenderState";
import { CreationType } from "./Chargoon.Reporting.Domain.Enumeration.CreationType";

export interface InitialReportResponseViewModel {
  Guid: string;
  SoftwareTitle: string;
  UserId: number;
  RequestDate: Date;
  ReportTitle: string;
  RenderState: RenderState;
  Creationtype: CreationType;
  OutputType: string;
  Destination: string;
  DBDataSource: string;
  DBInitialCatalog: string;
  ReportFileName: string;
}
