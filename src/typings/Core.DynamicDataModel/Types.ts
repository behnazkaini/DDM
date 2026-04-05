import {
  ModernTableColumnProps,
  extendedData,
} from "@didgah-components/ant-table/utils";

import { ReactElementType } from "react-window";
import { ColumnViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { DataModelViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutItemViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { RelationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutValueResponseViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { AddColumnViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddColumnViewModel";
import {
  ArchiveDesignerTabs,
  ArrangementType,
  ColumnAlign,
  DefineDesignerTabs,
  DesignerItemType,
  DesignerMode,
  DirectionType,
  ErrorDesignType,
  FieldTypes,
  HelpBlockType,
  PropertiesDockTabs,
  ReferenceTypes,
  WidgetType,
  Events,
  ColumnActions,
  ReferenceActions,
  NoneBindableWidgetType,
  EditWidget,
} from "./Enums";
import { ValidationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { IConditionBase } from "@models/didgah-components";
import { ConditionType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { ConditionGroupType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";
import { DidgahContextProps, WrappedFormUtils } from "didgah/ant-core-component";
import { RelationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationNature } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { LayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { SaveRowViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { KeyValueViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";
import { DefineArchiveLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import { ColumnDataType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { IInitialLocalState } from "../../Core.DynamicDataModel/Designer/store/localLayoutContext";
import { ValidationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { WebSoftwareComponentViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { DDMPlugin } from "@didgah/ddm-plugins";
import { SaveLayoutPluginViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";
import { LayoutPluginViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutPluginViewModel";
import { SaveDataModelVariableViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.SaveDataModelVariableViewModel";

export type IDictionary<V> = Record<string, V>;
export interface SettingType {
  [LayoutType.Define]: Array<string>;
  [LayoutType.Archive]?: Array<string>;
}

export interface FloorIdentify {
  LayoutGuid: string;
}

export interface RemoveGroupGuid {
  Guid: string;
}

export interface ColumnItem {
  Id?: number;
  Type: ArrangementType;
  LayoutItemGuid: string;
  Col: number;
  dataModelGuid?: string;
}

export interface EmptyItem {
  Id?: number;
  Type: ArrangementType.Empty;
  Col: number;
}

export interface RowItem {
  Id?: number;
  Type: ArrangementType.Row;
  Columns: Array<ColumnItem | EmptyItem>;
}

export interface GroupItem {
  Id: number;
  Type: ArrangementType.NoneBindableGroup;
  LayoutItemGuid: string;
  Children: Array<RowItem | GroupItem>;
}

export interface Design {
  IsResponsive: boolean;
  Arrangement: Array<GroupItem>;
  Events: Array<FormEvents>;
}

export interface EventsAction {
  Guid: string;
  ActionId: number;
  CodeXml: string;
  ExtraData?: any;
}
export interface FormEvents {
  Title: string;
  LayoutItems: Array<{ Guid: string; EventId: number; ExtraData?: any }>;
  Actions: EventsAction[];
}

export interface BaseLayoutItemSetting {
  Label: string;
  simpleDesignerWidgetType?: number;
}

export interface WidgetId {
  Id: number;
}

export interface ComponentDefaultProps<V = any> {
  value: V;
  onChange: (value: V) => void;
  validationRules: any;
  initValue: V;
  mode: "design" | "render";
  primaryKey?: string;
  dataModelGuid?: string;
  resetForm?: () => void;
  isGrid?: boolean;
  rules?: any[];
}

export interface ComponentProps<V = any>
  extends LayoutItemColumnSetting,
  LayoutItemReferenceSetting,
  ComponentDefaultProps<V> { }

export interface LayoutProps<V> {
  value?: V;
  onChange?: (value: V, dataIndex?: string) => void;
  validationRules?: any;
  initValue?: V;
  mode?: "design" | "render";
  layoutDesign?: ArchiveLayoutSetting;
}

export interface ActionReferenceArchiveProps {
  addNewRow: (index: number, data?: any) => void;
  deleteRow: (index: number) => void;
  updateRow: (rowIndex: any, recordData: any) => void;
  setInvalidRecords: (
    errorsInfo: { keyProperty: string; keyValue: string; errors: string[] }[]
  ) => void;
  getChanges: () => {
    added: extendedData<any>[];
    edited: extendedData<any>[];
    deleted: extendedData<any>[];
  };
  getData: () => extendedData<any>[];
  validateForms?: () => boolean;
  SUM: (column, targetColumn: string) => void;
  SUMForGrid: (column, targetColumn: string) => void;
}

export interface TableError {
  keyProperty: string;
  keyValue: string;
  errors: string[];
}

export interface ReferenceArchiveWidgetProps<V = any> extends LayoutProps<V> {
  columns?: Array<ModernTableColumnProps<any>>;
  onActionOnTable?: (handler: ActionReferenceArchiveProps) => void;
  onRowClick?: (value) => void;
  gotoPage?: (index: number) => void;
  primaryKey?: string;
  dataModelGuid?: string;
  label?: string;
  currentLayout?: LayoutViewModel;
  layoutGuid?: string;
  context?: DidgahContextProps;
  softwareGuid?: string;
  dataModels?: DataModelViewModel[]
  initialData?: LayoutValueResponseViewModel
}

export interface LayoutColumnsViewModelProps {
  Design: ArchiveTableColumnLayoutItemSetting;
  ItemType: LayoutItemType;
  ViewModelGuid: string;
  LayoutItemGuid: string;
}

export interface ArchiveWidget extends WidgetId {
  SearchSetting: SearchSetting;
  HasPagination: boolean;
  HasSort: boolean;
  ImpossibilityAdd?: boolean;
  ImpossibilityRemove?: boolean;
  CanExportDataTable?: boolean;
  CanImportDataTable?: boolean;
  MaxRow?: number;
  MinRow?: number;
}

export interface SearchSetting {
  Enable: boolean;
  LayoutItemGuid: string;
  ColumnViewModelGuid: string;
}

export interface ArchiveLayoutSetting {
  Widget: ArchiveWidget;
  Events: Array<FormEvents>;
}

export interface BaseColumnSetting {
  Direction: DirectionType;
  LabelMutable: boolean;
  WrapperCol: number;
  WrapperLabel: number;
  HelpTooltip: null | string;
  DefaultValue: string;
  Disabled: boolean;
  Label: string;
  DefaultStaff?: boolean;
}

export interface LayoutItemNoneBindableSetting extends BaseLayoutItemSetting {
  Widget: WidgetId;
}

export interface LayoutItemColumnSetting
  extends BaseLayoutItemSetting,
  HelpBlockProps,
  CommaSeparableComboBoxProps,
  BaseColumnSetting {
  Widget: WidgetType;
  EditWidget: WidgetId;
  DisplayWidget: WidgetId;
}

export interface HelpBlockProps extends BaseColumnSetting {
  HelpBlockType?: HelpBlockType;
  HelpBlockClosable?: boolean;
  HelpBlockShowMessage: boolean;
  HelpBlockMessage: string;
  HelpBlockDescription?: string;
  HelpBlockShowIcon?: boolean;
}

export interface CommaSeparableComboBoxProps extends BaseColumnSetting {
  ItemList: Array<string>;
}

export interface LayoutItemReferenceSetting
  extends BaseLayoutItemSetting,
  ReferenceAutoComplete,
  ReferenceTokenContainer,
  ReferenceCascadeDropDown {
  Widget: WidgetType;
  EditWidget: WidgetId;
  DisplayWidget: WidgetId;
}

export interface ReferenceAutoComplete {
  ReferenceAutoCompleteColumnsConfige: {
    Columns: IDictionary<{ order: number }>;
    SeperableCharachter: string;
  };
  dataModels?: Array<DataModelViewModel>;
}

export interface ReferenceTokenContainer {
  ReferenceTokenContainerColumnsConfige: {
    Columns: IDictionary<{ order: number }>;
    SeperableCharachter: string;
  };
}

export interface ReferenceCascadeDropDown {
  CascadeDropDownLevel: string;
}

export type LayoutItemSetting =
  | LayoutItemNoneBindableSetting
  | LayoutItemColumnSetting
  | LayoutItemReferenceSetting;

interface ArchiveTableColumnLayoutItemSetting {
  Label: string;
  Widget: "EditWidget" | "DisplayWidget";
  HelpTooltip: string;
  EditWidget?: WidgetId;
  DisplayWidget: WidgetId;
  Direction: ColumnAlign;
  Width: number | "auto";
  Sortable: boolean;
  Resizable: boolean;
  Editable: boolean;
}

export interface LayoutDesignerCommandHandlerParameter {
  mode: DesignerMode;
  layoutGuid: string;
  layoutType: LayoutType;
  dataModelGuid: string;
  parentGuid?: string;
  permission?: LayoutDesignerPermission;
  plugins?: DDMPlugin[];
  copyFormAppFn?: Function;
  softwareGuid?: string;
  scopeGuid?: string;
}

export interface ICLoseProps {
  subfloor?: IStateStack<LayoutViewModelWithState>;
  rapidClose?: boolean;
}

export interface SimpleDesignerICLoseProps {
  subfloor?: SimpleDesignerIStateStack<SimpleDesignerLayoutViewModelWithState>;
  rapidClose?: boolean;
}

export interface LayoutDesignerPermission {
  readOnly: boolean;
}

export interface InnerModalDesignerProps {
  ParentLayoutGuid?: string | null;
  LayoutKey: string;
  DataModelGuid: string;
  LayoutsModel?: LayoutsModel;
  WidgetFacory?: IWidgetFactory;
}

export interface LayoutsModel<T = any> {
  DataModels?: Array<DataModelViewModel>;
  Layouts?: Array<T>;
  WidgetFactory?: IWidgetFactory;
  WidgetsMode?: WidgetType;
}

export interface FieldTypeWidgets {
  [key: string]: {
    Name: FieldTypes | string;
    EditWidget: IDictionary<any>;
    DisplayWidget: IDictionary<any>;
    SearchWidget: IDictionary<any>;
    DisabledWidget: IDictionary<any>;
  };
}

export interface ReferenceTypeWidgets {
  [key: string]: {
    Name: ReferenceTypes;
    EditWidget: IDictionary<any>;
    DisplayWidget: IDictionary<any>;
    SearchWidget: IDictionary<any>;
    DisabledWidget: IDictionary<any>;
  };
}

export interface DragableMetadata {
  DesignType: ArrangementType;
  PayLoadItem: DesignerItemType;
  ItemType: LayoutItemType;
  attributes?: any;
  simpleDesignerWidgetType: string;
}

export interface ItemCount {
  Group: number;
  Row: number;
  Column: number;
  Field: number;
}

export interface GroupHook {
  Item: GroupItem;
  LayoutItem: LayoutItemViewModel;
}

export interface RowHook {
  Item: RowItem;
}

export interface RowMetadata {
  metadata: { attributes: { cols: Array<number> } };
  component: string;
}

export interface FieldMetadata {
  metadata: DragableMetadata;
  component: string;
}

export interface RelationMetadata {
  metadata: DragableMetadata;
}

export interface SetLoadingPayload extends FloorIdentify {
  IsLoading: boolean;
}

export interface SetDesignerTabsPayload extends FloorIdentify {
  ActiveTab: DefineDesignerTabs | ArchiveDesignerTabs;
}

export interface AddRowActionPayload extends FloorIdentify {
  LayoutItemGroupGuid: string;
  Cols: Array<number>;
  RowId: number;
}

export interface RemoveActionPayload extends FloorIdentify {
  LayoutItemGroupGuid: string;
  RowId: number;
}

export interface AddGroupActionPayload extends FloorIdentify {
  NewGroupItem: LayoutItemViewModel;
  ParentLayoutItemGuid: string;
}

export interface RemoveGroupActionPayload extends FloorIdentify {
  GroupGuid: string;
}

export interface AddColumnActionPayload extends FloorIdentify {
  LayoutItemGuid: string;
  RowId: number;
  ColumnId: number;
  ColumnlGuid: string;
  GroupGuid: string;
  ItemType: LayoutItemType;
  DesignType: ArrangementType;
  Design: string;
  validations: ValidationViewModel[];
}

export interface SimpleDesignerAddColumnActionPayload extends FloorIdentify {
  LayoutItemGuid: string;
  RowId: number;
  ColumnId: number;
  ColumnlGuid: string;
  GroupGuid: string;
  ItemType: LayoutItemType;
  DesignType: ArrangementType;
  Design: string;
  validations: ValidationViewModel[];
  simpleDesignerWidgetType?: string;
  dataModel?: DataModelViewModel;
}

export interface AddRelationActionPayload extends FloorIdentify {
  RowId: number;
  ColumnId: number;
  ReferenceGuid: string;
  GroupGuid: string;
  ItemType: LayoutItemType;
  DesignType: ArrangementType;
  Design: string;
  ColumnGuids: Array<string>;
  relationType?: number;
  relationNature?: number;
  DataModelType?: number;
  relationCandidatesType?: DesignerItemType;
}

export interface AddSubLayoutColumnActionPayload extends FloorIdentify {
  GroupGuid: string;
  ItemType: LayoutItemType.SubLayout;
  Design: string; // null
  RelationGuid: string;
  SubLayoutGuid: string; //new
  RowId: number;
  ColId: number;
  LayoutType: LayoutType;
}

export interface AddSelectedSubLayoutColumnActionPayload extends FloorIdentify {
  GroupGuid: string;
  ItemType: LayoutItemType.SubLayout;
  Design: string; // null
  RelationGuid: string;
  SubLayoutGuid: string; //new
  RowId: number;
  LayoutType: LayoutType;
  Layouts: LayoutViewModelWithState[];
  ColId: number;
}

export interface SimpleDesignerAddSelectedSubLayoutColumnActionPayload
  extends FloorIdentify {
  GroupGuid: string;
  ItemType: LayoutItemType.SubLayout;
  Design: string; // null
  RelationGuid: string;
  SubLayoutGuid: string; //new
  RowId: number;
  LayoutType: LayoutType;
  Layouts: SimpleDesignerLayoutViewModelWithState[];
  ColId: number;
}

export interface AddSubLayoutArchiveDefineActionPayload extends FloorIdentify {
  ItemType: LayoutItemType.SubLayout;
  SubLayoutGuid: string;
  LayoutType: LayoutType;
}

export interface SelectSubLayoutArchiveDefineActionPayload<T>
  extends FloorIdentify {
  subLayoutGuid: string;
  layoutType: LayoutType;
  layouts: T[];
}

export interface SelectSubLayoutInDefineActionPayload extends FloorIdentify {
  SubLayoutGuid: string;
  LayoutType: LayoutType;
  Layouts: LayoutViewModelWithState[];
}

export interface AddArchiveLayoutActionPayLoad extends FloorIdentify {
  ParentLayoutGuid: string;
  NewGroupContainer: AddGroupActionPayload;
  NewColumnContainer: AddSubLayoutColumnActionPayload;
  RelationViewModel: RelationViewModel;
}

export interface ToggleColumnArchiveLayout extends FloorIdentify {
  ColumnGuid: string;
  Design: string;
  Selected: boolean;
  ItemType: LayoutItemType;
  simpleDesignerWidgetType?: EditWidget;
  selectedItems?: number;
}

export interface ToggleColumnSimpleDesignerArchiveLayout extends FloorIdentify {
  ColumnGuid: string;
  Selected: boolean;
  ItemType: LayoutItemType;
  Design: string;
  simpleDesignerWidgetType: string;
}

export interface ToggleRelationArchiveLayout extends FloorIdentify {
  Design: string;
  Selected: boolean;
  ItemType: LayoutItemType;
  ColumnGuids: Array<string>;
  ReferenceGuid: string;
  selectedItems?: number;
}

export interface SaveArchiveLayoutSetting extends FloorIdentify {
  Widget: ArchiveWidget;
}

export interface UpdateArchiveLayoutActionPayload extends FloorIdentify {
  ParentLayoutGuid: string;
}

export interface IWidget {
  component: ReactElementType;
  event?: LifeCycleEvent;
}

interface LifeCycleEvent {
  onInit?: (widgetId: string, attributes: object, context) => Promise<object>;
}

export interface DataModelSetting {
  dataType: ColumnDataType;
  setting: any;
}

export interface ComponentModel {
  component:
  | string
  | React.ComponentClass<any, any>
  | React.FunctionComponent<any>
  | IWidget;
  rule: Array<any>;
  setting: any;
  layoutItemType?: LayoutItemType;
  dataModelSetting?: DataModelSetting;
  Guid?: string;
}

export interface ComponentNameSetting {
  setting: LayoutItemSetting;
  itemType: LayoutItemType;
  columnDataModelGuid: string;
}

export interface DefaultSetting {
  type: LayoutItemType;
  attribute: ColumnViewModel | RelationViewModel;
  settingType: LayoutType;
  widgetTypes: WidgetType[];
  simpleDesignerWidgetType?: string;
  isSimpleDesignerMode?: boolean;
  dataModelType?: number;
}

export interface WidgetFactoryConstructor {
  layoutModel: LayoutsModel;
  layoutGuid: string;
  dataModelGuid: string;
  softwareModels: Array<WebSoftwareComponentViewModel>;
  context: DidgahContextProps;
  isSimpleDesignerMode?: boolean;
}

export interface WidgetFactoryHelperList {
  type: LayoutItemType;
  getComponent: (layoutItem: LayoutItemViewModel) => ComponentModel;
  getComponentName: (
    layoutItem: LayoutItemViewModel,
    WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]
  ) => any;
  getComponentElement: (layoutItemSetting, mode, componentName?) => any;
  getInitialDefaultSettingHelper?: (
    attribute: ColumnViewModel | RelationViewModel,
    settingType: LayoutType,
    widgetTypes: WidgetType[]
  ) => BaseLayoutItemSetting | IGetReferenceDefaultSettingResult;
  getDefaultSettingByWidgetIdHelper?: (data: DefaultSettingWidgetById) => any;
  getDetailOfDataModel?: (
    layoutItem: LayoutItemViewModel
  ) => ColumnViewModel | RelationViewModel;
  getDataModelColumns: (layoutItem: LayoutItemViewModel) => DataModelViewModel;
  getDefaultValidationByWidgetIdHelper?: (
    props: DefaultValidationByWidgetIdHelperProps
  ) => ValidationViewModel[];
}

export interface IWidgetFactory {
  layouts: LayoutViewModel[];
  dataModels: Array<DataModelViewModel>;
  getLayoutItem: (layoutItemGuid: string) => LayoutItemViewModel | LayoutItemReferenceDesignerViewModel;
  getComponent: (
    layoutItemGuid: string,
    isSimpleDesignerMode?
  ) => ComponentModel;
  getComponentByMode: (
    layoutItemGuid: string,
    mode: WidgetType
  ) => ComponentModel;
  getComponentName: (
    layoutItem: LayoutItemViewModel,
    isSimpleDesignerMode?
  ) => any;
  getInitialDefaultSetting: (
    setting: DefaultSetting
  ) => BaseLayoutItemSetting | IGetReferenceDefaultSettingResult;
  getDefaultSettingByWidgetId?: (data: DefaultSettingWidgetById) => any;
  getDetailOfDataModel: (
    layoutItem: LayoutItemViewModel
  ) => ColumnViewModel | RelationViewModel;
  getDataModelColumns: (layoutItem: LayoutItemViewModel) => DataModelViewModel;
  getDataModelSetting: (layoutItem: LayoutItemViewModel) => DataModelSetting;
  getLayoutItemSettingByType: (
    layoutItem: LayoutItemViewModel
  ) => LayoutItemSetting;
  RelationInSoftwareModel: (
    referenceGuid: string
  ) => WebSoftwareComponentViewModel;
  getDefaultValidationByWidgetId: (
    props: getDefaultValidationByWidgetIdProps
  ) => ValidationViewModel[];
  getInitialDefaultValidation: ({
    layoutItemGuid,
    attributes,
    type,
  }: getInitialDefaultValidationArgs) => ValidationViewModel[];
  isSimpleDesignerMode: boolean;
}

export interface DefaultValidationByWidgetIdHelperProps {
  layoutItemGuid: string;
  viewModel: ColumnViewModel;
  widgetType: WidgetType;
  widgetId: string;
  simpleDesignerWidgetType?: string;
}

export interface getDefaultValidationByWidgetIdProps {
  layoutItem: LayoutItemViewModel;
  viewModel: ColumnViewModel;
  widgetType: WidgetType;
  widgetId: string;
  simpleDesignerWidgetType?: string;
}

export interface getDefaultValidationByWidgetIdProps {
  layoutItem: LayoutItemViewModel;
  viewModel: ColumnViewModel;
  widgetType: WidgetType;
  widgetId: string;
}

export interface IGetReferenceDefaultSettingResult {
  Design?: LayoutItemReferenceSetting | {};
  ColumnGuids?: Array<string>;
}

export interface SaveFieldDesignActionPayload extends FloorIdentify {
  LayoutItemGuid: string;
  Design: BaseLayoutItemSetting;
  DefaultSimpleValidation?: Array<ValidationViewModel>;
  simpleDesignerData?: any;
}

export interface RemoveFieldActionPayload extends FloorIdentify {
  LayoutItemGuid: string;
}

export interface FormValidationError {
  FormItemType: ArrangementType;
  ErrorType: ErrorDesignType;
  LayoutItemGuid?: string;
  FormItemId: number;
}

export interface LayoutViewModelWithState extends LayoutViewModel {
  State?: "Added" | "Modified" | "Unchanged";
  Plugins: LayoutPluginViewModel[];
  DataModelInfo?: any;
  Variables?: SaveDataModelVariableViewModel
}

export interface SimpleDesignerLayoutViewModelWithState
  extends LayoutViewModel {
  SimpleDesignerLayoutState?: "Added" | "Modified" | "Unchanged";
  SimpleDesignerDataModelState?: "Added" | "Modified" | "Unchanged";
  Plugins: LayoutPluginViewModel[];
  DataModelInfo?: any;
}

export interface DefineLayoutSimpleDesignerViewModel
  extends SimpleDesignerLayoutViewModelWithState {
  Validations: ValidationViewModel[];
  ComplexValidations: DesignerComplexValidationViewModel[];
}

export interface ArchiveLayoutSimpleDesignerViewModel
  extends SimpleDesignerLayoutViewModelWithState { }

export interface DefineArchiveLayoutSimpleDesignerViewModel
  extends SimpleDesignerLayoutViewModelWithState {
  DefineLayoutGuid: string;
}

export interface InlineArchiveLayoutSimpleDesignerViewModel
  extends SimpleDesignerLayoutViewModelWithState {
  Validations: ValidationViewModel[];
  ComplexValidations: DesignerComplexValidationViewModel[];
}

export interface DefineLayoutDesignerViewModel
  extends LayoutViewModelWithState {
  Validations: ValidationViewModel[];
  ComplexValidations: DesignerComplexValidationViewModel[];
}

export interface ArchiveLayoutDesignerViewModel
  extends LayoutViewModelWithState { }

export interface DefineArchiveLayoutDesignerViewModel
  extends LayoutViewModelWithState {
  DefineLayoutGuid: string;
}

export interface InlineArchiveLayoutDesignerViewModel
  extends LayoutViewModelWithState {
  Validations: ValidationViewModel[];
  ComplexValidations: DesignerComplexValidationViewModel[];
}

export interface LayoutItemDesignerViewModel {
  Guid: string;
  ParentGuid: string;
  Type: LayoutItemType;
  Design: string;
  OrderIndex: number;
}

export interface LayoutItemNonBindableDesignerViewModel
  extends LayoutItemDesignerViewModel { }

export interface LayoutItemNonBindableSimpleDesignerViewModel
  extends LayoutItemDesignerViewModel,
  RichLayoutItem { }

export interface LayoutItemColumnDesignerViewModel
  extends LayoutItemDesignerViewModel {
  ColumnGuid: string;
}
export interface LayoutItemColumnSimpleDesignerViewModel
  extends RichLayoutItem {
  ColumnGuid: string;
}

export interface LayoutItemReferenceDesignerViewModel
  extends LayoutItemDesignerViewModel {
  RelationGuid: string;
  ColumnGuids: string[];
}

export interface LayoutItemReferenceSimpleDesignerViewModel
  extends RichLayoutItem {
  RelationGuid: string;
  ColumnGuids: string[];
}

export interface SubLayoutItemDesignerViewModel
  extends LayoutItemDesignerViewModel {
  RelationGuid: string;
  SubLayoutGuid: string;
}

export interface SubLayoutItemSimpleDesignerViewModel
  extends LayoutItemDesignerViewModel,
  RichLayoutItem {
  RelationGuid: string;
  SubLayoutGuid: string;
}

export interface DefaultSettingWidgetById {
  widgetId: number;
  widgetType: WidgetType;
  layoutItemType: LayoutItemType;
  attribute: ColumnViewModel | RelationViewModel;
  settingLayoutType: LayoutType;
  simpleDesignerWidgetType?: string;
}

export interface PropertiesDockItemState {
  IsOpen: boolean;
  ActiveSettingTab: PropertiesDockTabs;
  LayoutItemFocus: string;
  IsFormFocused?: boolean;
}

export interface PropertiesDockLayoutState {
  IsOpen: boolean;
  ActiveSettingTab: PropertiesDockTabs;
  LayoutFocus: string;
  IsFormFocused: boolean;
}

export interface SimpleDesignerPropertiesDockItemState {
  IsOpen?: boolean;
  ActiveSettingTab?: PropertiesDockTabs;
  FocusedLayoutItemGuid: string;
}

export interface SimpleDesignerPropertiesDockLayoutState {
  IsOpen?: boolean;
  ActiveSettingTab?: PropertiesDockTabs;
  LayoutFocus: string;
  IsFormFocused: boolean;
}

export interface PropertiesDockItemActionPayload
  extends FloorIdentify,
  PropertiesDockItemState { }

export interface PropertiesDockLayoutActionPayload
  extends FloorIdentify,
  PropertiesDockLayoutState { }

export interface SimpleDesignerIStateStack<T> {
  ParentLayoutGuid: string;
  DataModelGuid: string;
  LayoutGuid: string;
  LayoutType: LayoutType;
  LayoutModels: LayoutsModel<T>;
  Mode: DesignerMode;
  IsLoading: boolean;
  ActiveTab: DefineDesignerTabs | ArchiveDesignerTabs;
  Count: ItemCount;
  StateVersion: number;
  FormValidation: Array<FormValidationError>;
  PropertiesDockItemState: SimpleDesignerPropertiesDockItemState;
  PropertiesDockLayoutState: SimpleDesignerPropertiesDockLayoutState;
  SoftwareModels: Array<WebSoftwareComponentViewModel>;
  DataModelInfo?: any;
}

export interface IStateStack<T> {
  ParentLayoutGuid: string;
  DataModelGuid: string;
  LayoutGuid: string;
  LayoutType: LayoutType;
  LayoutModels: LayoutsModel<T>;
  Mode: DesignerMode;
  IsLoading: boolean;
  ActiveTab: DefineDesignerTabs | ArchiveDesignerTabs;
  Count: ItemCount;
  StateVersion: number;
  FormValidation: Array<FormValidationError>;
  PropertiesDockItemState: PropertiesDockItemState;
  PropertiesDockLayoutState: PropertiesDockLayoutState;
  SoftwareModels: Array<WebSoftwareComponentViewModel>;
  DataModelInfo?: any;
}

export type StoreType = Array<IStateStack<any>>;

export interface DesignerPanSubLayoutPayload {
  onOpenInnerLayoutDesigner: (subLayoutGuid: string) => void;
  subLayoutState: IInitialLocalState;
  subLayoutDispatch: React.Dispatch<any>;
  openPreConfigeModal: (props: {
    rowId: number;
    groupGuid: string;
    colId: number;
  }) => void;
}

export interface DesignerComplexValidationViewModel {
  Guid: string;
  Message: string;
  ConditionGroup: QueryBuilderConditionGroupViewModel;
}

export interface QueryBuilderConditionGroupViewModel extends IConditionBase {
  OperatorId?: ConditionGroupType;
  Condition?: IConditionBase[];
}

export interface QueryBuilderConditionViewModel extends IConditionBase {
  Field: string;
  Operator: ConditionType;
  Value: any;
  Text: string;
}

export interface QueryBuilderConditionSettingViewModel {
  Value: object;
}

export interface RendererCommandHandlerParameter {
  layoutGuid: string;
  primaryKey?: string;
  mode: "add" | "edit";
  layoutType?: LayoutType;
  dataModelGuid: string;
  context?: DidgahContextProps;
}

export interface RemoteDataSource {
  url: string;
  metadata?: any;
  extraData?: any;
}

export type RendererCommandHandlerProps = {
  layoutGuid: string;
  dataModelGuid?: string;
  inLoadableMode: boolean;
  mode: "add" | "edit";
  primaryKey: string;
  widgetsMode?: WidgetType;
  context: DidgahContextProps;
  initialFormData?:
  | (Omit<LayoutValueResponseViewModel, "Rows"> & {
    Rows: SaveRowViewModel[];
  })
  | (Omit<LayoutValueByPrimaryKeyResponseViewModel, "Row"> & {
    Row: SaveRowViewModel;
  });
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  remoteDataSource?: RemoteDataSource;
  softwareGuid?: string;
  children?: React.ReactNode;
};

export interface LayoutItemsActions {
  actionId: ColumnActions | ReferenceActions;
  func: any;
  targetLayoutItemGuid: string;
  id: string;
}

export interface LayoutItemsActionsOnEvent {
  layoutItemGuid: string;
  eventId: Events;
  actions: LayoutItemsActions[];
}

export interface DataSetup {
  layoutItemGuid: string;
  layoutItemType: LayoutItemType;
  rowKey: string;
  dataModelType: RelationType;
  dataModelNature: RelationNature;
  event: LayoutItemsActionsOnEvent;
  subLayoutGuid: string;
  dataModelGuid: string;
  formData: any;
  row: any;
  formItemInitialValue: any;
  variableGuid?: string
  dataModel?: RelationViewModel
}

export interface ISetupData {
  data: DataSetup[];
  currentLayout?: LayoutViewModel;
  getFieldValue?: (
    layoutItemSetup: DataSetup,
    formData,
    recordKey,
    dataModel: RelationViewModel | ColumnViewModel
  ) =>
    | ColumnItemsFieldValue
    | RelationItemsOneToManyAggregationFieldValue
    | RelationItemsOneToOneAggregationFieldValue
    | RelationItemsOneToManyCompositionFieldValue;
  convertSaveRowViewModelToDataTable?: (
    columnData: DataSetup,
    keyValue: KeyValueViewModel<string, Object>,
    Guid: string
  ) => any;
  convertDataTableToSaveRowViewModel?: (
    layoutItemSetup: DataSetup,
    formData,
    recordKey,
    mode: "show" | "save"
  ) =>
    | ColumnItemsFieldValue
    | RelationItemsOneToManyAggregationFieldValue
    | RelationItemsOneToOneAggregationFieldValue
    | RelationItemsOneToManyCompositionFieldValue;
  initialData?: any
  getLayoutItem?:(layoutItemGuid:string)=> LayoutItemViewModel | LayoutItemReferenceDesignerViewModel

}

export interface SetupDataProps<T> {
  widgetFactory: IWidgetFactory;
  initialData: InitialArchiveFormDataType<T> | InitialDefineFormDataType<T> | T;
  currentLayout: LayoutViewModel;
  events?: LayoutItemsActionsOnEvent[];
}
export interface ArchivalRowItemModel {
  primaryKey: string;
  key: string;
  value: KeyValueViewModel<string, Object>[] | Object;
}
export interface ColumnItemsFieldValue {
  Key: string;
  Value: Object;
}

export interface RelationItemsOneToManyAggregationFieldValue {
  Key: string;
  Value: SaveRowViewModel[];
}

export interface RelationItemsOneToOneAggregationFieldValue {
  Key: string;
  Value: SaveRowViewModel[];
}

export interface RelationItemsOneToManyCompositionFieldValue {
  Key: string;
  Value: SaveRowViewModel[];
}
export interface ArchiveDataTable {
  data: Object[];
  added: Object[];
  edited: Object[];
  deleted: Object[];
}

export interface useLayoutsRendererHookProps<T> {
  hasParent: boolean;
  parentInitialData:
  | LayoutValueResponseViewModel
  | LayoutValueByPrimaryKeyResponseViewModel;
  layoutGuid: string;
  dataModelGuid: string;
  widgetsMode?: WidgetType;
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
  context: DidgahContextProps;
  remoteDataSource?: RemoteDataSource;
  isSimpleDesignerMode: boolean;
}

export interface GetterSavedDataProps {
  layoutGuid: string;
  value: SaveRowViewModel[];
  validationResult: ValidationResult;
}

export interface ValidationResult {
  succeedded: boolean;
  message?: React.ReactNode;
  result?: ComplexValidationResultProps[];
}

export interface ComplexValidationResultProps {
  PrimaryKey: string;
  SubLayoutResults: SubLayoutResultsModel[];
  Message: string;
  Succeedded: boolean;
  ValidationGuid: string;
}

export interface SubLayoutResultsModel {
  layoutGuid: string;
  results: ComplexValidationResultProps[];
}

export interface SaveDataViewModel {
  rows: SaveRowViewModel[];
  validationResult: ValidationResult;
}

export interface UseLayoutsRendererHook {
  loading: boolean;
  getComponentData: () => ComponentModel;
  setupDataValue: DataSetup[];
  showValidationError: ValidationResult;
  hideValidationError: () => void;
  getSavedAndValidationData: () => Promise<SaveDataViewModel>;
  getSavedDataWithoutValidation: () => SaveDataViewModel;
  getterSavedData: () => {
    (): Promise<GetterSavedDataProps>;
  };
}

interface ActionListProps {
  layoutItemGuid: string;
  value: any;
  actionsList: LayoutItemsActions[];
}

export interface UseDefineHook {
  setGetterSubLayoutData?: (data) => void;
  getSavedAndValidationData: () => Promise<SaveDataViewModel>;
  getterSavedData: () => {
    (): Promise<GetterSavedDataProps>;
  };
  showValidationError: ValidationResult;
  hideValidationError: () => void;
  setChangedLayoutItemGuid: (layoutItemGuid: string) => void;
  getChangedLayoutItemGuid: () => string[];
}

export interface UseDefineArchiveHook
  extends Omit<UseLayoutsRendererHook, "setupDataValue"> {
  showDefineForm?: (mode: "add" | "edit" | "display") => void;
  hideDefineForm?: () => void;
  setSelectedRecord?: (record) => void;
  visibleDefineForm?: boolean;
  currentLayout?: DefineArchiveLayoutViewModel;
  initialData?:
  | LayoutValueByPrimaryKeyResponseViewModel
  | LayoutValueResponseViewModel;
  selectedRecord?: any;
  setGetterSubLayoutData?: (data) => void;
  defineFormMode?: "add" | "edit" | "display";
  tableActionHandler: ActionReferenceArchiveProps;
  getDefineFormData: () => Promise<GetterSavedDataProps>;
  setupDataValue: ISetupData;
  handlerActionOnTable: (handler: ActionReferenceArchiveProps) => void;
}

export interface UseInlineArchiveHook {
  getComponentData: () => ComponentModel;
  setupDataValue: ISetupData;
  showValidationError: ValidationResult;
  hideValidationError: () => void;
  handlerActionOnTable: (handler: ActionReferenceArchiveProps) => void;
  getSavedAndValidationData: () => Promise<SaveDataViewModel>;
  getterSavedData: () => {
    (): Promise<GetterSavedDataProps>;
  };
  setActions: (
    layoutItemGuid: string,
    value: any,
    actionsList: LayoutItemsActions[]
  ) => Promise<
    {
      layoutItemGuid: string;
      value: any;
      actionsList: LayoutItemsActions[];
    }[]
  >;
  getActions: (targetLayoutItemGuid: string) => ResultAction[];
  getTableHandler: () => ActionReferenceArchiveProps;
  loading: boolean;
  initialData: LayoutValueResponseViewModel;
}

export interface ResultAction {
  targetLayoutItemGuid: string;
  actionName: string;
  actionValue: any;
  eventOnLayoutItemGuid: string;
}

export interface RendererLayoutProps<R> {
  layoutGuid: string;
  dataModelGuid: string;
  inLoadableMode: boolean;
  mode?: "add" | "edit";
  primaryKey?: string;
  onSave?: (data) => void;
  onGetSavedData?: (
    data: () => GetterSavedDataProps | Promise<GetterSavedDataProps>
  ) => void;
  widgetsMode?: WidgetType;
  previewInitialDataForDesigner?: LayoutValueResponseViewModel;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
  context: DidgahContextProps;
  remoteDataSource?: RemoteDataSource;
  onChange?: (value, tableHandler, setupData?: ISetupData) => void;
  layoutComponents?: { element: JSX.Element };
  softwareGuid?: string;
  isSimpleDesignerMode?: boolean;
  dataModels?: DataModelViewModel[];
}

////For_Renderer

export interface RangeValidationSetting<T> {
  Min: T;
  Max: T;
}

export interface RequiredValidationSetting {
  Required: boolean;
}

export interface SimpleRegexValidationSetting {
  Regex: string;
}

export interface SimpleRegexValidationDataType {
  DataType: ColumnDataType;
}

export type ILayoutItemColumnSimpleValidation = {
  Name: any;
  ValidationTypes: Array<{
    type: ValidationType;
    widget: React.FunctionComponent<any>;
  }>;
};

export interface SimpleValidationGeneratorParams {
  viewModel: ColumnViewModel | RelationViewModel;
  layoutItemType: LayoutItemType;
  dataType: number;
}

export interface GetFieldConditionParams {
  layoutItem: LayoutItemDesignerViewModel;
  viewModel: ColumnViewModel | RelationViewModel;
  configeProps?: object;
}

export type IRelationConditionDataType = {
  Nature: RelationNature;
  Type: RelationType;
};
export interface ValidationCondition {
  operator: ConditionType;
  Widget?: ReactElementType;
  dataType?: ColumnDataType | IRelationConditionDataType;
  extraProps?: object;
}

export interface ILayoutItemComplexValidation {
  Name: string;
  ConditionTypes: Array<ValidationCondition>;
}

export interface IComplexValidationConditions {
  GetFieldComplexCondition: (
    params: GetFieldConditionParams
  ) => ILayoutItemComplexValidation;
  SimpleValidationGenerator: (
    params: SimpleValidationGeneratorParams
  ) => ILayoutItemColumnSimpleValidation;
}

export interface AddDrawingActionPayload extends FloorIdentify {
  RowId: number;
  ColumnId: number;
  FieldsetGuid: string;
  ItemType: LayoutItemType;
  DesignType: ArrangementType;
  NoneBindableType: NoneBindableWidgetType;
  Design: string;
}

export interface AutoCompleInitialDataObject {
  key: string;
  label: string;
  rowData: Array<{ Key: string; Value: string }>;
}

export interface AutoCompleDataObject {
  key: string;
  label: string;
  rowData: Array<{ KeyValues: Array<{ Key: string; Value: string }> }>;
}

export interface AggregationOneToManyValue {
  metadata: AggregaionComponentValueMetadata;
  tokens: Array<AggregationOneToManyValueTokens>;
}

export interface AggregationOneToManyValueTokens {
  id: string;
  rowData: Array<{ Key: string; Value: string }>;
  title: string;
}

interface AggregaionComponentValueMetadata {
  ColumnGuids: Array<string>;
  DataModelGuid: string;
}

export interface AggregationOneToOneValue {
  key: string;
  label: string;
  metadata: AggregaionComponentValueMetadata;
  rowData: Array<{ Key: string; Value: string }>;
  DefaultStaff?: boolean;
}

export interface ReferenceArchiveValue extends Omit<DataSetup, "row"> { }

export interface SettingFormItemProps<T> {
  initialSettingValues: T;
  settingName: string;
  form: WrappedFormUtils<any>;
  onSave: () => void;
  dataModel?: DataModelViewModel;
  key: string;
  viewModel?: any;
}

export type InitialDefineFormDataType<T> = Omit<T, "Row"> & {
  Row: SaveRowViewModel;
};
export type InitialArchiveFormDataType<T> = Omit<T, "Rows"> & {
  Rows: SaveRowViewModel[];
};

export interface getInitialDefaultValidationArgs {
  layoutItemGuid: string;
  attributes: any;
  type: LayoutItemType;
  simpleDesignerWidgetType: string;
}

export interface LayoutViewModelV2
  extends Omit<LayoutViewModel, "DataModelGuid"> {
  DataModels?: DataModelViewModel[];
}

interface LayoutItemSimpleDesignerData {
  ReferenceDataModelGuid?: string;
  simpleDesignerWidgetType?: string;
  RelationNature?: number;
  RelationType?: number;
  DataModelInfo?: any;
  relationCandidatesType?: DesignerItemType;
  ScopeGuid?: string;
  status: "added" | "modified" | "notchanged";
}

export interface RichLayoutItem extends LayoutItemViewModel {
  simpleDesignerData: LayoutItemSimpleDesignerData;
}

