declare module "didgah/core/common" {
  interface FormGenertorOnCreateArgs {
    getFormData: () => PromiseLike<{ errors: any[]; data: object }>;
  }

  interface FormGeneratorProps {
    entityGuid?: System.Guid;
    layoutKey: string;
    recordGuid: System.Guid;
    onCreated: (form: FormGenertorOnCreateArgs) => void;
    mode: "add" | "edit" | "display";
    onLoadCompleted?: () => void;
    onFormResult?: (result: any) => void;
    checkHasLayout?: boolean;
  }

  export interface SearchFormGeneratorProps {
    initialData?: import("../Models/Chargoon.Didgah.Core.DDM.BaseAPI.Models.Search.SearchModel").SearchModel;
    entityGuid: string;
    onChange: (
      searchData: import("../Models/Chargoon.Didgah.Core.DDM.BaseAPI.Models.Search.SearchModel").SearchModel
    ) => void;
  }

  interface DataModelComponentProps {
    softwareGuid: System.Guid;
    entityGuid?: System.Guid;
    scopeGuid: System.Guid;
    context?: any;
  }

  interface SetStaffGroupProps {
    staffId: any;
  }

  interface AssociationsArchiveProps {
    ownerSoftwareGuid?: System.Guid;
  }

  export class FormGenerator extends React.Component<FormGeneratorProps, any> {
    render(): JSX.Element;
  }

  export class SearchFormGenerator extends React.Component<
    SearchFormGeneratorProps,
    any
  > {
    render(): JSX.Element;
  }

  export class SetStaffGroup extends React.Component<SetStaffGroupProps, any> {
    render(): JSX.Element;
  }

  export class AssociationsArchive extends React.Component<
    AssociationsArchiveProps,
    any
  > {
    render(): JSX.Element;
  }

  interface SoftwareSettingsProps {
    commandParameter?: {
      softwareGuid: System.Guid;
      separationFactorGuids: string;
    };
    theme?: string;
  }
  export class SoftwareSettings extends React.Component<
    SoftwareSettingsProps,
    any
  > {
    render(): JSX.Element;
  }

  interface IndicatorProps {
    softwareGuid: System.Guid;
  }
  export class Indicator extends React.Component<IndicatorProps, any> {
    render(): JSX.Element;
  }

  export class DataModelComponent extends React.Component<
    DataModelComponentProps,
    any
  > {
    render(): JSX.Element;
  }

  interface ICSharpBlockLanguageProps {
    businessRuleGuid: string;
    scopeGuid: string;
    softwareGuid: string;
    saveCallback: (businessRuleGuid: string) => void;
  }

  export class CSharpBlockLanguage extends React.Component<
    ICSharpBlockLanguageProps,
    any
  > {
    render(): JSX.Element;
  }

  export class PersonFilterModelBase {
    Active?: boolean;
    DomainCode: string;
    Comments: string;
  }

  export interface IndividualPersonFilterModel extends PersonFilterModelBase {
    FirstName: string;
    LastName: string;
    DisplayName: string;
    PersonTitleGuid: string;
    Ssn: string;
    IdNumber: string;
    IgnoreWithUsers?: boolean;
  }

  export interface LegalPersonFilterModel extends PersonFilterModelBase {
    CompanyName: string;
    RegisterNumber: string;
    OldCompanyName: string;
    EconomicCode: string;
    EconomicalUniqueIdentifier: string;
    SupplyStatusGuid: string;
    StockStatusGuid: string;
    OwnershipTypeGuid: string;
  }

  export type PersonType = "Individual" | "Legal";

  export interface PersonArchiveProps {
    selectorMode?: boolean;
    selectorType?: PersonType;
    individualPersonDefaultFilter?: IndividualPersonFilterModel;
    legalPersonDefaultFilter?: LegalPersonFilterModel;
  }

  interface ReportInfo {
    reportGuid: string;
    reportTitle: string;
  }

  interface IRequesterBox {
    getRequesterBoxFormValue?: () => object;
  }
  interface AdvancedReportRequesterBoxProps {
    reportId: string;
    softwareGuid: string;
    tableKey: number;
    isEnabaleSignatureSets: boolean;
    getReportGuid: () => Promise<ReportInfo>;
  }
  export class AdvancedReportRequesterBox extends React.Component<
    AdvancedReportRequesterBoxProps,
    any
  > {
    render(): JSX.Element;
  }

  interface CommandParameter {
    softwareGuid: string;
    permissionRules?: (
      orphanName: string,
      softwareGuid: string
    ) => permissionRules;
  }

  interface permissionRules {
    readOrphan: boolean;
    editOrphan: boolean;
  }

  interface OrphanListProps {
    commandParameter: CommandParameter;
  }

  export class OrphanList extends React.Component<OrphanListProps, any> {
    render(): JSX.Element;
  }

  export interface RemoteDataSource {
    url: string;
    metadata?: any;
    extraData?: any;
  }

  export type RendererCommandHandlerProps = {
    layoutGuid: string;
    mode: 'add' | 'edit';
    primaryKey: string;
    inLoadableMode: boolean;
    store: any;
    widgetsMode?: WidgetType;
    remoteDataSource?: RemoteDataSource;
    softwareGuid?: string;
  }

  export type ComplexValidationResultProps = {
    PrimaryKey: string;
    SubLayoutResults: SubLayoutResultsModel[];
    Message: string;
    Succeedded: boolean;
    ValidationGuid: string;
  }

  export type SubLayoutResultsModel = {
    layoutGuid: string;
    results: ComplexValidationResultProps[];
  }

  export type ValidationResult = {
    succeedded: boolean;
    message?: React.ReactNode;
    result?: ComplexValidationResultProps[];
  }

  export class DDMFormRenderer extends React.Component<RendererCommandHandlerProps, any> {
    render(): JSX.Element;
  }

  export function useDDMFormRenderer(): {
    readonly store: any;
    readonly getFormData: () => Promise<typeof import("../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel")[]>
    readonly getFormDataWithoutValidation: () => Promise<typeof import("../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel")[]>
    readonly getValidationResult: () => ValidationResult
  };

  interface DDMSearchProps {
    initialData?: import('../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchRequestViewModel').SearchRequestViewModel;
    onChange: (searchData: import('../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchRequestViewModel').SearchRequestViewModel | null) => void;
    dataModelGuid: System.Guid;
  }

  export class DDMSearch extends React.Component<
    DDMSearchProps,
    any
  > {
    render(): JSX.Element;
  }


  export interface IWidget {
    component: any;
    event?: LifeCycleEvent;
  }

  interface LifeCycleEvent {
    onInit?: (widgetId: string, attributes: object, context) => Promise<object>;
  }

  export type IDictionary<V> = {
    [key: string]: V;
  };

  interface FieldTypeWidgets {
    [key: string]: {
      Name: string;
      EditWidget: IDictionary<any>;
      DisplayWidget: IDictionary<any>;
    }
  }

  export interface IWebSoftwareViewModel {
    component: (id: string) => IWidget,
    widgetMap: FieldTypeWidgets,
    settingComponent: any,
  }

  export enum DirectionType {
    Auto = "unset",
    Right = "rtl",
    Left = "ltr",
  }

  export enum WidgetType {
    EditWidget = "EditWidget",
    DisplayWidget = "DisplayWidget",
    SearchWidget = "SearchWidget"
  }

  export type PermanentDataModelBriefProps = {
    softwareGuid: string;
    accessToken?: string;
  }

  export class PermanentDataModelBrief extends React.Component<PermanentDataModelBriefProps, any> {
    render(): JSX.Element;
  }
}
