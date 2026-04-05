import { StaffUserSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Staff.StaffUserSaveViewModel";

export interface StaffSaveViewModel {
  Id: number;
  DepartmentId: number;
  ParentStaffId: number;
  PersonGuid: string;
  PersonTitleGuid: string;
  Ssn: string;
  FirstName: string;
  LastName: string;
  NationalityGuid: string;
  PersonTitle: string;
  OperationGuid: string;
  Title: string;
  Code: string;
  OrderIndex: number;
  PostCode: string;
  DisplayTitle: string;
  PhoneNumber: string;
  ShowPersonDisplayNameInFullTitle: boolean;
  StaffPersonRelationType: number;
  IsDefaultUserChanged: boolean;
  IsOperationGuidChanged: boolean;
  IsRelationTypeChanged: boolean;
  IsViaUser: boolean;
  IsDirect: boolean;
  IsWithoutConnection: boolean;
  StaffTitleGuid: string;
  StaffUserLoaded: StaffUserSaveViewModel[];
  StaffUserDeleted: StaffUserSaveViewModel[];
  StaffUserEdited: StaffUserSaveViewModel[];
  StaffUserAdded: StaffUserSaveViewModel[];
}
